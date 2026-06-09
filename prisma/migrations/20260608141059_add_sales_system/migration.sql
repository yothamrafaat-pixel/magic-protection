/*
  Warnings:

  - You are about to drop the column `unitCost` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `profit` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSale` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "costPrice" REAL NOT NULL DEFAULT 0,
    "sellingPrice" REAL NOT NULL DEFAULT 0,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_InventoryItem" ("category", "createdAt", "id", "name", "quantity", "sellingPrice") SELECT "category", "createdAt", "id", "name", "quantity", coalesce("sellingPrice", 0) AS "sellingPrice" FROM "InventoryItem";
DROP TABLE "InventoryItem";
ALTER TABLE "new_InventoryItem" RENAME TO "InventoryItem";
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalCost" REAL NOT NULL,
    "totalSale" REAL NOT NULL,
    "profit" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Sale" ("createdAt", "customerName", "id", "productName", "quantity") SELECT "createdAt", "customerName", "id", "productName", "quantity" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
