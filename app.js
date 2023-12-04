var express = require("express");
var indexRouter = require("./routes/index.js");
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


app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('IT IS RUNNING ON 3000');
});
