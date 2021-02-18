/*
  Warnings:

  - You are about to drop the `RefreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_revoked" BOOLEAN NOT NULL,
    "expires" DATETIME NOT NULL
);

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RefreshTokens";
PRAGMA foreign_keys=on;
