const rateDB = require('../Database/rateDB')
const countDB = require('../Database/countDB')
const existFunc = require('../Functions/getExistFunction')

var newRate = {};
var postNewData = {};

let postRate = (req, callback) => {

    countDB.getResultAttendeeCount(req.userid, (err, res, message) => {
        if (err === true) {
            return callback(true, message);
        }
        else {
            if (req.type === "speaker") {
                var speakerid = (req.name).toLowerCase().replace(/\s+/g, "").replace(/"/g, "");

                existFunc.getExistCategory(res, req, (exist, result) => {
                    if (err) {
                        throw err
                    }
                    else if (exist === false || Object.keys(result).includes(req.agendaid) === false
                        || Object.keys(result[req.agendaid]).includes(speakerid) === false) {
                        postNewData = {
                            exist: false,
                            agendaid: req.agendaid,
                            speakerid: speakerid,
                            name: req.name,
                            rate: req.rate,
                        }

                        newRate = {
                            name: req.name,
                            rate: req.rate,
                        }

                        rateDB.setSpeakerRate(req, speakerid, newRate, (err, res) => {
                            if (err) throw err;
                        })

                        return callback(false, postNewData)
                    }
                    else if (exist === true || Object.keys(result).includes(req.agendaid) === true
                        || Object.keys(result[req.agendaid]).includes(speakerid) === true) {
                        postNewData = {
                            exist: true,
                            agendaid: req.agendaid,
                            speakerid: speakerid,
                            name: req.name,
                        }
                        return callback(false, postNewData)
                    }
                })
            }

            else if (req.type === "session") {
                existFunc.getExistCategory(res, req, (exist, result) => {
                    if (err) {
                        throw err
                    }
                    else if (exist === false || Object.keys(result).includes(req.agendaid) === false) {
                        postNewData = {
                            exist: false,
                            agendaid: req.agendaid,
                            session: req.name,
                            rate: req.rate,
                        }

                        newRate = {
                            session: req.name,
                            rate: req.rate,
                        }

                        rateDB.setSessionRate(req, newRate, (err, res) => {
                            if (err) throw err;
                        })

                        return callback(false, postNewData)
                    }
                    else if (exist === true || Object.keys(result).includes(req.agendaid) === true) {
                        postNewData = {
                            exist: true,
                            agendaid: req.agendaid,
                            session: req.name,
                        }
                        return callback(false, postNewData)
                    }
                })
            }
        }
    })
}

module.exports = {
    postRate: postRate,
}