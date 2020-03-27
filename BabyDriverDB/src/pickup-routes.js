const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');

const router = require('express').Router();

router.get('/pickups/assigned', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var pickups = [];
        databaseSystem.getSQLPool().query('SELECT p.*, c.parent_id, c.first_name FROM pickups AS p INNER JOIN children AS c ON c.id = p.child_id WHERE p.assigned_to = ? ORDER BY pickup_date DESC', [sessionSystem.getUser(req).user_id], function(err, result, fields) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.sqlMessage
                })
            } else {
                result.forEach(tuple => {
                    pickups.push({
                        first_name: tuple.first_name,
                        pickup_id: tuple.id,
                        child_id: pickups.child_id,
                        parent_id: pickups.parent_id,
                        creation_date: pickups.date_created,
                        pickup_date: tuple.pickup_date,
                        pickup_time: tuple.pickup_time,
                        dropoff_id: tuple.pickup_loc_id,
                        assigned_to: pickups.assigned_to,
                        status: pickups.progress,
                        safeword: pickups.safeword
                    });
                });

                res.status(200).send({
                    action_result: pickups
                });
            }
        });
    }
});

router.get('/pickups/requested', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var pickups = [];
        databaseSystem.getSQLPool().query('SELECT * FROM pickups WHERE child_id IN (SELECT id FROM children WHERE parent_id = ?) ORDER BY pickup_date DESC', [sessionSystem.getUser(req).user_id], function(err, result, fields) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.sqlMessage
                })
            } else {
                result.forEach(tuple => {
                    pickups.push({
                        pickup_id: tuple.id,
                        child_id: pickups.child_id,
                        parent_id: sessionSystem.getUser(req).user_id,
                        creation_date: pickups.date_created,
                        pickup_date: tuple.pickup_date,
                        pickup_time: tuple.pickup_time,
                        dropoff_id: tuple.pickup_loc_id,
                        assigned_to: pickups.assigned_to,
                        status: pickups.progress,
                        safeword: pickups.safeword
                    });
                });

                res.status(200).send({
                    action_result: pickups
                });
            }
        });
    }
});

router.get('/pickups/:id?', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if(req.params.id) {
            databaseSystem.getSQLPool().query('SELECT p.*, c.parent_id, c.first_name, u.email FROM pickups AS p INNER JOIN children AS c ON c.id = p.child_id INNER JOIN babydriver_users AS u ON p.assigned_to=u.id WHERE p.id = ?', [req.params.id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else if (result.length == 0) {
                    next({
                        error_code: 404,
                        error_message: 'No pickup could be found with id' + req.params.id
                    })
                } else if (!(sessionSystem.getUser(req).user_id == result[0].parent_id || sessionSystem.getUser(req).user_id == result[0].assigned_to || sessionSystem.getUser(req).school_id)) {
                    next({
                        error_code: 403,
                        error_message: 'You do not have access to that pickup'
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            first_name:result[0].first_name,
                            email: result[0].email,
                            pickup_id: result[0].id,
                            child_id: result[0].child_id,
                            parent_id: result[0].parent_id,
                            creation_date: result[0].date_created,
                            pickup_date: result[0].pickup_date,
                            pickup_time: result[0].pickup_time,
                            dropoff_id: result[0].pickup_loc_id,
                            assigned_to: result[0].assigned_to,
                            status: result[0].progress,
                            safeword: result[0].safeword
                        }
                    });
                }
            });
        } else {
            if(sessionSystem.getUser(req).school_id){
                databaseSystem.getSQLPool().query('SELECT p.*, c.parent_id, u.email FROM pickups AS p INNER JOIN children AS c ON c.id = p.child_id INNER JOIN babydriver_users AS u ON p.assigned_to=u.id', function(err, result, fields) {
                    if (err) {
                        next({
                            error_code: 500,
                            error_message: err.sqlMessage
                        });
                    } else if (result.length == 0) {
                        next({
                            error_code: 404,
                            error_message: 'No pickup could be found '
                        })
                    } else {
                        res.status(200).send({
                            result
                        });
                    }
                });
            } else {
                next({
                    error_code: 400,
                    error_message: 'Missing pickup id'
                });
            }
        }
    }
})

router.post('/pickups/status', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.pickup_id) {
            next({
                error_code: 400,
                error_message: 'Missing pickup_id field'
            });
        } else if (!req.body.status) {
            next({
                error_code: 400,
                error_message: 'Missing status field'
            });
        } else {
            databaseSystem.getSQLPool().query('UPDATE pickups SET progress = ? WHERE id = ?', [req.body.status, req.body.pickup_id], function(err) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: 'Updated pickup status'
                    });
                }
            });
        }
    }
});

router.put('/pickups', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.child_id) {
            next({
                error_code: 400,
                error_message: 'Missing child_id field'
            });
        } else if (!req.body.pickup_date) {
            next({
                error_code: 400,
                error_message: 'Missing pickup_date field'
            });
        } else if (!req.body.pickup_time) {
            next({
                error_code: 400,
                error_message: 'Missing pickup_time field'
            });
        } else if (!req.body.dropoff_id) {
            next({
                error_code: 400,
                error_message: 'Missing dropoff_id field'
            });
        } else if (!req.body.assigned_to) {
            next({
                error_code: 400,
                error_message: 'Missing assigned_to field'
            });
        } else if (!req.body.safeword) {
            next({
                error_code: 400,
                error_message: 'Missing safeword field'
            });
        } else {
            databaseSystem.getSQLPool().query('INSERT INTO pickups (child_id, date_created, pickup_time, pickup_date, pickup_loc_id, assigned_to, progress, safeword) VALUES (?, NOW(), ?, ?, ?, ?, 0, ?)', [req.body.child_id, req.body.pickup_time, req.body.pickup_date, req.body.dropoff_id, req.body.assigned_to, req.body.safeword], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            pickup_id: result.insertId
                        }
                    });
                }
            });
        }
    }
});




module.exports = router;