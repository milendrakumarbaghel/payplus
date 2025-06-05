import { getServerSession } from "next-auth";
import { P2PTransactions } from "../../../components/p2pTransactions";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { SendCard } from "../../../components/SendCard";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getP2PTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2PTransaction.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        toUserId: t.toUserId,
    }))
}

export default async function Transfer() {
    const balance = await getBalance();
    const transactions = await getP2PTransactions();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#6a51a6] mb-2">
                        Transfer
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Send money and view your P2P transaction history
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Left Column - Send Money */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Send Money
                            </h2>
                            <SendCard />
                        </div>
                    </div>

                    {/* Right Column - Balance & Transactions */}
                    <div className="space-y-6">
                        {/* Balance Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Account Balance
                                </h2>
                                <BalanceCard
                                    amount={balance.amount}
                                    locked={balance.locked}
                                />
                            </div>
                        </div>

                        {/* P2P Transactions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    P2P Transactions
                                </h2>
                                <P2PTransactions transactions={transactions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
