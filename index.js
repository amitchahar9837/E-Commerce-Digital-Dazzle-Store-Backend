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

app.use(cors());
app.use(express.json({limit:'5mb'}));
app.use(require('./routes/auth'))
app.use(require('./routes/users'))
app.use(require('./routes/product'))
app.use(require('./routes/cart'));


app.listen(Port,() =>{
    console.log("Connected to DB")
    console.log("Server is Running on Port: ",Port);
})

