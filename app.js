var express = require("express");
var indexRouter = require("./routes/index.js");
var nodemailer = require("nodemailer");
const { auth } = require("express-openid-connect");
require("dotenv").config();
const bodyParser = require('body-parser');
const FoodBot = require('./services/openaiService.js');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
};

var app = express();
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(bodyParser.json());

// Initializing FoodBot instance separately
const foodBot = new FoodBot(process.env.OPENAI_API_KEY);

app.post('/chat', async (req, res) => {
  const { user_input } = req.body;
  const chatGPTReply = await foodBot.getFoodRecommendation(user_input);
  res.json({ reply: chatGPTReply });
});

// Auth middleware using config
app.use(auth(config));

app.get('/foodbot', (req, res) => {
  res.render('foodbot', { 
    title: 'FOODGPT',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});

app.get('/terms-of-use', (req, res) => {
  res.render('ToU', {
    title: 'Terms of Use',
    
  });
});

app.get('/privacy-policy', (req, res) => {
  res.render('PP', {
    title: 'Privacy Policy',
    
  });
});

app.post('/send-email', async (req, res) => {
  const { email, phone, message } = req.body;
  // Create a Nodemailer transporter using your email provider
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'foodGPTServices@gmail.com', // Your Gmail address
        pass: 'dtibcmurrxbbwtmj',
    },
  });
  // Define email options
  const mailOptions = {
    from: "cameraExpert18@gmail.com",
    to: "foodGPTServices@gmail.com", // Hardcoded recipient
    subject: email,
    text: `Contact No: ${phone} \nMessage: ${message}`,
  };
  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully'); // Log success to console
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
    return; // Exit the function to prevent further execution on error
  }
  // Optionally, you can send a response to the client or log to the console
  res.status(200).json({ success: true });
});


app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('IT IS RUNNING ON 3000');
});
