const countDB = require('../Database/countDB');
const existFunc = require('../Functions/getExistFunction')

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

let postCategoryCount = (req, callback) => {
	countDB.getResultCount(req.event, (err, res) => {

		existFunc.getExistCategory(res, req, (exist, result) => {
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

		existFunc.getExistCategory(res, req, (exist, result) => {
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
			existFunc.getExistUserCategory(res, req, (exist, result) => {
				if (err) {
					throw err
				}
				else if ((exist === true && Object.keys(result).includes(req.id) === true)
					|| (exist === true && category === "speaker") || (exist === true && category === "sponsor")) {
					console.log("res user", result)
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
			existFunc.getExistUserCategory(res, req, (exist, result) => {
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
}