/*
  Warnings:

  - Added the required column `client_id` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "expires" DATETIME NOT NULL
);
INSERT INTO "new_RefreshToken" ("id", "token", "is_revoked", "expires") SELECT "id", "token", "is_revoked", "expires" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
