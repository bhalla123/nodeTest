var express = require('express');
var router = express.Router();
var middleware = require("../middlewares");

var AdminController = require('../controllers/admin/AdminController');
var UsersController = require('../controllers/admin/UsersController');

/** Routes for admin  */
router.get('/admin/create/superAdmin', middleware.isFirstUser, AdminController.superAdmin);

router.get('/admin/login', AdminController.login);
router.post('/admin/login', AdminController.login);
router.get('/admin/Dashboard', middleware.requiredAuthentication, AdminController.dashboard);

/** Routes for users module  */
router.get('/admin/users/list', middleware.requiredAuthentication, UsersController.list);
router.get('/admin/users/edit/:id', middleware.requiredAuthentication, UsersController.edit);
router.post('/admin/users/edit/:id', middleware.requiredAuthentication, UsersController.edit);
router.post('/admin/users/add', middleware.isFirstUser, UsersController.add);
router.get('/admin/users/add', middleware.requiredAuthentication, UsersController.add);
router.get('/admin/users/view/:id', middleware.requiredAuthentication, UsersController.view);

router.get('/admin/users/delete/:id', middleware.requiredAuthentication, UsersController.deleteRecord);

router.get('/admin/logout', AdminController.logout);
module.exports = router;