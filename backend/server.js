const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();
const port = 3000;

// --- CORRECTION 1: ALLOW LIVE SERVER ---
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allows your Live Server to connect
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- DARAJA SANDBOX DETAILS ---
const CONSUMER_KEY = 'DAJ4TVWIDWFrwSzqw8s6O0BrmCgi9fTQnNjs7k9nTCq1AWMh';
const CONSUMER_SECRET = 'RNXea4PkWGw1IwoLIQEushraNNNjzNlXSxe1DCZ8GbrDfoUIn50Awc4nmTRHAS5f';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const SHORTCODE = '174379'; 
const CALLBACK_URL = 'https://mydomain.com/callback'; 

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
        console.error("Token Error:", error.response ? error.response.data : error.message);
    }
};

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

        console.log("M-Pesa Response:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("STK Push Error:", error.response ? error.response.data : error.message);
        res.status(500).json(error.response ? error.response.data : { error: "Server Error" });
    }
});

// --- CORRECTION 2: BIND TO 127.0.0.1 ---
app.listen(port, '127.0.0.1', () => {
    console.log(`🚀 Backend server is running on http://127.0.0.1:${port}`);
});