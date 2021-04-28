require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();

//My Routes

var authRoutes = require('./routes/auth');
var userRoutes = require('./routes/user');
var categoryRoutes = require('./routes/category');

//DB Connection
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})
  .then(() => {
    console.log("DB CONNECTED")
  })
  .catch(
    console.log("DB NOT CONNECTED")
  )
//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);

//Ports
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app is running at:${port}`)
})