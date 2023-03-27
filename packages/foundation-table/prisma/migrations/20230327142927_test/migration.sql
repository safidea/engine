/*
  Warnings:

  - Added the required column `deleted_at` to the `table` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME NOT NULL,
    "string" TEXT NOT NULL,
    "integer" INTEGER NOT NULL,
    "integerWithDefaultValue" INTEGER NOT NULL DEFAULT 0,
    "datetime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_table" ("datetime", "id", "integer", "integerWithDefaultValue", "string") SELECT "datetime", "id", "integer", "integerWithDefaultValue", "string" FROM "table";
DROP TABLE "table";
ALTER TABLE "new_table" RENAME TO "table";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
