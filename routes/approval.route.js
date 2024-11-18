const route = require('express').Router();
const approvalController = require('../controller/approvals.controller');
const userController = require('../controller/user.controller');
const upload = require('../controller/upload.img');

route.get('/approvals',approvalController.getApprovals)

route.post('/add-approval',userController.protect,upload.uploadImage,approvalController.addApproval);

route.put('/update-approval/:id',userController.protect,upload.uploadImage,approvalController.updateApproval);

route.delete('/delete-approval/:id',userController.protect,approvalController.deleteApproval)

module.exports = route