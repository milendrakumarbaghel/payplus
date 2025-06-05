/*
  Warnings:

  - You are about to drop the `TransactionPersonToPerson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransactionPersonToPerson" DROP CONSTRAINT "TransactionPersonToPerson_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionPersonToPerson" DROP CONSTRAINT "TransactionPersonToPerson_toUserId_fkey";

-- DropTable
DROP TABLE "TransactionPersonToPerson";

-- CreateTable
CREATE TABLE "P2PTransaction" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,

    CONSTRAINT "P2PTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "P2PTransaction" ADD CONSTRAINT "P2PTransaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransaction" ADD CONSTRAINT "P2PTransaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
