const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');
const passwordSystem = require('./password-system');

const router = require('express').Router();

router.put('/user', (req, res, next) => {
    if (!req.body.email) {
        next({
            error_code: 400,
            error_message: 'Missing email field'
        });
    } else if (!req.body.password) {
        next({
            error_code: 400,
            error_message: 'Missing password field'
        });
    } else {
        if (!req.body.school_id) {
            req.body.school_id = null;
        }
        var hashData = passwordSystem.saltHashPassword(req.body.password);
        databaseSystem.getSQLPool().query('INSERT INTO babydriver_users (email, password, password_salt, school_id) VALUES (?, ?, ?, ?)', [req.body.email, hashData.passwordHash, hashData.salt, req.body.school_id], function(err, result, fields) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.sqlMessage
                });
            } else if (req.body.school_id) {
                res.status(200).send({
                    action_result: {
                        user_id: result.insertId,
                        user_email: req.body.email,
                        school_id: req.body.school_id
                    }
                });
            } else {
                res.status(200).send({
                    action_result: {
                        user_id: result.insertId,
                        user_email: req.body.email
                    }
                });
            }
        });
    }
});

router.post('/user/email', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.email) {
            next({
                error_code: 400,
                error_message: 'Missing email field'
            });
        } else {
            databaseSystem.getSQLPool().query('UPDATE babydriver_users SET email = ? WHERE id = ?', [req.body.email, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    sessionSystem.updateSession(req, req.body.email);
                    res.status(200).send({
                        action_result: {
                            new_user_email: req.body.email
                        }
                    });
                }
            });
        }
    }
});

router.post('/user/password', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.password) {
            next({
                error_code: 400,
                error_message: 'Missing password field'
            });
        } else {
            var hashData = passwordSystem.saltHashPassword(req.body.password);
            databaseSystem.getSQLPool().query('UPDATE babydriver_users SET password = ?, password_salt = ? WHERE id = ?', [hashData.passwordHash, hashData.salt, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: 'Password updated successfully'
                    });
                }
            });
        }
    }
});

router.get('/users', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var users = [];
        databaseSystem.getSQLPool().query('SELECT * FROM babydriver_users;', function(err, result, fields) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.sqlMessage
                });
            } else {
                result.forEach(tuple => {
                    if (tuple.school_id) {
                        users.push({
                            user_id: tuple.id,
                            user_email: tuple.email,
                            school_id: tuple.school_id
                        });
                    } else {
                        users.push({
                            user_id: tuple.id,
                            user_email: tuple.email
                        });
                    }
                });

                res.status(200).send({
                    action_result: users
                });
            }
        });
    }
});

router.get('/user/:id?', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.params.id) {
            res.status(200).send({
                action_result: sessionSystem.getUser(req)
            });
        } else {
            databaseSystem.getSQLPool().query('SELECT id, email, school_id FROM babydriver_users WHERE id = ?', [req.params.id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else if (result.length == 0) {
                    next({
                        error_code: 404,
                        error_message: 'User not found'
                    });
                } else if (result[0].school_id) {
                    res.status(200).send({
                        action_result: {
                            user_id: result[0].id,
                            user_email: result[0].email,
                            school_id: result[0].school_id
                        }
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            user_id: result[0].id,
                            user_email: result[0].email
                        }
                    });
                }
            });
        }
    }
});



module.exports = router;