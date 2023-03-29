-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tableName" (
    "stringField" TEXT NOT NULL DEFAULT '',
    "integerField" INTEGER NOT NULL DEFAULT 0,
    "integerWithDefaultValueField" INTEGER NOT NULL DEFAULT 10,
    "datetimeField" DATETIME NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tableName" ("created_at", "datetimeField", "deleted_at", "id", "integerField", "integerWithDefaultValueField", "stringField", "updated_at") SELECT "created_at", "datetimeField", "deleted_at", "id", "integerField", "integerWithDefaultValueField", "stringField", "updated_at" FROM "tableName";
DROP TABLE "tableName";
ALTER TABLE "new_tableName" RENAME TO "tableName";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
