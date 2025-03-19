const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const Redis = require('ioredis');
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

// establishing redis connection
const redis = new Redis({
    host: process.env.LOCALHOST,  // Redis server host
    port: process.env.REDIS_PORT,         // Redis server port
    // password: 'your-redis-password', // Uncomment if your Redis requires authentication
});

// ------- testing purpose ------

// app.get('/',async(req,res)=>{
//     // const otpKey = `otp:${phoneNumber}`;
//     const otpKey = `otp:+918667330395`;
//     const otp = '9234';
//     await redis.set(otpKey, otp, 'EX', 600);
//     const attemptsKey = `attempts:+918667330395`;
//     await redis.set(attemptsKey, 0, 'EX', 600);
//     console.log("set");
//     res.json({ success: true, message: 'OTP verified successfully' });
// });

// app.get("/get",async(req,res)=>{
//     // const otpKey = `otp:${phoneNumber}`;
//     const otpKey = `otp:+918667330395`;
//     const storedOTP = await redis.get(otpKey);
//     const attemptKey = `attempts:+918667330395`;
//     console.log("stored otp",storedOTP);
//     const attkey = await redis.get(attemptKey);
//     await redis.del(otpKey);
//         await redis.del(attemptKey);
//     res.json({ success: true, attemptKey: attkey,storedOTP:storedOTP });
// })
// ------- testing purpose ------

// controller to handle otp generation

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
// to handle validating otp

app.post('/validate-otp',async(req,res)=>{
    const {phoneNumber,otp} = req.body;
    return await validateOtp(phoneNumber,otp)
    .then(response =>{
        if(response.status == 200) {
            res.json({ success: true, message: 'OTP verified successfully' });
        } else if(response.status == 400){
            res.status(response.status).json({ error: response.errMsg })
        } else {
            res.status(response.status).json({ error: response.errMsg, attemptsLeft: response.attemptsLeft });
        }
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
function generateOTP() {
    const otp = Math.floor(Math.random() * 10000);
    
    return otp.toString().padStart(4, '0');
}

// function using twilio to send message and saving the otp in redis
const sendSMS = async (body,number) =>{
    const generatedOTP = generateOTP();
    body = body + generatedOTP;
    let msgOptions = {
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
        body: body
    }
    try{
        await client.messages.create(msgOptions).then(
            async (message) =>{
                const otpKey = `otp:${number}`;
                const otp = generatedOTP;
                await redis.set(otpKey, otp, 'EX', 300);
                const attemptsKey = `attempts:${number}`;
                await redis.set(attemptsKey, 0, 'EX', 300);
            }
        );
        return { success: true, message: 'OTP sent successfully' }
    } catch(err) {
        console.error(err);
        return {error: 'Failed to send OTP' };
    }
} 

// function for validating the otp retrieving the otp from redis
const validateOtp = async (number,otp,res)=> {
    const otpKey = `otp:${number}`;
    const storedOTP = await redis.get(otpKey);
    const attemptKey = `attempts:${number}`;
    let attemptLeft = await redis.get(attemptKey);
    if(attemptLeft == null) {
        return {status:400,errMsg: 'No Valid Entry Found.' };
    }
    attemptLeft++; 
    await redis.set(attemptKey, attemptLeft, 'EX', 300);
    if (attemptLeft > 3) {
        await redis.del(otpKey);
        await redis.del(attemptKey);
        return {status:400,errMsg: 'Too many failed attempts. Please request a new OTP.' };
    }
    if(storedOTP == otp) {
        await redis.del(otpKey);
        await redis.del(attemptKey);
        return {status:200};
    } else {
        return {status:401,errMsg: 'Invalid OTP',attemptsLeft: 3 - attemptLeft };
    }
}