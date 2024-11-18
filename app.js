const express = require('express');
const userRoute = require('./routes/user.route');
const infoRoute = require('./routes/info.route');
const approvalRoute = require('./routes/approval.route');
const serviceRoute = require('./routes/service.route');

module.exports = () =>{
    const app = express();
    app.use(express.json());
    app.use(userRoute);
    app.use(infoRoute);
    app.use(approvalRoute);
    app.use(serviceRoute);
    return app
}