/*
  Warnings:

  - You are about to drop the `TransferP2P` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransferP2P" DROP CONSTRAINT "TransferP2P_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "TransferP2P" DROP CONSTRAINT "TransferP2P_toUserId_fkey";

-- DropTable
DROP TABLE "TransferP2P";

-- CreateTable
CREATE TABLE "PtoPTransaction" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,

    CONSTRAINT "PtoPTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PtoPTransaction" ADD CONSTRAINT "PtoPTransaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PtoPTransaction" ADD CONSTRAINT "PtoPTransaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
