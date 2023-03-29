/*
  Warnings:

  - You are about to drop the `table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "table";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tableName" (
    "stringField" TEXT NOT NULL,
    "integerField" INTEGER NOT NULL,
    "integerWithDefaultValueField" INTEGER NOT NULL DEFAULT 0,
    "datetimeField" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME NOT NULL
);
