import type { Driver } from '@adapter/spi/RealtimeSpi'
import pg from 'pg'
import EventEmitter from 'events'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import type { Config } from '@domain/services/Realtime'
import { DatabaseDriver } from './DatabaseDriver'

export class RealtimeDriver implements Driver {
  private client: pg.Client | SqliteClient
  emitter: EventEmitter

  constructor(config: Config) {
    const { type, url } = config
    if (type === 'postgres') {
      const { Client } = pg
      this.client = new Client({
        connectionString: url,
      })
    } else if (type === 'sqlite') {
      this.client = new SqliteClient(config)
    } else throw new Error(`Database ${type} not supported`)
    this.emitter = new EventEmitter()
  }

  connect = async (tables: string[]) => {
    await this.client.connect()
    await this.setupDatabase(tables)
    this.client.on('notification', (msg) => {
      if (!msg.payload) return
      const event: EventDto = JSON.parse(msg.payload)
      this.emitter.emit('EVENT', event)
    })
    await this.client.query('LISTEN realtime')
  }

  disconnect = async () => {
    await this.client.end()
  }

  private setupDatabase = async (tables: string[]) => {
    if (this.client instanceof SqliteClient) {
      for (const table of tables) {
        await this.client.query(`
          -- Trigger for INSERT
          CREATE TRIGGER IF NOT EXISTS after_insert_${table}_trigger
          AFTER INSERT ON ${table}
          BEGIN
              INSERT INTO _actions (table_name, action, record_id)
              VALUES ('${table}', 'INSERT', NEW.id);
          END;
          
          -- Trigger for UPDATE
          CREATE TRIGGER IF NOT EXISTS after_update_${table}_trigger
          AFTER UPDATE ON ${table}
          BEGIN
              INSERT INTO _actions (table_name, action, record_id)
              VALUES ('${table}', 'UPDATE', NEW.id);
          END;
          
          -- Trigger for DELETE
          CREATE TRIGGER IF NOT EXISTS after_delete_${table}_trigger
          AFTER DELETE ON ${table}
          BEGIN
              INSERT INTO _actions (table_name, action, record_id)
              VALUES ('${table}', 'DELETE', OLD.id);
          END;
        `)
      }
    } else if (this.client instanceof pg.Client) {
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
              table_name text := '${table}';
          BEGIN
              -- Check and create trigger for AFTER INSERT
              trigger_name := table_name || '_after_insert';
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
                  EXECUTE format('CREATE TRIGGER %I AFTER INSERT ON %I FOR EACH ROW EXECUTE FUNCTION notify_trigger_func();', trigger_name, table_name);
              END IF;
          
              -- Check and create trigger for AFTER UPDATE
              trigger_name := table_name || '_after_update';
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
                  EXECUTE format('CREATE TRIGGER %I AFTER UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION notify_trigger_func();', trigger_name, table_name);
              END IF;
          
              -- Check and create trigger for AFTER DELETE
              trigger_name := table_name || '_after_delete';
              IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trigger_name) THEN
                  EXECUTE format('CREATE TRIGGER %I AFTER DELETE ON %I FOR EACH ROW EXECUTE FUNCTION notify_trigger_func();', trigger_name, table_name);
              END IF;
          END $$;
        `)
      }
    }
  }
}

export class SqliteClient {
  private db: DatabaseDriver
  private interval?: Timer

  constructor(config: Config) {
    this.db = new DatabaseDriver(config)
  }

  connect = async () => {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS _actions (
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
      const logs = await this.db
        .table('_actions')
        .list([{ field: 'processed', operator: '=', value: 0 }])
      for (const log of logs) {
        const tableName = String(log.table_name)
        const recordId = String(log.record_id)
        const record = await this.db
          .table(tableName)
          .read([{ field: 'id', operator: '=', value: recordId }])
        if (record)
          callback({
            payload: JSON.stringify({
              action: String(log.action),
              table: tableName,
              record: record.data,
            }),
          })
        await this.db.exec(`UPDATE _actions SET processed = 1 WHERE id = ${log.id}`)
      }
    }, 500)
  }

  query = async (query: string) => {
    if (query !== 'LISTEN realtime') await this.db.exec(query)
  }
}
