-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tableName" (
    "stringField" TEXT DEFAULT '',
    "stringWithDefaultValueField" TEXT DEFAULT 'default value',
    "integerField" INTEGER NOT NULL,
    "integerWithDefaultValueField" INTEGER NOT NULL DEFAULT 10,
    "datetimeField" DATETIME,
    "datetimeWithDefaultValueField" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "booleanField" BOOLEAN,
    "booleanWithDefaultValueField" BOOLEAN NOT NULL DEFAULT true,
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);
INSERT INTO "new_tableName" ("booleanField", "booleanWithDefaultValueField", "created_at", "datetimeField", "datetimeWithDefaultValueField", "deleted_at", "id", "integerField", "integerWithDefaultValueField", "stringField", "stringWithDefaultValueField", "updated_at") SELECT "booleanField", "booleanWithDefaultValueField", "created_at", "datetimeField", "datetimeWithDefaultValueField", "deleted_at", "id", "integerField", "integerWithDefaultValueField", "stringField", "stringWithDefaultValueField", "updated_at" FROM "tableName";
DROP TABLE "tableName";
ALTER TABLE "new_tableName" RENAME TO "tableName";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
