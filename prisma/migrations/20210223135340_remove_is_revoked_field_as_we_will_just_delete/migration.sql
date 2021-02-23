/*
  Warnings:

  - You are about to drop the column `is_revoked` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "expires" INTEGER NOT NULL
);
INSERT INTO "new_RefreshToken" ("id", "token", "client_id", "expires") SELECT "id", "token", "client_id", "expires" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
