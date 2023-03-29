-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
