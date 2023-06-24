-- CreateTable
CREATE TABLE "tasks" (
    "task" TEXT NOT NULL,
    "done" BOOLEAN,
    "priority" INTEGER,
    "description" TEXT,
    "assignee" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "categories" (
    "name" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);
