-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_public_key_id_fkey";

-- AlterTable
ALTER TABLE "api_keys" ALTER COLUMN "public_key_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_public_key_id_fkey" FOREIGN KEY ("public_key_id") REFERENCES "public_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
