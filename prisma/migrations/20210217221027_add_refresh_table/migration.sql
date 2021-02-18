-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_revoked" BOOLEAN NOT NULL,
    "expires" DATETIME NOT NULL
);
