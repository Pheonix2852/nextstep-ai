/*
  Warnings:

  - Added the required column `status` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoverLetter" ADD COLUMN     "status" TEXT NOT NULL;
