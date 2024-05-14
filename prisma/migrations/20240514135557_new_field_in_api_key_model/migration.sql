/*
  Warnings:

  - Added the required column `notionDatabaseId` to the `api_keys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN     "notionDatabaseId" TEXT NOT NULL;
