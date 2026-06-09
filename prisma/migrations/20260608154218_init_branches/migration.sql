/*
  Warnings:

  - You are about to drop the column `customerName` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "branchId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalSale" REAL NOT NULL,
    "profit" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("createdAt", "id", "profit", "quantity", "totalSale") SELECT "createdAt", "id", "profit", "quantity", "totalSale" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
