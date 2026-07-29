const express = require('express');
const myroute = express.Router();
const multer = require('multer');
const path = require('path');
const Appoint_Object = require('./Controller/AppointmentController');
const cont_obj = require('./Controller/ContactController');
const user_obj = require('./Controller/AuthenticateController')
const admin_obj = require('./Controller/AdminController')
const doctor_obj = require('./Controller/DoctorController')
const doctormodal = require('./Modal/Doctor')
const eyedonation_obj = require('./Controller/EyeDonationController')

const Patient_image_storage = multer.diskStorage({
    destination: './public/Patients_Photo/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})
const Patient_upload = multer({ storage: Patient_image_storage })

const Doctor_storage =
    multer.diskStorage({

        destination: function (req, file, cb) {

            if (file.fieldname == "doctor_image") {
                cb(
                    null,
                    './public/Doctors_Photo/'
                )
            }

            else if (
                file.fieldname == "doctor_signature"
            ) {
                cb(
                    null,
                    './public/Doctors_Signature/'
                )
            }
        },
        filename: function (req, file, cb) {

            cb(
                null,
                Date.now()
                +
                path.extname(
                    file.originalname
                )
            )
        }
    })

const Doctor_upload =
    multer({
        storage: Doctor_storage
    })


myroute.get('/', (req, res) => {
    res.render('Home')
})

myroute.get('/about', (req, res) => {
    res.render('About')
})

myroute.get('/contact', (req, res) => {
    res.render('Contact')
})

myroute.use('/contact', (req, res) => {
    cont_obj.Enquire_Contact(req, res)
})

myroute.get('/services', (req, res) => {
    doctormodal.Fetch_Limited_Doctors((err, result) => {
        if (err) {
            res.render('Services', {
                doctor_data: []
            })
        }
        else {
            res.render('Services', {
                doctor_data: result
            })
        }
    })
})

myroute.get('/eye_donation', (req, res) => {
    eyedonation_obj.Eye_Donation(req, res)
})

myroute.post('/eye_donation', (req, res) =>
    eyedonation_obj.Eye_Donation(req, res)
)

myroute.get('/manage_eye_donation', (req, res) =>
    admin_obj.Manage_Eye_Donation(req, res)
)

myroute.get('/approve_eye_donor/:id', (req, res) =>
    admin_obj.Approve_Eye_Donor(req, res)
)

myroute.get('/reject_eye_donor/:id', (req, res) =>
    admin_obj.Reject_Eye_Donor(req, res)
)

myroute.get('/delete_eye_donor/:id', (req, res) =>
    admin_obj.Delete_Eye_Donor(req, res)
)

myroute.get('/bookappointment_success', (req, res) => {
    res.render('Home', {
        mesg: req.session.msg
    })
    req.session.msg = null
})

myroute.post('/bookappointment', (req, res) => {
    Appoint_Object.Add_Appointment(req, res)
})

// myroute.get('/login', (req, res) => {
//   res.render('Login', { page: 'login' });
// });

myroute.use('/login', (req, res) => {
    user_obj.checkAuth(req, res)
})

// myroute.get('/register', (req, res) => {
//   res.render('NewUser', { page: 'register' });
// });

myroute.use('/register', (req, res) => {
    user_obj.create_user(req, res)
})

myroute.use('/Patient_Dashboard', (req, res) => {
    user_obj.Patients_dashboard(req, res)
})

myroute.use('/Patient_logout', (req, res) => {
    user_obj.Patients_Logout(req, res)
})

myroute.use('/Patient_settings', (req, res) => {
    user_obj.Patients_Setting(req, res)
})

myroute.use('/p_profile_complete', Patient_upload.single("userphoto"), (req, res) => {
    user_obj.Patients_Profile_Complete(req, res)
})

myroute.use('/Patient_Appointment', (req, res) => {
    Appoint_Object.get_records(req, res)
})

myroute.use('/Patient_profile', (req, res) => {
    user_obj.Patient_Profile(req, res)
})

myroute.get('/my_prescriptions', (req, res) => {
    user_obj.My_Prescriptions(req, res)
})

myroute.get('/view_prescription/:id', (req, res) => {
    user_obj.View_Prescription(req, res)
})

myroute.get('/my_enquiries', (req, res) => {
    user_obj.My_Enquiries(req, res)
})

myroute.get('/medical_history', (req, res) => {
    user_obj.Medical_History(req, res)
})

myroute.use('/cpanel', (req, res) => {
    admin_obj.Check_admin(req, res)
})

myroute.use('/admin/dashboard', (req, res) => {
    admin_obj.Dashboard(req, res)
})

myroute.use('/admin_logout', (req, res) => {
    admin_obj.Logout(req, res)
})


myroute.use('/manage_enquiry', (req, res) => {
    admin_obj.Manage_Enquiries(req, res)
})

myroute.post('/reply_enquiry', (req, res) => {
    admin_obj.Reply_Enquiry(req, res)
})


myroute.use('/delete_enquiry/:id', (req, res) => {
    admin_obj.Delete_Enquiry(req, res)
})

myroute.use('/user_account', (req, res) => {
    admin_obj.Manage_Users(req, res)
})

myroute.use('/view_user/:id', (req, res) => {
    admin_obj.View_User_Profile(req, res)
})

myroute.use('/delete_user/:id', (req, res) => {
    admin_obj.Delete_User(req, res)
})


myroute.use('/add_doctor', (req, res) => {
    doctor_obj.Add_Doctor_Page(req, res)
})

myroute.use('/insert_doctor', Doctor_upload.fields([{ name: "doctor_image", maxCount: 1 }, { name: "doctor_signature", maxCount: 1 }]), (req, res) => {
    doctor_obj.Insert_Doctor(req, res)
})

myroute.use('/manage_doctors', (req, res) => {
    doctor_obj.Manage_Doctors(req, res)
})

myroute.use('/edit_doctor/:id', (req, res) => {
    doctor_obj.Edit_Doctor(req, res)
})

myroute.use('/update_doctor', Doctor_upload.fields([{ name: "doctor_image", maxCount: 1 }, { name: "doctor_signature", maxCount: 1 }]), (req, res) => {
    doctor_obj.Update_Doctor(req, res)
})

myroute.use('/delete_doctor/:id', (req, res) => {
    doctor_obj.Delete_Doctor(req, res)
})

myroute.use('/block_doctor/:id', (req, res) => {
    doctor_obj.Block_Doctor(req, res)
})

myroute.use('/unblock_doctor/:id', (req, res) => {
    doctor_obj.Unblock_Doctor(req, res)
})

myroute.use('/manage_appointments', (req, res) => {
    admin_obj.Manage_Appointments(req, res)
})

myroute.use('/view_appointment/:id', (req, res) => {
    admin_obj.View_Appointment(req, res)
})

myroute.use('/approve_appointment/:id', (req, res) => {
    admin_obj.Approve_Appointment(req, res)
})

myroute.get('/doctor/visit_appointment/:id', (req, res) => {

    doctor_obj.Mark_Visited(req, res)

})

myroute.post('/reject_appointment', (req, res) => {
    admin_obj.Reject_Appointment(req, res)
})

myroute.use('/delete_appointment/:id', (req, res) => {
    admin_obj.Delete_Appointment(req, res)
})

myroute.post('/assign_doctor', (req, res) => {
    admin_obj.Assign_Doctor(req, res)
})

myroute.use('/push_notifications', (req, res) => {
    admin_obj.notification(req, res)
})

myroute.use('/manage_notifications', (req, res) => {
    admin_obj.Manage_Notifications(req, res)
})

myroute.use('/delete_notification/:id', (req, res) => {
    admin_obj.Delete_Notification(req, res)
})

myroute.use('/doctor/login', (req, res) => {
    doctor_obj.Doctor_Login(req, res)
})

myroute.use('/doctor/dashboard', (req, res) => {
    doctor_obj.Doctor_Dashboard(req, res)
})

myroute.use('/doctor/logout', (req, res) => {
    doctor_obj.Doctor_Logout(req, res)
})

myroute.use('/doctor/appointments', (req, res) => {
    doctor_obj.Doctor_Appointments(req, res)
})

myroute.use('/doctor/view_appointment/:id', (req, res) => {
    doctor_obj.View_Doctor_Appointment(req, res)
})

myroute.use('/doctor/write_prescription/:id', (req, res) => {
    doctor_obj.Write_Prescription(req, res)
})

myroute.post('/doctor/save_prescription', (req, res) => {
    doctor_obj.Save_Prescription(req, res)
})

myroute.get('/doctor/prescription_history', (req, res) => {
    doctor_obj.Prescription_History(req, res)
})

myroute.get('/doctor/view_prescription/:id', (req, res) => {
    doctor_obj.View_Doctor_Prescription(req, res)
})

myroute.get('/doctor/settings', (req, res) => {
    doctor_obj.Doctor_Settings(req, res)
})

myroute.post('/doctor/settings', (req, res) => {
    doctor_obj.Doctor_Settings(req, res)
})

myroute.get('/doctor/profile', (req, res) => {
    doctor_obj.Doctor_Profile(req, res)
})

myroute.get('/doctor/assigned_patients', (req, res) => {
    doctor_obj.Assigned_Patients(req, res)
})

myroute.get('/doctor/view_patient/:email', (req, res) => {
    doctor_obj.View_Assigned_Patient(req, res)
})

myroute.get('/patient_notifications', (req, res) => {
    user_obj.Patient_Notifications(req, res)
})

myroute.get('/archived_notifications', (req, res) => {
    user_obj.Archived_Notifications(req, res)
})

myroute.get('/archive_notification/:id', (req,res) => {
    user_obj.Archive_Notification(req, res)
}



)

// myroute.use('/doctor_login',(req,res)=>
// {
//     doctor_obj.Doctor_Login(req,res)
// })

module.exports = myroute;