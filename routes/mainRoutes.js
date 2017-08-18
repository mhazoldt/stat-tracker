var express = require('express')
var router = express.Router()

let activitiesController = require('../controllers/activitiesController')


// show a list of activities
router.get('/api/activities', activitiesController.list)

// create new activity
router.post('/api/activities', activitiesController.add)

// show one activity
router.get('/api/activities/:activity_id', activitiesController.show)

// update one acivity
router.put('/api/activities/:activity_id', activitiesController.update)

// delete one activity
router.delete('/api/activities/:activity_id', activitiesController.deleteActivity)

//// daily data

// add tracked data for a day
router.post('/api/activities/:activity_id/stats', activitiesController.addData)

// delete tracked data for a day
router.delete('/api/stats/:activity_id', activitiesController.deleteData)



module.exports = router