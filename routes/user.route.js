const route = require('express').Router();
const userController = require('../controller/user.controller');

route.post('/admin/signup',userController.adminSignup);

route.post('/user/signup',userController.userSignup);

route.post('/login',userController.login);

module.exports = route
