const express = require('express')
const Router = express.Router()
const { fetchDataFromMessageBird} = require('./controller')


Router
    .post('/conversation', fetchDataFromMessageBird)
    .get('/', (req, res)=> {
        res.json({
        message: 'Hello from REST API',
        author: 'sulfikardi'
    })
})


module.exports = Router