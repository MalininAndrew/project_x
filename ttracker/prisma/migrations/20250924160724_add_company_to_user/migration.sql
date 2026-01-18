-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fk_company_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_company_id_fkey" FOREIGN KEY ("fk_company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
