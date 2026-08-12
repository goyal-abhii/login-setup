const express = require('express');
const app = express();

const userModel=require('./models/user.js')
const postModel=require('./models/post.js')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const isLoggedIn=(req,res,next)=>{
  const token=req.cookies.token;
  if(!token){
    res.redirect('/');
  }
  else{
    const decoded_data=jwt.verify(token, 'secret');
    req.user=decoded_data;
    next();
  }
}

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/create-user', (req, res) => {
  res.render('create');
});


app.post('/create-user', async (req, res) => {
  const { username,name, email, password,age } = req.body;
  //checking if user already exists
    console.log("BODY:", req.body);
    console.log("EMAIL:", email);
  let userExists=await userModel.findOne({
    $or: [
        { username: username },
        { email: email }
    ]
  })
  if(userExists){
    return res.status(409).send('User already exists');
  }
  //hasing the password
  let saltrounds=10;
  let hashpass=await bcrypt.hash(password,saltrounds);
  //creatng the user
  const user= await userModel.create({
    username,
    name,
    email,
    password: hashpass,
    age
  })
  res.send('User created successfully');
})


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let user=await userModel.findOne({username})
  if(!user){
    return res.send('User not found');
  } 
  const isValid=await bcrypt.compare(password, user.password);
  if(!isValid){
    return res.send('Invalid password');
  }
  const token=jwt.sign({email:user.email,userid:user._id}, 'secret');
  res.cookie('token', token);
  res.redirect('/dashboard');
})

app.get('/dashboard', isLoggedIn, async (req, res) => {
    res.send(req.user);
});

//middleware for authentication

app.listen(3000, (err) => {
    console.log('Server is running on port 3000');
});