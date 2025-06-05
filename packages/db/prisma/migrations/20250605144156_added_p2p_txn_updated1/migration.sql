/*
  Warnings:

  - You are about to drop the `P2PTransfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "P2PTransfer" DROP CONSTRAINT "P2PTransfer_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "P2PTransfer" DROP CONSTRAINT "P2PTransfer_toUserId_fkey";

-- DropTable
DROP TABLE "P2PTransfer";

-- CreateTable
CREATE TABLE "TransferP2P" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,

    CONSTRAINT "TransferP2P_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransferP2P" ADD CONSTRAINT "TransferP2P_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferP2P" ADD CONSTRAINT "TransferP2P_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
