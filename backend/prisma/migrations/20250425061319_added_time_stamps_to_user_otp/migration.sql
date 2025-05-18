/*
  Warnings:

  - The primary key for the `UserOtp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserOtp` table. All the data in the column will be lost.
  - Added the required column `deleteAt` to the `UserOtp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOtp" DROP CONSTRAINT "UserOtp_userId_fkey";

-- DropIndex
DROP INDEX "UserOtp_userId_key";

-- AlterTable
ALTER TABLE "UserOtp" DROP CONSTRAINT "UserOtp_pkey",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleteAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserOtp_pkey" PRIMARY KEY ("id");
