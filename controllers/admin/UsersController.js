const controller = 'users';
const db = require('../../models')
const User = db.users;
const bcrypt = require("bcrypt");

module.exports = {

    list: async (req, res) => {
        data = {};
        action = 'list';
        const allRecord = await User.findAll();

        const superAdminId = await User.findOne({
            where: {
                user_type: "superAdmin"
            },
            select: ['id']
        })

        console.log("Session", req.session.LoginUser, superAdminId);

        res.render('admin/users/list', {
            page_title: "List",
            data: allRecord,
            controller: controller,
            action: action,
            superAdminId: superAdminId.id,
            loginUserId: req.session.LoginUser.id
        });
    },

    view: async (req, res) => {
        var action = 'view';

        if (req.params.id) {
            entityDetail = await User.findByPk(req.params.id, { raw: true });
            if (entityDetail.length == 0) {
                req.flash('error', 'Invalid url')
                return res.redirect(nodeAdminUrl + '/users/list');
            }
            res.render('admin/' + controller + '/view', { page_title: "View", data: entityDetail, controller: controller, action: action });
        } else {
            req.flash('error', 'Invalid url.');
            return res.redirect(nodeAdminUrl + '/users/list');
        }
    },

    add: async (req, res) => {
        var page_title = 'Add';
        var errorData = {};
        var data = {};
        var action = 'add';
        var errorData = {};

        if (req.method == "POST") {
            let emailObject = await User.findOne({
                where: { email: req.body.email }
            })

            if (emailObject != null) {
                req.flash('error', 'Email already taken');
                return res.redirect(nodeAdminUrl + '/' + controller + '/add');
            }

            var input = JSON.parse(JSON.stringify(req.body));
            req.checkBody('name', 'Name is required').notEmpty();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('email', 'email is required').notEmpty();
            var errors = req.validationErrors();

            if (errors) {
                if (errors.length > 0) {
                    errors.forEach(function (errors1) {
                        var field1 = String(errors1.param);
                        var msg = errors1.msg;
                        errorData[field1] = msg;
                        data.field1 = req.field1;
                    });
                }
                data = input;
            } else {
                var salt = bcrypt.genSaltSync(10);
                var password = bcrypt.hashSync(input.password, salt);
                input.password = password;

                var saveResult = await User.create(input);
                if (saveResult) {
                    if (input.user_type == "superAdmin") {
                        req.session.LoginUser = saveResult;
                    }
                    req.flash('success', controller + ' added successfully.')
                    res.locals.message = req.flash();
                    return res.redirect(nodeAdminUrl + '/' + controller + '/list');
                } else {
                    console.log("sssss");

                    req.flash('error', 'Could not save record. Please try again')
                    res.locals.message = req.flash();
                }
            }
        }
        res.render('admin/' + controller + '/add', { page_title: page_title, data: data, errorData: errorData, controller: controller, action: action });
    },

    /** 
     *  Edit
     *  Purpose: This function is used to get constructor List
     */
    edit: async (req, res) => {
        var action = 'edit';
        var entityDetail = {};
        var errorData = {};
        if (req.params.id) {
            entityDetail = await User.findByPk(req.params.id, { raw: true });
            if (entityDetail.length == 0) {
                req.flash('error', 'Invalid url')
                return res.redirect(nodeAdminUrl + '/users/list');
            }

            if (req.method == "POST") {
                let emailObject = await User.findOne({
                    where: { email: req.body.email }
                })

                if (emailObject != null && req.body.email.trim() != req.session.LoginUser.email) {
                    req.flash('error', 'Email already taken');
                    res.redirect(nodeAdminUrl + '/' + controller + '/edit/' + req.params.id);
                }

                var input = JSON.parse(JSON.stringify(req.body));
                req.checkBody('name', 'Name is required').notEmpty();
                req.checkBody('email', 'Email is required').notEmpty();
                var errors = req.validationErrors();
                if (errors) {
                    if (errors.length > 0) {
                        errors.forEach(function (errors1) {
                            var field1 = String(errors1.param);
                            var msg = errors1.msg;
                            errorData[field1] = msg;
                            entityDetail.field1 = req.field1;
                        });
                    }

                } else {
                    var saveResult = '';
                    var msg = controller + ' updated successfully.';
                    var saveResult = await User.update(input, {
                        where: {
                            id: req.params.id
                        }
                    });
                    req.flash('success', msg)
                    res.locals.message = req.flash();
                    if (saveResult) {
                        return res.redirect(nodeAdminUrl + '/' + controller + '/list');
                    }
                }
            }
        } else {
            req.flash('error', 'Invalid url.');
            return res.redirect(nodeAdminUrl + '/' + controller + '/list');;
        }
        res.render('admin/' + controller + '/edit', { page_title: " Edit", data: entityDetail, errorData: errorData, controller: controller, action: action });
    },

    deleteRecord: async (req, res) => {
        if (req.params.id) {
            let userExist = await User.findByPk(req.params.id, { raw: true });

            if (userExist) {
                await User.destroy({
                    where: {
                        id: req.params.id
                    }
                })

                if (req.session.LoginUser.id == req.params.id) {
                    req.session.destroy(function (err) {
                        res.redirect(nodeAdminUrl + '/login');
                    });
                } else {
                    req.flash('success', 'Record deleted succesfully.');
                    return res.redirect(nodeAdminUrl + '/' + controller + '/list');
                }

            } else {
                req.flash('error', 'Invalid url')
                return res.redirect(nodeAdminUrl + '/' + controller + '/list');
            }
        } else {
            req.flash('error', 'Invalid url.');
            return res.redirect(nodeAdminUrl + '/' + controller + '/list');
        }
    }
}



