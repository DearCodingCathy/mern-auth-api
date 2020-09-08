const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express();

// import routes 
const authRoutes = require('./routes/auth')

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser().json());
app.use(cors()); // allows all origins

// Ensure client is running on 3000 if you use below.
// if (process.env.NODE_ENV = 'development') {
//   app.use(cors({ origin: `http://localhost:3000` }));
// }





// middleware
app.use('/api', authRoutes)

const port = process.env.port || 8000;

app.listen(port, () => {
  console.log(`API is running in port ${port}`);
});