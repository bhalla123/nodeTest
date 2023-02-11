const db = require('../../models')
const User = db.users;
const controller = 'admin';
const bcrypt = require("bcrypt");

module.exports = {

    superAdmin: async (req, res) => {
        return res.redirect(nodeAdminUrl + '/users/add');
    },

    login: async (req, res) => {
        var input = JSON.parse(JSON.stringify(req.body));
        data = {};
        var action = 'login';
        errorData = {};
        LoginUser = req.session.LoginUser;

        if (req.session) {
            LoginUser = req.session.LoginUser;
            if (LoginUser) {
                res.set('content-type', 'text/html; charset=mycharset');
                res.redirect(nodeAdminUrl + '/dashboard');
            }
        }

        if (req.method == "POST") {
            //Validation
            {
                req.checkBody('email', 'Email is required').notEmpty();
                req.checkBody('password', 'Password is required').notEmpty();
                var errors = req.validationErrors();
            }
            //validation fail case
            if (errors) {
                if (errors.length > 0) {
                    errors.forEach(function (errors1) {
                        var field1 = String(errors1.param);
                        var msg = errors1.msg;
                        errorData[field1] = msg;
                    });
                }
                res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData });
            } else {

                var email = input.email;
                var password = input.password;

                await User.findOne({ where: { email: email } })
                    .then(user => {
                        if (!user) {
                            req.flash('error', 'Invalid Credentials')
                            res.locals.message = req.flash();
                            return res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData });
                        }

                        bcrypt.compare(password, user.password, (err, data) => {
                            if (err) console.log(err);
                            if (data) {
                                req.session.LoginUser = user;
                                return res.render('admin/dashboard', { page_title: "Admin - Login", data: data, errorData: errorData, controller: controller, action: action });
                            } else {
                                req.flash('error', 'Invalid Credentials')
                                res.locals.message = req.flash();
                                res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData });
                            }
                        })

                    })
            }

        } else {
            res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData });
        }
    },

    dashboard: async (req, res) => {
        var action = 'login';
        data = {}; LoginUser = {}; errorData = {};
        res.render('admin/dashboard', { page_title: "Admin - Dashboard", data: data, LoginUser: LoginUser, controller: controller, action: action });
    },

    logout: async (req, res) => {
        data = {}; LoginUser = {}; errorData = {};
        if (req.session) {
            req.session.destroy(function (err) {
                res.redirect(nodeAdminUrl + '/login');
            });
        }
        res.redirect(nodeAdminUrl + '/login');
    }
}

