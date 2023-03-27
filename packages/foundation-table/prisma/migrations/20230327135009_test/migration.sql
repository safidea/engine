/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "string" TEXT NOT NULL DEFAULT '',
    "integer" INTEGER NOT NULL DEFAULT 0,
    "integerWithDefaultValue" INTEGER NOT NULL DEFAULT 0,
    "datetime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
