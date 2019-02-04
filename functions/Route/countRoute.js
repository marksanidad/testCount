const express = require('express');
const apiRoute = express();
const countFunc = require('../Functions/countFunction')

apiRoute.post('/postCount/:event/:userid/:category/:id/:name', (req, res) => {
    countFunc.postAddCount(req.params,(err,result) => {
        if(err) {
            return res.status(500).send({result})
        }
        else {
            return res.status(200).send({result})
        }
    })
})

// apiRoute.post('/postRate/:event/rate/:type/:agendaid/:id/:name', (req, res) => {
//     countFunc.postRate(req.params,(err,result) => {
//         if(err) {
//             return res.status(500).send('Internal Server Error')
//         }
//         else {
//             return res.status(200).send({result})
//         }
//     })
// })

module.exports = apiRoute;