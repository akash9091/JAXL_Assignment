const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const LocalStorage = require('node-localstorage').LocalStorage;
const path = require('path');

const app = express();

app.engine('handlebars', exphbs.engine({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ " }));
app.set('view engine', 'handlebars');

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

localStorage = new LocalStorage('./scratch');

app.get('/', (req, res) => {
  const availableEmail = localStorage.getItem('email');
  if (availableEmail) {
    res.render('success', { email: availableEmail });
  }
  else{
    res.render('signIn');
  }
});

var OTP = Math.floor((Math.random()*10000)+1);
var email = "";
var flg=0;
setInterval(() => {
  OTP = Math.floor((Math.random()*10000)+1);
  if(flg==0)
  console.log("New OTP : ",OTP," is sent to",email,"it will be valid for 30 seconds.");
},30000)

app.post('/send', (req, res) => {
  console.log("New OTP : ",OTP," is sent to", req.body.email,"it will be valid for 30 seconds.");
  email = req.body.email;
  res.status(200);
  res.render('OTP', { msg: "OTP has been sent to terminal.", email });
});

app.post('/signout', (req, res) => {
  flg=0;
  localStorage.clear();
  res.render('signIn');
})

app.post('/verify', (req, res) => {
  if (req.body.otp == OTP){
    localStorage.setItem('email', req.body.email)
    flg=1;
    res.status(200);
    res.render('success', { email: req.body.email })
  }
  else{
    res.status(400);
    res.render('OTP', {msg: 'OTP is incorrect / OTP expire'});
  }
});


app.post('/resend', (req, res) => {
  console.log("New OTP : ", OTP, "is sent to", req.body.email,"it will be valid for 30 seconds.");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})