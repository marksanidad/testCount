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

let getExistUserCategory = (res, req, callback) => {

    if (req.category === "exhibitor" || req.category === "expert" || req.category === "partner") {
        if (Object.keys(res).includes('analytics') === false
            || Object.keys(res.analytics).includes(req.event) === false
            || Object.keys(res.analytics[req.event]).includes("pagevisit") === false
            || res.analytics[req.event].pagevisit[req.category] === null
            || res.analytics[req.event].pagevisit[req.category] === undefined) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res.analytics[req.event].pagevisit[req.category]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
    else if (req.category === "speaker" || req.category === "sponsor") {
        if (Object.keys(res).includes('analytics') === false
            || Object.keys(res.analytics).includes(req.event) === false
            || Object.keys(res.analytics[req.event]).includes("material") === false
            || res.analytics[req.event].material[req.category] === null
            || res.analytics[req.event].material[req.category] === undefined) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res.analytics[req.event].material[req.category]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
    else if (req.category === "rate" && req.type === "speaker") {
        var speakerid = (req.name).toLowerCase().replace(/\s+/g, "").replace(/"/g, "");
        if (Object.keys(res).includes('analytics') === false
            || Object.keys(res.analytics).includes(req.event) === false
            || Object.keys(res.analytics[req.event]).includes(req.category) === false
            || res.analytics[req.event].rate[req.type] === null
            || res.analytics[req.event].rate[req.type] === undefined
            || res.analytics[req.event].rate[req.type][req.agendaid] === null
            || res.analytics[req.event].rate[req.type][req.agendaid] === undefined
            || res.analytics[req.event].rate[req.type][req.agendaid][speakerid] === null
            || res.analytics[req.event].rate[req.type][req.agendaid][speakerid] === undefined) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res.analytics[req.event].rate[req.type]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
    else if (req.category === "rate" && req.type === "session") {
        if (Object.keys(res).includes('analytics') === false
            || Object.keys(res.analytics).includes(req.event) === false
            || Object.keys(res.analytics[req.event]).includes(req.category) === false
            || res.analytics[req.event].rate[req.type] === null
            || res.analytics[req.event].rate[req.type] === undefined
            || res.analytics[req.event].rate[req.type][req.agendaid] === null
            || res.analytics[req.event].rate[req.type][req.agendaid] === undefined) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res.analytics[req.event].rate[req.type]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
    else {
        if (Object.keys(res).includes('analytics') === false
            || Object.keys(res.analytics[req.event]).includes(req.category) === false) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res.analytics[req.event][req.category]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
}

module.exports = {
    getExistCategory: getExistCategory,
    getExistUserCategory: getExistUserCategory,
}