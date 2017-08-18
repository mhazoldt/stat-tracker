let db = require('../db/db.js')


//////// activities

// endpoint: GET /api/activities
// request: {}
// response: [ {"status": "success"}, {"id": 1, "name": "laps"}, {"id": 2, "name": "intervals"} ]
//           {"status": "fails", "message": "could not get activities"}
//
// list activities
function list(req, res, next) {
    console.log("-- list activities --")

    db.query("SELECT * FROM activities", listResults)
    function listResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fails", "message": "could not get activities"})
        } else {
            console.log("* returned activites *")
            results.unshift({"status": "success"})
            console.log(results)
            console.log("")
            res.json(results)
        }
    }
    
}

// endpoint: POST /api/activities
// request: {"name": "laps"}
// response: {"status": "success", "message": "added laps as an activity"}
//           {"status": "fail", "message": "could not add activity"}
//
// add new activity
function add(req, res, next) {
    console.log("-- add activity --")
    let name = req.body.name

    if(Object.keys(req.body).length === 0) {
        console.log("req.body has key length of 0")
        res.json({"status": "fail", "message": "could not add activity"})
    } else {
        console.log("adding activity to database")
        db.query("INSERT INTO activities (name) VALUES (?)", [name], activityResults)
    }
    function activityResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add activity"})
        } else {
            let message = `added ${name} as activity`
            let jsonRes = {"status": "success", "message": message}
            console.log("* activity added *")
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}

// endpoint: GET /api/activities/:activity_id
// request: {}
// response: {"status": "success", "id": 2, "name"}
//
// show data for one activity
function show(req, res, next) {
    console.log("-- show activity --")

        let activity_id = req.params["activity_id"]
    
        db.query("SELECT name as activity, completed, DATE_FORMAT(completed_date, \"%Y-%m-%d\") as date FROM activities JOIN daily_data on daily_data.activity_id = activities.id WHERE daily_data.activity_id = ?", [activity_id], showResults)
        function showResults(err, results, fields) {
            if(err) {
                console.log(err)
                res.json({"status": "fails", "message": "could not get activities"})
            } else {
                console.log("* returned activity *")
                results.unshift({"status": "success"})
                console.log(results)
                console.log("")
                res.json(results)
            }
        }
}

// endpoint: PUT /api/activities/:activity_id
// request: {"name": laps}
// response: {"status": "success", "message": "activity updated"}
//           {"status": "fails", "message": "could not update activity"}
//
// update one activity
function update(req, res, next) {
    console.log("-- update activity --")
    let activity_id = req.params["activity_id"]
    let name = req.body.name

    db.query("UPDATE activities SET name = ? WHERE id = ?", [name, activity_id], updateResults)
    function updateResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fails", "message": "could not update activity"})
        } else {
            let jsonRes = {"status": "success", "message": "activity updated"}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}

// endpoint: DELETE /api/activities/:activity_id
// request: {}
// response: {"status": "success", "message": "removed activity"}
//           {"status": "fail", "message": "could not remove activity"}
//
// delete one activity
function deleteActivity(req, res, next) {
    console.log("-- delete activity --")
    let activity_id = req.params["activity_id"]

    // remove activity
    db.query("DELETE FROM activities WHERE id = ?", [activity_id], deleteResults)
    function deleteResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not remove activity"})
        } else {
            // remove daily_data for activity
            db.query("DELETE FROM daily_data WHERE activity_id = ?", [activity_id], dailyDataResults)            
        }
    }
    function dailyDataResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not remove activity"})
        } else {
            console.log("* activity deleted *")
            let jsonRes = {"status": "success", "message": "removed activity"}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}


//////// activity data


// endpoint: POST /api/activities/:activity_id/stats
// request: {"completed": 5, "completed_date": "YYYY-MM-DD"}
// response: {"status": "success", "name": "laps", "completed": 5, "completed_date": "YYYY-MM-DD"}
//           {"status": "fail", "message": "could not add data"}
//
// add activity data
function addData(req, res, next) {
    console.log("-- add data --")
    let activity_id = req.params["activity_id"]
    let completed = req.body.completed
    let completed_date = req.body.completed_date
    let name = null

    if(Object.keys(req.body).length === 0) {
        console.log("req.body key length is 0")
        res.json({"status": "fail", "message": "could not add data"})
    } else {
        // make sure activity exists
        db.query("SELECT * FROM activities WHERE id = ?", [activity_id], activityResults)
    }
    function activityResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add data"})
        } else if(results.length === 0) {
            console.log("results length is 0")
            res.json({"status": "fail", "message": "could not add data"})

        } else {
            name = results[0].name

            // check if data has already been tracked for this day
            db.query("SELECT * FROM daily_data WHERE activity_id = ? AND completed_date = ?", [activity_id, completed_date], dataExistResults)
        }
    }
    function dataExistResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add data"})
        } else if(results.length === 0) {
            // data does not already exist for this day

            // insert data
            console.log("creating new data")
            db.query("INSERT INTO daily_data (activity_id, completed, completed_date) VALUES(?, ?, ?)", [activity_id, completed, completed_date], dataResults)
        } else {
            // data exists and should be updated
            console.log("updating data")
            db.query("UPDATE daily_data SET completed = ? WHERE activity_id = ? AND completed_date = ?", [completed, activity_id, completed_date], dataResults)
        }
    }
    function dataResults(err, results, fields) {
        if(err) {
            console.log("could not add data")
            res.json({"status": "fail", "message": "could not add data"})
        } else {
            
            console.log("* data added *")
            let jsonRes = {"status": "success", "name": name, "completed": completed, "completed_date": completed_date}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}

// endpoint: DELETE /api/stats/:id
// request: {"completed_date": "YYYY-MM-DD"}
// response: {"status": "success", "message": "data removed", "activity_id": 2, "completed_date": "YYYY-MM-DD"}
//           {"status": "fail", "message": "data could not be removed"}
//
// delete activity data for a day
function deleteData(req, res, next) {
    console.log("-- delete data --")
    let activity_id = req.params["activity_id"]
    let completed_date = req.body.completed_date

    if(Object.keys(req.body).length === 0) {
        console.log("req.body length is 0")
        res.json({"status": "fail", "message": "data could not be removed"})
    } else {
        db.query("DELETE FROM daily_data WHERE activity_id = ? AND completed_date = ?", [activity_id, completed_date], deleteResults)   
    }
    function deleteResults(err, results, fields) {
        if(err){
            console.log(err)
            res.json({"status": "fail", "message": "data could not be removed"})
        } else {
            console.log("* data deleted *")
            jsonRes = {"status": "success", "message": "data removed", "activity_id": activity_id, "completed_date": completed_date}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}

// export functions
module.exports = {
    list,
    add,
    show,
    update,
    deleteActivity,
    addData,
    deleteData
}
