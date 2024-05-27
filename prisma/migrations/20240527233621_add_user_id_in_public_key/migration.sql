-- AlterTable
ALTER TABLE "public_keys" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public_keys" ADD CONSTRAINT "public_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
