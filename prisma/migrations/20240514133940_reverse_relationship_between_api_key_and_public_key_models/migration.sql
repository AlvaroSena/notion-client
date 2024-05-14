/*
  Warnings:

  - You are about to drop the column `public_key_id` on the `api_keys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_key_id]` on the table `public_keys` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_public_key_id_fkey";

-- DropIndex
DROP INDEX "api_keys_public_key_id_key";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "public_key_id";

-- AlterTable
ALTER TABLE "public_keys" ADD COLUMN     "public_key_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "public_keys_public_key_id_key" ON "public_keys"("public_key_id");

-- AddForeignKey
ALTER TABLE "public_keys" ADD CONSTRAINT "public_keys_public_key_id_fkey" FOREIGN KEY ("public_key_id") REFERENCES "api_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
