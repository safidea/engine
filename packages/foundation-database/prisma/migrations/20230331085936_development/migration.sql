/*
  Warnings:

  - You are about to drop the `tableName` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tableName";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tasks" (
    "task" TEXT NOT NULL DEFAULT '',
    "done" BOOLEAN NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);
