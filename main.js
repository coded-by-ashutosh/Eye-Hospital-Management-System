const express = require('express');
const router_info=require('./route');
const bodyparser=require('body-parser');
const session=require('express-session');
const urlsp=bodyparser.urlencoded({extended:false});
const app = express();
const port=2200;
app.set('view engine', 'ejs');
app.use(urlsp);

app.use(session (
    {
        secret:'patient_email',
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*10
        }
    }
))

app.use(session (
    {
        secret:'admin_user',
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*10
        }
    }
))

app.use(session (
    {
        secret:'patient_appointment_counter',
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*10
        }
    }
))

app.use("/public",express.static(__dirname+'/public'));
app.use('/',router_info);
app.listen(port,()=>
{
    console.log(`click Here http://localhost:${port}`);
})