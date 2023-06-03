-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dateReported" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("content", "dateReported", "id", "productId", "reportedBy") SELECT "content", "dateReported", "id", "productId", "reportedBy" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
