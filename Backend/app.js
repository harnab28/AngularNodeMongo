const express = require("express");
const bodyParser = require("body-parser");
const postRoutes = require('./routes/post');

const mongoose = require('mongoose'); 

const app = express();
const db = mongoose
                  .connect('mongodb+srv://arnab:arnab123@socialmedia.asmqc.mongodb.net/node-angular?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true} )
                  .then(() => console.log('connected to database0'))
                  .catch(() => console.log('connection failed!')
          );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postRoutes);

module.exports = app;
