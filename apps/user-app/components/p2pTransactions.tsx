import { Card } from "@repo/ui/card";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";


async function getUserName(id: number): Promise<string> {
    const user = await db.user.findUnique({ where: { id } });
    return user?.name ?? "Unknown User";
}


export const P2PTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        toUserId: number
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent P2P Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>;
    }
    return <Card title="Recent P2P Transactions">
        <div className="pt-2">
            {transactions.map((t, index) => (
                <div key={index} className="flex justify-between">
                    <div>
                        <div className="text-sm">
                            Sent Rs {t.amount / 100}
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        To {getUserName(t.toUserId)}
                    </div>
                </div>
            ))}
        </div>
    </Card>;
}
