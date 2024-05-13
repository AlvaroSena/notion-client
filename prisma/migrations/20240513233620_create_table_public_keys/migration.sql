/*
  Warnings:

  - You are about to drop the column `key_value` on the `api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `public_key` on the `api_keys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `api_keys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_key_id]` on the table `api_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_key_id` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `api_keys` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "api_keys_key_value_key";

-- DropIndex
DROP INDEX "api_keys_public_key_key";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "key_value",
DROP COLUMN "public_key",
ADD COLUMN     "public_key_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "is_email_confirmed" SET DEFAULT false;

-- CreateTable
CREATE TABLE "public_keys" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "public_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_keys_value_key" ON "public_keys"("value");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_value_key" ON "api_keys"("value");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_public_key_id_key" ON "api_keys"("public_key_id");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_public_key_id_fkey" FOREIGN KEY ("public_key_id") REFERENCES "public_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
