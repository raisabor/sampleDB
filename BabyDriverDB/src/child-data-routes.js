const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');

const router = require('express').Router();

router.put('/child', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.first_name || !req.body.last_name) {
            next({
                error_code: 400,
                error_message: 'Missing first_name or last_name field'
            });
        } else if (!req.body.age) {
            next({
                error_code: 400,
                error_message: 'Missing height age'
            });
        } else if (!req.body.height) {
            next({
                error_code: 400,
                error_message: 'Missing height field'
            });
        } else {
            databaseSystem.getSQLPool().query('INSERT INTO children (parent_id, first_name, last_name, age, height) VALUES (?, ?, ?, ?, ?)', [sessionSystem.getUser(req).user_id, req.body.first_name, req.body.last_name, req.body.age, req.body.height], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            child_id: result.insertId,
                            parent_id: sessionSystem.getUser(req).user_id,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            age: req.body.age,
                            height: req.body.height,
                            school_id: req.body.school_id
                        }
                    });
                }
            });
        }
    }
});

router.post('/child/age/:id', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.params.id) {
            next({
                error_code: 400,
                error_message: 'Missing child id'
            });
        } else if (!req.body.age) {
            next({
                error_code: 400,
                error_message: 'Missing age field'
            });
        } else {
            databaseSystem.getSQLPool().query('UPDATE children SET age = ? WHERE id = ? AND parent_id = ?', [req.body.age, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            new_child_age: req.body.age
                        }
                    });
                }
            });
        }
    }
});

router.post('/child/height/:id', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.params.id) {
            next({
                error_code: 400,
                error_message: 'Missing child id'
            });
        } else if (!req.body.height) {
            next({
                error_code: 400,
                error_message: 'Missing height field'
            });
        } else {
            databaseSystem.getSQLPool().query('UPDATE children SET height = ? WHERE id = ? AND parent_id = ?', [req.body.height, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            new_child_height: req.body.height
                        }
                    });
                }
            });
        }
    }
});

router.post('/child/school/:id', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        action_result = {};
        if (!req.params.id) {
            next({
                error_code: 400,
                error_message: 'Missing child id'
            });
        } if (req.body.height) {
            databaseSystem.getSQLPool().query('UPDATE children SET height = ? WHERE id = ? AND parent_id = ?', [req.body.height, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    action_result.new_child_height = req.body.height;  
                } 
            });
        } if (req.body.age){
            databaseSystem.getSQLPool().query('UPDATE children SET age = ? WHERE id = ? AND parent_id = ?', [req.body.age, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    action_result.new_child_age = req.body.age;  
                } 
            });
        } if (req.body.school_id){
            databaseSystem.getSQLPool().query('UPDATE children SET school_id = ? WHERE id = ? AND parent_id = ?', [req.body.school_id, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    action_result.new_child_school_id = req.body.school_id;  
                } 
            });
        } if (req.body.first_name){
            databaseSystem.getSQLPool().query('UPDATE children SET first_name = ? WHERE id = ? AND parent_id = ?', [req.body.first_name, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    action_result.new_child_first_name = req.body.first_name;  
                } 
            });
        } if (req.body.last_name){
            databaseSystem.getSQLPool().query('UPDATE children SET last_name = ? WHERE id = ? AND parent_id = ?', [req.body.last_name, req.params.id, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    action_result.new_child_last_name = req.body.last_name;  
                } 
            });
        }
        
        res.status(200).send({
            action_result
        });
    }
});

router.get('/child/:id?', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.params.id) {
            var children = [];
            databaseSystem.getSQLPool().query('SELECT * FROM children WHERE parent_id = ?', [sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else if (result.length == 0) {
                    res.status(200).send({
                        action_result: children
                    });
                } else {
                    result.forEach(tuple => {
                        children.push({
                            child_id: tuple.id,
                            parent_id: tuple.parent_id,
                            first_name: tuple.first_name,
                            last_name: tuple.last_name,
                            age: tuple.age,
                            height: tuple.height,
                            school_id: tuple.school_id
                        });
                    });

                    res.status(200).send({
                        action_result: children
                    });
                }
            });
        } else {
            databaseSystem.getSQLPool().query('SELECT * FROM children WHERE id = ?', [req.params.id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else if (result.length == 0) {
                    next({
                        error_code: 404,
                        error_message: 'Child not found'
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            child_id: result[0].id,
                            parent_id: result[0].parent_id,
                            first_name: result[0].first_name,
                            last_name: result[0].last_name,
                            age: result[0].age,
                            height: result[0].height,
                            school_id: result[0].school_id
                        }
                    });
                }
            });
        }
    }
});

module.exports = router;