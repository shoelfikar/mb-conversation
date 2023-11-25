require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const morgan = require('morgan');
const Router = require('./routes');



app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/', Router)


app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`)
})