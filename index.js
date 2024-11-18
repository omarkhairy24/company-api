const app = require('./app');
const pool = require('./pool');
require('dotenv').config()

pool.connect().then(async ()=>{
    app().listen(8080 , ()=>{
        console.log('connected');
    })
}).catch(err =>{
    console.log(err.message);
})

