const route = require('express').Router();
const infoController = require('../controller/info.controller');
const userController = require('../controller/user.controller');

route.get('/info',infoController.getAllInfo);

route.post('/add-info',userController.protect ,infoController.addInfo);

route.put('/update-info/:id',userController.protect,infoController.updateInfo);

route.delete('/delete-info/:id', userController.protect,infoController.deleteInfo);

module.exports = route