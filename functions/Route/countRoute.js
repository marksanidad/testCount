const express = require('express');
const apiRoute = express();
const countFunc = require('../Functions/countFunction')
const rateFunc = require('../Functions/rateFunction')

apiRoute.post('/postCount', (req, res) => {
    countFunc.postAddCount(req.query, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error', { result })
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

apiRoute.post('/postRate', (req, res) => {
    rateFunc.postRate(req.query, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

module.exports = apiRoute;