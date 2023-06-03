/*
  Warnings:

  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "orderTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,
    "deliveryAddressId" INTEGER NOT NULL
);
INSERT INTO "new_Order" ("deliveryAddressId", "id", "orderTime", "userId") SELECT "deliveryAddressId", "id", "orderTime", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Complaint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "refund" BOOLEAN NOT NULL DEFAULT false,
    "dateSent" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Complaint" ("content", "dateSent", "id", "orderId") SELECT "content", "dateSent", "id", "orderId" FROM "Complaint";
DROP TABLE "Complaint";
ALTER TABLE "new_Complaint" RENAME TO "Complaint";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
