const admin = require('firebase-admin');

let setSpeakerRate = (req, speakerid, newRate, callback) => {
    admin.database().ref('/users/attendee/' + req.userid + '/analytics/' + req.event + '/rate/' + req.type + '/' + req.agendaid + '/' + speakerid)
        .set(newRate);
    return callback(false);
}

let setSessionRate = (req, newRate, callback) => {
    admin.database().ref('/users/attendee/' + req.userid + '/analytics/' + req.event + '/rate/' + req.type + '/' + req.agendaid)
        .set(newRate);
    return callback(false);
}

module.exports = {
    setSpeakerRate: setSpeakerRate,
    setSessionRate: setSessionRate,
}