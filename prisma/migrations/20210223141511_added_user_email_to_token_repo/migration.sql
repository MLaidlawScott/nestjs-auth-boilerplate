/*
  Warnings:

  - Added the required column `user_email` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "expires" INTEGER NOT NULL
);
INSERT INTO "new_RefreshToken" ("id", "token", "client_id", "expires") SELECT "id", "token", "client_id", "expires" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
