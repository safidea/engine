import type { Driver } from '@adapter/spi/RealtimeSpi'
import type { Params } from '@domain/services/Realtime'
import pg from 'pg'
import type { PersistedDto } from '@adapter/spi/dtos/RecordDto'
import EventEmitter from 'events'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@domain/services/Database'
import { Is } from '@domain/entities/filter/Is'

interface Payload {
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: PersistedDto
}

interface Listener {
  id: string
  action: Payload['action']
  table: string
  callback: (record: PersistedDto) => Promise<void>
}

export class RealtimeDriver implements Driver {
  private client: pg.Client | SqliteClient
  private emitter: EventEmitter
  private listeners: Listener[]

  constructor(public params: Params) {
    const { db, url } = params.database.params
    if (db === 'postgres') {
      const { Client } = pg
      this.client = new Client({
        connectionString: url,
      })
    } else if (db === 'sqlite') {
      this.client = new SqliteClient(params.database)
    } else throw new Error(`Database ${db} not supported`)
    this.emitter = new EventEmitter()
    this.emitter.on('INSERT', this.executeEvent)
    this.listeners = []
  }

  connect = async (tables: string[]) => {
    await this.client.connect()
    await this.setupDatabase(tables)
    this.client.on('notification', (msg) => {
      if (!msg.payload) return
      const payload: Payload = JSON.parse(msg.payload)
      this.emitter.emit(payload.action, payload)
    })
    await this.client.query('LISTEN realtime')
  }

  disconnect = async () => {
    await this.client.end()
  }

  onInsert = async (table: string, callback: (record: PersistedDto) => Promise<void>) => {
    const id = uuidv4()
    this.listeners.push({
      action: 'INSERT',
      table,
      callback,
      id,
    })
    return id
  }

  offInsert = async (id: string) => {
    this.listeners = this.listeners.filter((l) => l.id !== id)
  }

  private executeEvent = async (payload: Payload) => {
    const { action, table, record } = payload
    const listeners = this.listeners.filter((l) => l.table === table && l.action === action)
    const promises = []
    for (const listener of listeners) {
      promises.push(listener.callback(record))
    }
    await Promise.all(promises)
  }

  private setupDatabase = async (tables: string[]) => {
    const { db } = this.params.database.params
    if (db === 'sqlite') {
      for (const table of tables) {
        await this.client.query(`
          -- Trigger for INSERT
          CREATE TRIGGER IF NOT EXISTS after_insert_${table}_trigger
          AFTER INSERT ON ${table}
          BEGIN
              INSERT INTO _logs (table_name, action, record_id)
              VALUES ('${table}', 'INSERT', NEW.id);
          END;
          
          -- Trigger for UPDATE
          CREATE TRIGGER IF NOT EXISTS after_update_${table}_trigger
          AFTER UPDATE ON ${table}
          BEGIN
              INSERT INTO _logs (table_name, action, record_id)
              VALUES ('${table}', 'UPDATE', NEW.id);
          END;
          
          -- Trigger for DELETE
          CREATE TRIGGER IF NOT EXISTS after_delete_${table}_trigger
          AFTER DELETE ON ${table}
          BEGIN
              INSERT INTO _logs (table_name, action, record_id)
              VALUES ('${table}', 'DELETE', OLD.id);
          END;
        `)
      }
    } else if (db === 'postgres') {
      await this.client.query(`
        CREATE OR REPLACE FUNCTION notify_trigger_func() RETURNS trigger AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            PERFORM pg_notify('realtime', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'record', row_to_json(NEW))::text);
            RETURN NEW;
          ELSIF TG_OP = 'UPDATE' THEN
            PERFORM pg_notify('realtime', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'record', row_to_json(NEW))::text);
            RETURN NEW;
          ELSIF TG_OP = 'DELETE' THEN
            PERFORM pg_notify('realtime', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'record', row_to_json(OLD))::text);
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
      `)
      for (const table of tables) {
        await this.client.query(`
          DO $$
          DECLARE
              trigger_name text;
          BEGIN
              -- Specify your table name here
              DECLARE r RECORD := ROW('${table}');
          
              -- Check and create trigger for AFTER INSERT
              trigger_name := r.table_name || '_after_insert';
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
                  EXECUTE format('CREATE TRIGGER %I AFTER INSERT ON %I FOR EACH ROW EXECUTE FUNCTION notify_trigger_func();', trigger_name, r.table_name);
              END IF;
          
              -- Check and create trigger for AFTER UPDATE
              trigger_name := r.table_name || '_after_update';
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
                  EXECUTE format('CREATE TRIGGER %I AFTER UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION notify_trigger_func();', trigger_name, r.table_name);
              END IF;
          
              -- Check and create trigger for AFTER DELETE
              trigger_name := r.table_name || '_after_delete';
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
                  EXECUTE format('CREATE TRIGGER %I AFTER DELETE ON %I FOR EACH ROW EXECUTE FUNCTION notify_trigger_func();', trigger_name, r.table_name);
              END IF;
          END $$;
        `)
      }
    }
  }
}

export class SqliteClient {
  private interval?: Timer

  constructor(private db: Database) {}

  connect = async () => {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS _logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT,
        action TEXT,
        record_id TEXT,
        processed INTEGER DEFAULT 0
      );
    `)
  }

  end = async () => {
    if (this.interval) clearInterval(this.interval)
  }

  on = (_: 'notification', callback: (options: { payload: string }) => void) => {
    this.interval = setInterval(async () => {
      const logs = await this.db.table('_logs').list([new Is({ field: 'processed', value: 0 })])
      for (const log of logs) {
        const tableName = log.getFieldAsString('table_name')
        const recordId = log.getFieldAsString('record_id')
        const record = await this.db
          .table(tableName)
          .read([new Is({ field: 'id', value: recordId })])
        if (!record) throw new Error(`Record with id ${recordId} not found in table ${tableName}`)
        callback({
          payload: JSON.stringify({
            action: log.getFieldAsString('action'),
            table: tableName,
            record: record.data,
          }),
        })
        await this.db.exec(
          `UPDATE _logs SET processed = 1 WHERE id = ${log.getFieldAsString('id')}`
        )
      }
    }, 500)
  }

  query = async (query: string) => {
    if (query !== 'LISTEN realtime') await this.db.exec(query)
  }
}
