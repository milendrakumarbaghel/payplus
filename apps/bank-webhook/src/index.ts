import express, { Request, Response, NextFunction, Application } from 'express';
import db from '@repo/db/client';

const app: Application = express();
app.use(express.json());

const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

const hdfcWebhookHandler = asyncHandler(async (req: Request, res: Response) => {
    // TODO: validate the request
    // check if the request is actually coming from HDFC, use a webhook secret here
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

    const existingTransaction = await db.onRampTransaction.findFirst({
        where: { token: req.body.token }
    });
    
    if (!existingTransaction || existingTransaction.status !== "Processing") {
        return res.status(400).json({
            message: "Transaction is not in processing state"
        });
    }

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    // update the payment status in the database
    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
});

app.post('/hdfcWebhook', hdfcWebhookHandler);

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});
