/*
  Warnings:

  - You are about to drop the `PtoPTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PtoPTransaction" DROP CONSTRAINT "PtoPTransaction_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "PtoPTransaction" DROP CONSTRAINT "PtoPTransaction_toUserId_fkey";

-- DropTable
DROP TABLE "PtoPTransaction";

-- CreateTable
CREATE TABLE "TransactionPersonToPerson" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,

    CONSTRAINT "TransactionPersonToPerson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionPersonToPerson" ADD CONSTRAINT "TransactionPersonToPerson_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionPersonToPerson" ADD CONSTRAINT "TransactionPersonToPerson_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
