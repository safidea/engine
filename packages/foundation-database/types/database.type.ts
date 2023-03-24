export type Tables = {
  [key: string]: {
    [key: string]: {
      type: "string" | "integer" | "float" | "boolean" | "datetime";
      primary?: boolean;
      generated?: "increment";
      nullable?: boolean;
    }
  }
}

export type DatabaseConfig = {
  url: string;
  provider: "sqlite" | "mysql" | "postgresql" | "sqlserver" | "mongodb" | "cockroachdb";
  tables: Tables
}