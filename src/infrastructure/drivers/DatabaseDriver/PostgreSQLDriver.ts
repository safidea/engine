import pg from 'pg'
import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { PostgreSQLTableDriver } from './PostgreSQLTableDriver'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'

export class PostgreSQLDriver implements Driver {
  private _db: pg.Pool
  private _client?: pg.PoolClient
  private _interval?: Timer

  constructor(config: Config) {
    const { url } = config
    const NUMERIC_OID = 1700
    const pool = new pg.Pool({ connectionString: url })
    pool.on('error', () => {})
    pool.on('connect', (client) => {
      client.on('error', () => {})
      client.setTypeParser(NUMERIC_OID, (value) => parseFloat(value))
    })
    this._db = pool
  }

  connect = async (): Promise<void> => {
    this._client = await this._db.connect()
  }

  disconnect = async (): Promise<void> => {
    if (this._interval) clearInterval(this._interval)
    if (this._client) this._client.release()
    await this._db.end()
  }

  exec = async (query: string): Promise<void> => {
    if (this._client && query.includes('LISTEN')) await this._client.query(query)
    else await this._db.query(query)
  }

  query = async <T>(
    text: string,
    values: (string | number | Buffer | Date)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    const { rows, rowCount } = await this._db.query(text, values)
    return { rows, rowCount: rowCount || 0 }
  }

  table = (name: string, fields: FieldDto[]) => {
    return new PostgreSQLTableDriver(name, fields, this._db)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    if (this._client) {
      if (event === 'notification')
        this._client.on('notification', ({ payload }) => {
          if (payload) callback({ notification: JSON.parse(payload), event: 'notification' })
        })
      if (event === 'error')
        this._client.on('error', ({ message }) => {
          callback({ message, event: 'error' })
        })
    }
    this._db.on('error', ({ message }) => {
      callback({ message, event: 'error' })
    })
  }

  setupTriggers = async (tables: string[]) => {
    await this._db.query(`
      CREATE OR REPLACE FUNCTION notify_trigger_func() RETURNS trigger AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          PERFORM pg_notify('realtime', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'record_id', NEW.id)::text);
          RETURN NEW;
        ELSIF TG_OP = 'UPDATE' THEN
          PERFORM pg_notify('realtime', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'record_id', NEW.id)::text);
          RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
          PERFORM pg_notify('realtime', json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'record_id', OLD.id)::text);
          RETURN OLD;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `)
    for (const table of tables) {
      await this._db.query(`
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
