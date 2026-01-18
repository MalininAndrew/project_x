/*
  Warnings:

  - You are about to drop the column `fk_company_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fk_company_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fk_company_id";
