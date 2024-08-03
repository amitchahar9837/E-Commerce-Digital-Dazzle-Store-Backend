const express = require('express');
const cors = require('cors');
const Port = process.env.PORT || 8080;
const connectDB = require('./config/db')
require('dotenv').config();
const app = express();

connectDB()
require('./model/user');
require('./model/product')
require('./model/cart')

app.use(cors({
    origin: '*', // Allow all origins (you can restrict this to specific origins if needed)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies and authentication headers
}));
app.use(express.json({limit:'5mb'}));
app.use(require('./routes/auth'))
app.use(require('./routes/users'))
app.use(require('./routes/product'))
app.use(require('./routes/cart'));
app.use(require('./routes/order'))


app.listen(Port,() =>{
    console.log("Connected to DB")
    console.log("Server is Running on Port: ",Port);
})

