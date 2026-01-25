const express = require('express'); 
const myroute=express.Router(); 
const multer = require('multer');
const path=require('path');
const Appoint_Object=require('./Controller/AppointmentController');
const cont_obj=require('./Controller/ContactController');
const user_obj=require('./Controller/AuthenticateController')
const admin_obj=require('./Controller/AdminController')


const Patient_image_storage = multer.diskStorage({
    destination:'./public/Patients_Photo/',
    filename:function(req,file,cb)
   
    {
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const Patient_upload=multer({storage:Patient_image_storage})

myroute.get('/',(req,res)=>
{
    res.render('Home')
})

myroute.get('/about',(req,res)=>
{
    res.render('About')
})

myroute.get('/contact',(req,res)=>
{
    res.render('Contact')
})

myroute.use('/contact',(req,res)=>
{
    cont_obj.Enquire_Contact(req,res)
})

myroute.get('/services',(req,res)=>
{
    res.render('Services')
})

myroute.get('/eye-donation',(req,res)=>
{
    res.render('Eye_Donation')
})

myroute.post('/bookappointment',(req,res)=>
{
    Appoint_Object.Add_Appointment(req,res)
})

// myroute.get('/login', (req, res) => {
//   res.render('Login', { page: 'login' });
// });

myroute.use('/login',(req,res) =>
{
     user_obj.checkAuth(req,res)
})

// myroute.get('/register', (req, res) => {
//   res.render('NewUser', { page: 'register' });
// });

myroute.use('/register',(req,res) =>
{
    user_obj.create_user(req,res)
})

myroute.use('/Patient_Dashboard',(req,res) =>
{
    user_obj.Patients_dashboard(req,res)
})

myroute.use('/Patient_logout',(req,res) =>
{
    user_obj.Patients_Logout(req,res)
})

myroute.use('/Patient_settings',(req,res) =>
{
    user_obj.Patients_Setting(req,res)
})

myroute.use('/p_profile_complete',Patient_upload.single("userphoto"),(req,res) =>
{
    user_obj.Patients_Profile_Complete(req,res)
})

myroute.use('/Patient_Appointment',(req,res) =>
{
    Appoint_Object.get_records(req,res)
})

myroute.use('/Patient_profile',(req,res) =>
{
    user_obj.Patient_Profile(req,res)
})

myroute.use('/cpanel',(req,res) => 
{
    admin_obj.Check_admin(req,res)
})

myroute.use('/admin/dashboard',(req,res) => 
{
    admin_obj.Dashboard(req,res)
})

myroute.use('/admin_logout',(req,res) => 
{
    admin_obj.Logout(req,res)
})

myroute.use('/push_notifications',(req,res) => 
{
    admin_obj.notification(req,res)
})

module.exports=myroute;