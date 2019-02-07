const admin = require('firebase-admin');

let getResultCount = (event, callback) => {
	admin.database().ref('/GANAPP/' + event).once('value', data => {
		let test = data.val();
		return callback(false, test)
	})
}

let getResultAttendeeCount = (userid, callback) => {
	admin.database().ref('users/attendee/' + userid).once('value', data => {
		let test = data.val();
		console.log("test",test)
		if (test === null || test === undefined) {
			return callback(true, null, {message: "userid not exists!"})
		}
		else {
			return callback(false, test, {message: "userid exists"})
		}
	})
}

let updateCount = (finalCount, req, callback) => {
	var catURL = '';
	if (req.category === "camfilter") {
		catURL = '/GANAPP/' + req.event + '/analytics/' + req.category + '/' + req.id;
	}
	else if (req.category === "contacts") {
		catURL = '/GANAPP/' + req.event + '/analytics/' + req.category;
	}
	else if (req.category === "exhibitor" || req.category === "expert") {
		catURL = '/GANAPP/' + req.event + '/analytics/pagevisit/' + req.category + '/' + req.id;
	}
	else if (req.category === "speaker" || req.category === "sponsor") {
		catURL = '/GANAPP/' + req.event + '/analytics/material/' + req.category + '/' + req.id;
	}

	admin.database().ref(catURL).update(finalCount)
	return callback(false);

}

let setCount = (req, callback) => {

	var catURL = '';
	var setArray = {
		name: req.name,
		count: 1
	};

	if (req.category === "camfilter") {
		catURL = '/GANAPP/' + req.event + '/analytics/' + req.category + '/' + req.id;
	}
	else if (req.category === "contacts") {
		catURL = '/GANAPP/' + req.event + '/analytics/' + req.category;
		setArray = {
			totalCount: 1
		};
	}
	else if (req.category === "exhibitor" || req.category === "expert") {
		catURL = '/GANAPP/' + req.event + '/analytics/pagevisit/' + req.category + '/' + req.id;
	}
	else if (req.category === "speaker" || req.category === "sponsor") {
		catURL = '/GANAPP/' + req.event + '/analytics/material/' + req.category + '/' + req.id;
	}

	admin.database().ref(catURL).set(setArray);
	return callback(false);

}

let updateTotalCount = (req, exist, callback) => {
	if (req.category === "exhibitor" || req.category === "expert" || req.category === "speaker" || req.category === "sponsor") {
		var catURL = '';

		if (req.category === "exhibitor" || req.category === "expert") {
			catURL = '/analytics/pagevisit/';
		}
		else if (req.category === "speaker" || req.category === "sponsor") {
			catURL = '/analytics/material/';
		}

		admin.database().ref('/GANAPP/' + req.event + catURL + req.category).once("value", data => {
			let result = data.val();
			console.log("result", result, result.totalCount);

			if ((exist === false && result.totalCount >= 1) || exist === true) {
				admin.database().ref('/GANAPP/' + req.event + catURL + req.category + '/totalCount').once("value", count => {
					console.log("num", Number(count.val()));

					var finalCount = Number(count.val()) + 1;

					admin.database().ref('/GANAPP/' + req.event + catURL + req.category).
						update({
							totalCount: finalCount,
						})
				})
			}
			else {
				admin.database().ref('/GANAPP/' + req.event + catURL + req.category).
					update({
						totalCount: 1
					});
			}
		})
		admin.database().ref('/GANAPP/' + req.event + catURL).once("value", data => {
			let result = data.val();

			if (result.totalCount === null || result.totalCount === undefined) {
				admin.database().ref('/GANAPP/' + req.event + catURL).
					update({
						totalCount: 1
					});
			}
			else {
				var fcount = Number(result.totalCount) + 1
				admin.database().ref('/GANAPP/' + req.event + catURL).
					update({
						totalCount: fcount
					});
			}
		})
	}

	else {
		admin.database().ref('/GANAPP/' + req.event + '/analytics/' + req.category).once("value", data => {
			let result = data.val();
			console.log("result", result, result.totalCount);

			if ((exist === false && result.totalCount >= 1) || exist === true) {
				admin.database().ref('/GANAPP/' + req.event + '/analytics/' + req.category + '/totalCount').once("value", count => {
					console.log("num", Number(count.val()));

					var finalCount = Number(count.val()) + 1;

					admin.database().ref('/GANAPP/' + req.event + '/analytics/' + req.category).
						update({
							totalCount: finalCount,
						})
				})
			}
			else {
				admin.database().ref('/GANAPP/' + req.event + '/analytics/' + req.category).
					update({
						totalCount: 1
					});
			}
		})
	}
}
let setAttendeeCount = (req, callback) => {

	var catURL = '';
	var setArray = {
		name: req.name,
		count: 1
	};

	if (req.category === "camfilter") {
		catURL = '/users/attendee/' + req.userid + '/analytics/' + req.category + '/' + req.id;
	}
	else if (req.category === "contacts") {
		catURL = '/users/attendee/' + req.userid + '/analytics/' + req.category;
		setArray = {
			count: 1
		};
	}
	else if (req.category === "exhibitor" || req.category === "expert") {
		catURL = '/users/attendee/' + req.userid + '/analytics/pagevisit/' + req.category  + '/' + req.id;
	}
	else if (req.category === "speaker" || req.category === "sponsor") {
		catURL = '/users/attendee/' + req.userid + '/analytics/material/' + req.category;
		setArray = {
			count: 1
		};
	}

	admin.database().ref(catURL).set(setArray);
	return callback(false);

}

let updateAttendeeCount = (finalCount, req, callback) => {
	var catURL = '';
	if (req.category === "camfilter") {
		catURL = '/users/attendee/' + req.userid + '/analytics/' + req.category + '/' + req.id;
	}
	else if (req.category === "contacts") {
		catURL = '/users/attendee/' + req.userid + '/analytics/' + req.category;
	}
	else if (req.category === "exhibitor" || req.category === "expert") {
		catURL = '/users/attendee/' + req.userid + '/analytics/pagevisit/' + req.category + '/' + req.id;
	}
	else if (req.category === "speaker" || req.category === "sponsor") {
		catURL = '/users/attendee/' + req.userid + '/analytics/material/' + req.category;
	}

	admin.database().ref(catURL).update(finalCount)
	return callback(false);
}

module.exports = {
	getResultCount: getResultCount,
	updateCount: updateCount,
	setCount: setCount,
	updateTotalCount: updateTotalCount,
	getResultAttendeeCount: getResultAttendeeCount,
	updateAttendeeCount : updateAttendeeCount,
	setAttendeeCount : setAttendeeCount,
}