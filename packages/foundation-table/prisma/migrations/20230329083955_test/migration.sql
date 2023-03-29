-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tableName" (
    "stringField" TEXT NOT NULL DEFAULT '',
    "stringWithDefaultValueField" TEXT NOT NULL DEFAULT 'default value',
    "integerField" INTEGER NOT NULL,
    "integerWithDefaultValueField" INTEGER NOT NULL DEFAULT 10,
    "datetimeField" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetimeWithDefaultValueField" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "booleanField" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tableName" ("booleanField", "created_at", "datetimeField", "datetimeWithDefaultValueField", "deleted_at", "id", "integerField", "integerWithDefaultValueField", "stringField", "stringWithDefaultValueField", "updated_at") SELECT "booleanField", "created_at", "datetimeField", "datetimeWithDefaultValueField", "deleted_at", "id", "integerField", "integerWithDefaultValueField", "stringField", "stringWithDefaultValueField", "updated_at" FROM "tableName";
DROP TABLE "tableName";
ALTER TABLE "new_tableName" RENAME TO "tableName";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
