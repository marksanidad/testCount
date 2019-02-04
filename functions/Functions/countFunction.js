const countDB = require('../Database/countDB');
const admin = require('firebase-admin');

var postCount = {};
var postNewData = {};
var exist = false;
var count = 0;
var addCount = 0;
var result = '';
var category = '';

let postAddCount = (req, callback) => {

	if (req.category === "camfilter" || req.category === "exhibitor" || req.category === "expert"
		|| req.category === "speaker" || req.category === "sponsor") {
		console.log("category", req.category);
		postAttendeeCount(req, callback);
		//postCategoryCount(req, callback);
	}
	else if (req.category === "contacts") {
		console.log("category", req.category);
		postContact(req, callback);
	}
}

let getExistCategory = (res, category, callback) => {

	if (category === "exhibitor" || category === "expert") {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes("pagevisit") === false
			|| res.analytics.pagevisit[category] === null
			|| res.analytics.pagevisit[category] === undefined) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics.pagevisit[category]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
	else if (category === "speaker" || category === "sponsor") {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes("material") === false
			|| res.analytics.material[category] === null
			|| res.analytics.material[category] === undefined) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics.material[category]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
	else {
		if (Object.keys(res).includes('analytics') === false
			|| Object.keys(res.analytics).includes(category) === false) {
			console.log("exist", undefined, false)
			return callback(false)
		}
		else {
			result = res.analytics[category]
			console.log("res", result, true)
			return callback(true, result);
		}
	}
}

// let getAttendeeCategoryExist = (res, category, callback) => {
// 	if (category === "exhibitor" || category === "expert") {
// 		if (Object.keys(res).includes('analytics') === false
// 			|| Object.keys(res.analytics).includes("pagevisit") === false
// 			|| res.analytics.pagevisit[category] === null
// 			|| res.analytics.pagevisit[category] === undefined) {
// 			console.log("exist", undefined, false)
// 			return callback(false)
// 		}
// 		else {
// 			result = res.analytics.pagevisit[category]
// 			console.log("res", result, true)
// 			return callback(true, result);
// 		}
// 	}
// 	else if (category === "speaker" || category === "sponsor") {
// 		if (Object.keys(res).includes('analytics') === false
// 			|| Object.keys(res.analytics).includes("material") === false
// 			|| res.analytics.material[category] === null
// 			|| res.analytics.material[category] === undefined) {
// 			console.log("exist", undefined, false)
// 			return callback(false)
// 		}
// 		else {
// 			result = res.analytics.material[category]
// 			console.log("res", result, true)
// 			return callback(true, result);
// 		}
// 	}
// 	else {
// 		if (Object.keys(res).includes('analytics') === false
// 			|| Object.keys(res.analytics).includes(category) === false) {
// 			console.log("exist", undefined, false)
// 			return callback(false)
// 		}
// 		else {
// 			result = res.analytics[category]
// 			console.log("res", result, true)
// 			return callback(true, result);
// 		}
// 	}
// }

let postCategoryCount = (req, callback) => {
	category = req.category;
	countDB.getResultCount(req.event, (err, res) => {

		getExistCategory(res, category, (exist, result) => {
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
	category = req.category;
	countDB.getResultCount(req.event, (err, res) => {

		getExistCategory(res, category, (exist, result) => {
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
	countDB.getResultAttendeeCount(req.userid, (err, res) => {
		if (err === true){
			return callback(true, res);
		}
		else {
			return callback(false, res);
		}
	})
}

module.exports = {
	postAddCount: postAddCount,
	postCategoryCount: postCategoryCount,
	postAttendeeCount: postAttendeeCount,
	// postRate: postRate
}