import express from 'express';

const app = express();
app.post('/hdfcWebhook', (req, res) => {
    // TODO: validate the request
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount,
    };
    // update the payment status in the database
});
