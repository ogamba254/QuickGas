const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();

const port = process.env.PORT || 3000;

// Temporary "Database" to store payment statuses
// In a real production app, use MongoDB or Firebase here.
const payments = {}; 

app.use(cors({
    origin: ['https://quickgass.netlify.app', 'http://127.0.0.1:5500'], 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const CONSUMER_KEY = 'DAJ4TVWIDWFrwSzqw8s6O0BrmCgi9fTQnNjs7k9nTCq1AWMh';
const CONSUMER_SECRET = 'RNXea4PkWGw1IwoLIQEushraNNNjzNlXSxe1DCZ8GbrDfoUIn50Awc4nmTRHAS5f';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const SHORTCODE = '174379'; 
const CALLBACK_URL = 'https://quickgas-1.onrender.com/callback'; 
const BASE_URL = 'https://sandbox.safaricom.co.ke'; 

const getAccessToken = async () => {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    try {
        const response = await axios.get(
            `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
            { headers: { Authorization: `Basic ${auth}` } }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Token Error:", error.message);
    }
};

// 1. STK PUSH ROUTE
app.post('/stkpush', async (req, res) => {
    try {
        const { phone, amount } = req.body;
        const token = await getAccessToken();
        
        const date = new Date();
        const timestamp = date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

        const data = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", 
            Amount: amount,
            PartyA: phone,
            PartyB: SHORTCODE,
            PhoneNumber: phone,
            CallBackURL: CALLBACK_URL,
            AccountReference: "QuickGas",
            TransactionDesc: "Gas Payment"
        };

        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Initialize this transaction in our memory as "PENDING"
        if (response.data.CheckoutRequestID) {
            payments[response.data.CheckoutRequestID] = "PENDING";
        }

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "STK Push Failed" });
    }
});

// 2. CALLBACK ROUTE (Safaricom calls this)
app.post('/callback', (req, res) => {
    const callbackData = req.body.Body.stkCallback;
    const checkoutID = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    console.log(`Callback received for ${checkoutID}. Code: ${resultCode}`);

    if (resultCode === 0) {
        // ResultCode 0 means Success
        payments[checkoutID] = "PAID";
    } else {
        // Any other code means cancelled or failed
        payments[checkoutID] = "FAILED";
    }

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

// 3. QUERY STATUS ROUTE (Your Frontend calls this)
app.get('/query-status/:id', (req, res) => {
    const checkoutID = req.params.id;
    const status = payments[checkoutID] || "NOT_FOUND";
    
    res.json({ status: status });
});

app.get('/', (req, res) => {
    res.send('QuickGas Backend is Live!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Backend server is running on port ${port}`);
});