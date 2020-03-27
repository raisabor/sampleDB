const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');
const passwordSystem = require('./password-system');

const router = require('express').Router();

router.post('/user/session', (req, res, next) => {
    if (sessionSystem.checkSession(req)) {
        res.redirect('/user');
    } else if (!req.body.email) {
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
        databaseSystem.getSQLPool().query('SELECT * FROM babydriver_users WHERE email = ?', [req.body.email], function(err, result, fields) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.sqlMessage
                });
            } else if (result.length == 0) {
                next({
                    error_code: 404,
                    error_message: 'No user found with provided email'
                });
            } else {
                var hashed = result[0].password;
                var salt = result[0].password_salt;
                if (passwordSystem.verifyPassword(req.body.password, hashed, salt)) {
                    sessionSystem.setupSession(req, result[0].id, req.body.email, result[0].school_id);
                    res.redirect('/user');
                } else {
                    next({
                        error_code: 401,
                        error_message: 'Invalid password'
                    });
                }
            }
        });
    }
});

router.delete('/user/session', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        sessionSystem.destroyUserSession(req, res);
        res.status(200).send({
            action_result: 'Successfully logged out'
        });
    }
});

module.exports = router;