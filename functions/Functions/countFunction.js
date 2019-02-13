const countDB = require('../Database/countDB');

var postCount = {};
var postNewData = {};
var exist = false;
var count = 0;
var addCount = 0;
var result = '';
var category = '';

let postAddCount = (req, callback) => {

	if (req.category === "camfilter" || req.category === "exhibitor" || req.category === "expert"
		|| req.category === "speaker" || req.category === "sponsor" || req.category === "partner") {
		console.log("category", req.category);
		postAttendeeCount(req, callback);
		postCategoryCount(req, callback);
	}
	else if (req.category === "contacts") {
		console.log("category", req.category);
		postAttendeeContact(req, callback);
		postContact(req, callback);
	}
}

let getExistCategory = (res, req, callback) => {

	if (req.category === "exhibitor" || req.category === "expert" || req.category === "partner") {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes("pagevisit") === false
			|| res.analytics.pagevisit[req.category] === null
			|| res.analytics.pagevisit[req.category] === undefined) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics.pagevisit[req.category]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
	else if (req.category === "speaker" || req.category === "sponsor") {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes("material") === false
			|| res.analytics.material[req.category] === null
			|| res.analytics.material[req.category] === undefined) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics.material[req.category]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
	else if (req.category === "rate" && req.type === "speaker") {
		var speakerid = (req.name).toLowerCase().replace(/\s+/g, "").replace(/"/g, "");
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes(req.category) === false
			|| res.analytics.rate[req.type] === null
			|| res.analytics.rate[req.type] === undefined
			|| res.analytics.rate[req.type][req.agendaid] === null
			|| res.analytics.rate[req.type][req.agendaid] === undefined
			|| res.analytics.rate[req.type][req.agendaid][speakerid] === null
			|| res.analytics.rate[req.type][req.agendaid][speakerid] === undefined) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics.rate[req.type]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
	else if (req.category === "rate" && req.type === "session") {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes(req.category) === false
			|| res.analytics.rate[req.type] === null
			|| res.analytics.rate[req.type] === undefined
			|| res.analytics.rate[req.type][req.agendaid] === null
			|| res.analytics.rate[req.type][req.agendaid] === undefined) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics.rate[req.type]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
	else {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes(req.category) === false) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics[req.category]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
}

let postCategoryCount = (req, callback) => {
	countDB.getResultCount(req.event, (err, res) => {

		getExistCategory(res, req, (exist, result) => {
			if (err) {
				throw err
			}
			else if (exist === true && Object.keys(result).includes(req.id) === true) {
				console.log("res", result)
				count = result[req.id].count;
				addCount = count + 1;

				var finalCount = {
					count: addCount,
				}

				postCount = {
					exist: true,
					id: req.id,
					name: req.name,
					count: addCount,
				}

				countDB.updateCount(finalCount, req, (err, res) => {
					if (err) throw err;
				})

				countDB.updateTotalCount(req, true, err => {
					if (err) throw err;
				})

				return callback(false, postCount);
			}
			else if (exist === false || Object.keys(result).includes(req.id) === false) {
				postNewData = {
					exist: false,
					name: req.name,
					count: 1
				}

				countDB.setCount(req, err => {
					if (err) throw err;
				})

				countDB.updateTotalCount(req, false, err => {
					if (err) throw err;
				})

				return callback(false, postNewData);
			}
		})
	})
}

let postContact = (req, callback) => {
	countDB.getResultCount(req.event, (err, res) => {

		getExistCategory(res, req, (exist, result) => {
			if (err) {
				throw err
			}
			else if (exist === true) {
				console.log("res", result)
				count = result.totalCount;
				addCount = count + 1;

				var finalCount = {
					totalCount: addCount,
				}

				postCount = {
					exist: true,
					totalCount: addCount,
				}

				countDB.updateCount(finalCount, req, (err, res) => {
					if (err) throw err;
				})

				return callback(false, postCount);
			}
			else if (exist === false) {
				postNewData = {
					exist: false,
					totalCount: 1
				}

				countDB.setCount(req, err => {
					if (err) throw err;
				})

				return callback(false, postNewData);
			}
		})
	})
}

let postAttendeeCount = (req, callback) => {
	category = req.category;
	countDB.getResultAttendeeCount(req.userid, (err, res, message) => {
		if (err === true) {
			return callback(true, message);
		}
		else {
			getExistCategory(res, req, (exist, result) => {
				if (err) {
					throw err
				}
				else if ((exist === true && Object.keys(result).includes(req.id) === true)
					|| (exist === true && category === "speaker") || (exist === true && category === "sponsor")) {
					console.log("res", result)
					if (category === "speaker" || category === "sponsor") {
						count = result.count;
					}
					else {
						count = result[req.id].count;
					}
					addCount = count + 1;

					var finalCount = {
						count: addCount,
					}

					countDB.updateAttendeeCount(finalCount, req, (err, res) => {
						if (err) throw err;
					})
				}
				else if (exist === false || Object.keys(result).includes(req.id) === false) {
					countDB.setAttendeeCount(req, err => {
						if (err) throw err;
					})
				}
			})
		}
	})
}

let postAttendeeContact = (req, callback) => {
	countDB.getResultAttendeeCount(req.userid, (err, res, message) => {
		if (err === true) {
			return callback(false, message);
		}
		else {
			getExistCategory(res, req, (exist, result) => {
				if (err) {
					throw err
				}
				else if (exist === true) {
					console.log("res", result)
					count = result.count;
					addCount = count + 1;

					var finalCount = {
						count: addCount,
					}

					countDB.updateAttendeeCount(finalCount, req, (err, res) => {
						if (err) throw err;
					})
				}
				else if (exist === false) {
					countDB.setAttendeeCount(req, err => {
						if (err) throw err;
					})
				}
			})
		}
	})
}

module.exports = {
	postAddCount: postAddCount,
	postCategoryCount: postCategoryCount,
	postAttendeeCount: postAttendeeCount,
	getExistCategory: getExistCategory,
}