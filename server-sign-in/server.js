const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = 3000
app.use(express.json());

// Allow requests from your frontend origin
app.use(
  cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })
);
app.post('/generate-otp', async(req, res) => {
    const {phoneNumber} = req.body;
    await sendSMS('Your Verification Code is: ', phoneNumber ).then(response => 
        {
            if(response.success) 
            {
                res.json({ success: true, message: 'OTP sent successfully' });
            } else {
                res.status(500).json({ error: 'Failed to send OTP' });
            }
        })
})
app.post('/validate-otp',async(req,res)=>{
    const {phoneNumber,otp} = req.body;
    await validateOtp(phoneNumber,otp).then(response =>{
        if(response) {
            res.json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.status(500).json({ error: 'Invalid OTP' });
        }
    })
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.json());

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
function generateOTP() {
    const otp = Math.floor(Math.random() * 10000);
    
    return otp.toString().padStart(4, '0');
}

const sendSMS = async (body,number) =>{
    body = body + generateOTP();
    console.log(body,number);
    let msgOptions = {
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
        body: body
    }
    try{
        await client.messages.create(msgOptions).then(message => console.log(message.body));
        return { success: true, message: 'OTP sent successfully' }
    } catch(err) {
        console.error(err);
        return {error: 'Failed to send OTP' };
    }
} 
const validateOtp = async (number,otp)=> {
    if(number = '+918667330395' && otp == '3297') {
        return true;
    } else {
        return false;
    }
}