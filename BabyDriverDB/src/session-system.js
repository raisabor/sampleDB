const session = require('express-session');
const database = require('./database-system');
const RedisSessionStore = require('connect-redis')(session);

var redis = database.getRedis();

var setupServer = function(app) {
    app.use(
        session({
            store: new RedisSessionStore({ client: redis }),
            key: 'user_sid',
            secret: '739d3bd3fa0e633e793cce2228cc8fd7f8934f67',
            resave: false,
            cookie: {
                expires: 600000
            }
        })
    );
}

var setupSession = function(request, userId, userEmail, schoolId) {
    request.session.user_id = userId;
    request.session.user_email = userEmail;
    request.session.school_id = schoolId;
};

var updateSession = function(request, userEmail) {
    request.session.user_email = userEmail;
};

var checkSession = function(request) {
    if (!request.session.user_id || !request.session.user_email) {
        return false;
    }
    return true;
};

var getUser = function(request) {
    if (!checkSession(request)) {
        return {};
    }
    if (!request.session.school_id) {
        return {
            user_id: request.session.user_id,
            user_email: request.session.user_email
        }
    }
    return {
        user_id: request.session.user_id,
        user_email: request.session.user_email,
        school_id: request.session.school_id
    };
};

var validateUserSession = function(request, response, next) {
    if (checkSession(request)) {
        return true;
    } else {
        next({
            error_code: 401,
            error_message: 'No active user session'
        });
        return false;
    }
}

var validateSchoolUserSession = function(request, response, next) {
    if (validateUserSession(request, response, next)) {
        if (getUser(request).school_id) {
            return true;
        } else {
            next({
                error_code: 403,
                error_message: 'That action is only available to school accounts'
            });
            return false;
        }
    } else {
        return false;
    }
}

var destroyUserSession = function(request, response) {
    request.session.destroy();
    response.clearCookie('user_sid');
};

module.exports = {
    setupServer,
    setupSession,
    updateSession,
    checkSession,
    getUser,
    validateUserSession,
    validateSchoolUserSession,
    destroyUserSession
};