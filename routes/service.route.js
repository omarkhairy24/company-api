const route = require('express').Router();
const serviceController = require('../controller/service.controller');
const userController = require('../controller/user.controller');
const upload = require('../controller/upload.img');

route.get('/services',serviceController.getServices);

route.get('/service/:serviceId',serviceController.getService);

route.post('/add-service',userController.protect,serviceController.addService);

route.put('/update-service/:id',userController.protect,serviceController.updateService);

route.delete('/delete-service/:id',userController.protect,serviceController.deleteService);

route.post('/add-service-info/:serviceId',userController.protect,upload.uploadImages,serviceController.addServiceInfo);

route.put('/update-service-info/:infoId',userController.protect,upload.uploadImages,serviceController.updateService);

route.delete('/update-service-info/:infoId',userController.protect,serviceController.deleteServiceInfo);

module.exports = route
