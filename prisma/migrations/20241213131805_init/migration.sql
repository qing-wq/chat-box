/*
  Warnings:

  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" TEXT NOT NULL PRIMARY KEY ,
    "title" TEXT NOT NULL,
    "updateTime" DATETIME NOT NULL
);
INSERT INTO "new_Chat" ("id", "title", "updateTime") SELECT "id", "title", "updateTime" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatId", "content", "createTime", "id", "role") SELECT "chatId", "content", "createTime", "id", "role" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
