import type { Persisted } from '@domain/entities/Record/Persisted'
import type { Logger } from './Logger'
import type { Table } from '@domain/entities/Table'
import type { IdGenerator } from './IdGenerator'
import type { Database, NotificationEvent } from './Database'

export interface Config {
  type: string
  url: string
}

export interface Services {
  logger: Logger
  idGenerator: IdGenerator
  database: Database
}

export type Action = 'INSERT' | 'UPDATE' | 'DELETE'

interface RealtimeEvent {
  action: Action
  table: string
}

export interface PostgresRealtimeNotificationEvent extends RealtimeEvent {
  type: 'PostgresRealtime'
  record: Persisted
}

export interface SqliteRealtimeNotificationEvent extends RealtimeEvent {
  type: 'SqliteRealtime'
  record_id: string
}

interface Listener {
  id: string
  action: Action
  table: string
  callback: (record: Persisted) => Promise<void>
}

export class Realtime {
  private db: Database
  private log: (message: string) => void
  private listeners: Listener[]

  constructor(private services: Services) {
    const { logger, database } = services
    this.db = database
    this.log = logger.init('realtime')
    this.listeners = []
  }

  setup = async (tables: Table[]) => {
    this.log('setup realtime...')
    this.db.onNotification(this.onEvent)
    await this.setupTriggers(tables)
    if (this.db.type === 'postgres') {
      await this.db.exec(`LISTEN realtime`)
    }
  }

  onInsert = (table: string, callback: (record: Persisted) => Promise<void>) => {
    const { idGenerator } = this.services
    const id = idGenerator.forListener()
    this.listeners.push({
      action: 'INSERT',
      table,
      callback,
      id,
    })
    this.log(`subscribed to insert events with id "${id}" on table "${table}"`)
    return id
  }

  removeListener = (id: string) => {
    this.listeners = this.listeners.filter((l) => l.id !== id)
    this.log(`unsubscribing from insert events with id "${id}"`)
  }

  private onEvent = async (event: NotificationEvent) => {
    const { action, table, type } = event
    let record: Persisted
    if (type === 'PostgresRealtime') {
      record = event.record
    } else if (type === 'SqliteRealtime') {
      const result = await this.db.table(table).readById(event.record_id)
      if (!result) return
      record = result
    } else {
      return
    }
    this.log(`received event on table "${table}" with action "${action}" for record "${record.id}"`)
    const listeners = this.listeners.filter((l) => l.table === table && l.action === action)
    const promises = []
    for (const listener of listeners) {
      promises.push(listener.callback(record))
    }
    await Promise.all(promises)
  }

  private setupTriggers = async (tables: Table[]) => {
    if (this.db.type === 'sqlite') {
      for (const { name: table } of tables) {
        await this.db.exec(`
          -- Trigger for INSERT
          CREATE TRIGGER IF NOT EXISTS after_insert_${table}_trigger
          AFTER INSERT ON ${table}
          BEGIN
              INSERT INTO _notifications (payload)
              VALUES (json_object('type', 'SqliteRealtime', 'table', '${table}', 'action', 'INSERT', 'record_id', NEW.id));
          END;
          
          -- Trigger for UPDATE
          CREATE TRIGGER IF NOT EXISTS after_update_${table}_trigger
          AFTER UPDATE ON ${table}
          BEGIN
              INSERT INTO _notifications (payload)
              VALUES (json_object('type', 'SqliteRealtime', 'table', '${table}', 'action', 'UPDATE', 'record_id', NEW.id));
          END;
          
          -- Trigger for DELETE
          CREATE TRIGGER IF NOT EXISTS after_delete_${table}_trigger
          AFTER DELETE ON ${table}
          BEGIN
              INSERT INTO _notifications (payload)
              VALUES (json_object('type', 'SqliteRealtime', 'table', '${table}', 'action', 'DELETE', 'record_id', OLD.id));
          END;
        `)
      }
    } else if (this.db.type === 'postgres') {
      await this.db.exec(`
        CREATE OR REPLACE FUNCTION notify_trigger_func() RETURNS trigger AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            PERFORM pg_notify('realtime', json_build_object('type', 'PostgresRealtime', 'table', TG_TABLE_NAME, 'action', TG_OP, 'record', row_to_json(NEW))::text);
            RETURN NEW;
          ELSIF TG_OP = 'UPDATE' THEN
            PERFORM pg_notify('realtime', json_build_object('type', 'PostgresRealtime', 'table', TG_TABLE_NAME, 'action', TG_OP, 'record', row_to_json(NEW))::text);
            RETURN NEW;
          ELSIF TG_OP = 'DELETE' THEN
            PERFORM pg_notify('realtime', json_build_object('type', 'PostgresRealtime', 'table', TG_TABLE_NAME, 'action', TG_OP, 'record', row_to_json(OLD))::text);
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
      `)
      for (const { name: table } of tables) {
        await this.db.exec(`
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
