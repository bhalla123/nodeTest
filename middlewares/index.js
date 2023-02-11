const middleware = {};
const db = require('../models');
const User = db.users;

middleware.requiredAuthentication = async (req, res, next) => {
    //next();
    const userCount = await User.count();
    if (userCount == 0) {
        next();
    }
    if (req.session) {
        LoginUser = req.session.LoginUser;
        if (LoginUser) {
            next();
        } else {
            res.redirect(nodeAdminUrl + '/login');
        }
    } else {
        res.redirect(nodeAdminUrl + '/login');
    }
}

middleware.isFirstUser = async (req, res, next) => {

    const userCount = await User.count();

    if (userCount == 0) {
        req.body.user_type = "superAdmin";
        next();

    } else {
        if (req.session) {
            LoginUser = req.session.LoginUser;
            if (LoginUser) {
                next();
            } else {
                res.redirect(nodeAdminUrl + '/login');
            }
        } else {
            res.redirect(nodeAdminUrl + '/login');
        }
    }
};

module.exports = middleware;