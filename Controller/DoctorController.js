const doctormodal = require('../Modal/Doctor')
const appointmentModel = require('../Modal/Appointment')
const prescriptionmodal = require('../Modal/Prescription')
const patientnotify = require('../Modal/PatientNotification')
const bcrypt = require('bcryptjs')

class Doctor {
    // Doctor_Login(req, res) {
    //     if (req.method == "GET") {
    //         res.render('Doctor/Doctor_Login')
    //     }
    //     else {
    //         const data =
    //         {
    //             Email: req.body.email,
    //             Password: req.body.password
    //         }

    //         doctormodal.Doctor_Login(data, (err, result) => {
    //             if (err) {
    //                 res.render('Doctor/Doctor_Login', {
    //                     msg: "Server Error"
    //                 })
    //             }
    //             else {
    //                 if (result.length > 0) {
    //                     if (result[0].status == 'blocked') {
    //                         res.render('Doctor/Doctor_Login', {
    //                             msg: "You have been blocked by administrator"
    //                         })
    //                     }
    //                     else {
    //                         const checkpassword = bcrypt.compareSync(
    //                             data.Password,
    //                             result[0].password
    //                         )

    //                         if (checkpassword) {
    //                             req.session.doctor_user = result[0].email

    //                             res.redirect('/doctor/dashboard')
    //                         }
    //                         else {
    //                             res.render('Doctor/Doctor_Login', {
    //                                 msg: "Incorrect Password"
    //                             })
    //                         }
    //                     }
    //                 }
    //                 else {
    //                     res.render('Doctor/Doctor_Login', {
    //                         msg: "Email Not Found"
    //                     })
    //                 }
    //             }
    //         })
    //     }
    // }

    Doctor_Login(req, res) {
        if (req.method == 'GET') {
            const msg = req.session.doctor_login_msg

            req.session.doctor_login_msg = null

            res.render('Doctor/Doctor_Login',
                {
                    msg: msg
                })
        }
        else {
            const data =
            {
                Email: req.body.email
            }

            doctormodal.Doctor_Login(data, async (err, result) => {
                if (err) {
                    res.render('Doctor/Doctor_Login',
                        {
                            msg: "Error While Login"
                        })
                }
                else {
                    if (result.length > 0) {
                        if (result[0].doctor_status != "active") {
                            res.render('Doctor/Doctor_Login',
                                {
                                    msg: "You have been blocked by administrator"
                                })
                        }
                        else {
                            const dbpass = result[0].password

                            const ismatch =
                                await bcrypt.compare(req.body.password, dbpass)

                            if (ismatch) {
                                req.session.doctor_email = result[0].email

                                req.session.doctor_name = result[0].doctor_name

                                req.session.doctor_id = result[0].id

                                res.redirect('/doctor/dashboard')
                            }
                            else {
                                res.render('Doctor/Doctor_Login',
                                    {
                                        msg: "Incorrect Password", doctoremail: result[0].email
                                    })
                            }
                        }
                    }
                    else {
                        res.render('Doctor/Doctor_Login',
                            {
                                msg: "Email Not Registered"
                            })
                    }
                }
            })
        }
    }

    Doctor_Dashboard(req, res) {

        if (!req.session.doctor_email) {

            req.session.doctor_login_msg =
                "Please Login Here"

            return res.redirect('/doctor/login')
        }

        const data = {

            Doctor_Id: req.session.doctor_id
        }

        appointmentModel.Doctor_Appointments(data, (err, result) => {

            if (err) {

                return res.render('Doctor/Doctor_Dashboard', {

                    doctor_name: req.session.doctor_name,

                    assigned_appointments: 0,

                    pending_consultations: 0,

                    completed_consultations: 0,

                    today_appointments: 0,

                    recent_appointments: [],

                    appointment_chart: []
                })
            }

            appointmentModel.Today_Doctor_Appointments(data,
                (err2, todayresult) => {

                    appointmentModel.Doctor_Appointment_Chart(data, (err3, chartresult) => {

    appointmentModel.Doctor_Consultation_Summary(data, (err4, summary) => {

        res.render('Doctor/Doctor_Dashboard', {

            doctor_name: req.session.doctor_name,

            assigned_appointments: result.length,

            pending_consultations:
                result.filter(x => x.status == 'Approved').length,

            completed_consultations:
                result.filter(x => x.status == 'Completed').length,

            today_appointments: todayresult.length,

            recent_appointments: result.slice(0,5),

            appointment_chart: chartresult,

            consultation_summary: summary[0],

            today_schedule: todayresult

        })

    })

})
                })
        })
    }

    Doctor_Logout(req, res) {
        req.session.destroy()

        res.redirect('/doctor/login')
    }

    Add_Doctor_Page(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            const success = req.session.success
            const error = req.session.error

            req.session.success = null
            req.session.error = null

            res.render('Admin/Add_Doctor',
                {
                    success: success,
                    error: error
                })
        }
    }

    Insert_Doctor(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            const data =
            {
                Doctor_Name: req.body.doctor_name,
                Speciality: req.body.speciality,
                Experience: req.body.experience,
                Qualification: req.body.qualification,
                Description: req.body.description,
                Doctor_Image: req.files?.doctor_image?.[0]?.filename || "",
                Doctor_Signature: req.files?.doctor_signature?.[0]?.filename || "",
                Doctor_Status: req.body.doctor_status,
                Email: req.body.email,
                Password: bcrypt.hashSync(req.body.password, 10)
            }

            doctormodal.Add_Doctor(data, (err) => {
                if (err) {
                    console.log(err)

                    req.session.error = "Error In Adding Doctor"

                    res.redirect('/add_doctor')
                }
                else {
                    req.session.success = "Doctor Added Successfully"

                    res.redirect('/add_doctor')
                }
            })
        }

    }

    Manage_Doctors(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            doctormodal.Fetch_Doctors((err, result) => {
                if (err) {
                    res.render('Admin/Dashboard',
                        {
                            error: "Error In Loading Doctors"
                        })
                }
                else {
                    const success = req.session.success
                    const error = req.session.error

                    req.session.success = null
                    req.session.error = null

                    res.render('Admin/Manage_Doctors',
                        {
                            doctor_record: result,
                            success: success,
                            error: error
                        })
                }
            })
        }

    }

    Edit_Doctor(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            const data =
            {
                Id: req.params.id
            }

            doctormodal.Fetch_Doctor_By_Id(data, (err, result) => {
                if (err) {
                    res.redirect('/manage_doctors')
                }
                else {
                    const success = req.session.success
                    const error = req.session.error

                    req.session.success = null
                    req.session.error = null

                    res.render('Admin/Edit_Doctor',
                        {
                            doctor_data: result[0],
                            success: success,
                            error: error
                        })
                }
            })
        }

    }

    Update_Doctor(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            let doctorimage = "";

            if (req.files?.doctor_image) {

                doctorimage =
                    req.files
                        .doctor_image[0]
                        .filename;

            }
            else {

                doctorimage =
                    req.body.old_image;

            }
            let doctorsignature = ""

            if (req.files?.doctor_signature) {

                doctorsignature =

                    req.files
                        .doctor_signature[0]
                        .filename

            }
            else {

                doctorsignature =

                    req.body.old_signature

            }

            const data =
            {
                Id: req.body.id,
                Doctor_Name: req.body.doctor_name,
                Speciality: req.body.speciality,
                Experience: req.body.experience,
                Qualification: req.body.qualification,
                Description: req.body.description,
                Doctor_Image: doctorimage,
                Doctor_Signature: doctorsignature,
                Email: req.body.email
            }

            doctormodal.Update_Doctor(data, (err) => {
                if (err) {

                    req.session.error = "Error In Updating Doctor"
                }
                else {
                    req.session.success = "Doctor Updated Successfully"
                }

                res.redirect('/edit_doctor/' + req.body.id)
            })
        }


    }

    Delete_Doctor(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            const data =
            {
                Id: req.params.id
            }

            doctormodal.Delete_Doctor(data, (err) => {
                if (err) {
                    req.session.msg = "Error In Deleting Doctor"

                    res.redirect('/manage_doctors')
                }
                else {
                    req.session.msg = "Doctor Deleted Successfully"

                    res.redirect('/manage_doctors')
                }
            })
        }

    }

    Block_Doctor(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            const data =
            {
                Id: req.params.id
            }

            doctormodal.Block_Doctor(data, (err) => {
                if (err) {
                    req.session.error = "Error In Blocking Doctor"
                }
                else {
                    req.session.success = "Doctor Blocked Successfully"
                }

                res.redirect('/manage_doctors')
            })
        }

    }

    Unblock_Doctor(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            const data =
            {
                Id: req.params.id
            }

            doctormodal.Unblock_Doctor(data, (err) => {
                if (err) {
                    req.session.error = "Error In Unblocking Doctor"
                }
                else {
                    req.session.success = "Doctor Unblocked Successfully"
                }

                res.redirect('/manage_doctors')
            })
        }

    }

    Doctor_Appointments(req, res) {

        if (!req.session.doctor_email) {

            req.session.doctor_login_msg =
                "Please Login Here"

            return res.redirect('/doctor/login')
        }

        const data = {

            Doctor_Id: req.session.doctor_id
        }

        appointmentModel.Doctor_Appointments_List(
            data,
            (err, result) => {

                if (err) {

                    res.render(
                        'Doctor/My_Appointments',
                        {
                            appointments: [],
                            error:
                                "Error Loading Appointments"
                        })
                }
                else {

                    res.render(
                        'Doctor/My_Appointments',
                        {
                            appointments: result,
                            error: null
                        })
                }
            })
    }

    View_Doctor_Appointment(req, res) {

        if (!req.session.doctor_email) {

            req.session.doctor_login_msg =
                "Please Login Here"

            return res.redirect('/doctor/login')
        }

        const data = {

            Id: req.params.id
        }

        appointmentModel.Fetch_Appointment_By_Id(
            data,
            (err, result) => {

                if (err || result.length == 0) {

                    return res.redirect(
                        '/doctor/appointments'
                    )
                }

                res.render(
                    'Doctor/View_Appointment',
                    {
                        appoint_data: result[0]
                    }
                )
            })
    }

    Mark_Visited(req, res) {

        if (!req.session.doctor_email) {

            return res.render('Doctor/Doctor_Login',
                {
                    msg: "Please Login Here"
                })
        }

        const data =
        {
            Id: req.params.id
        }

        appointmentModel.Visit_Appointment(data, (err) => {

            if (err) {

                console.log(err)

                res.redirect('/doctor/appointments')
            }
            else {

                res.redirect('/doctor/view_appointment/' + req.params.id)
            }
        })
    }

    Write_Prescription(req, res) {
        if (!req.session.doctor_email) {
            req.session.error = "Please Login Here"

            return res.redirect('/doctor/login')
        }

        const data =
        {
            Id: req.params.id
        }

        const appointmentModel =
            require('../Modal/Appointment')

        appointmentModel.Fetch_Appointment_By_Id
            (data, (err, result) => {
                if (err) {
                    res.redirect('/doctor/appointments')
                }
                else {
                    const success = req.session.success
                    const error = req.session.error

                    req.session.success = null
                    req.session.error = null

                    res.render('Doctor/Write_Prescription',
                        {
                            appoint_data: result[0],
                            success: success,
                            error: error
                        })
                }
            })
    }

    Save_Prescription(req, res) {

        if (!req.session.doctor_email) {

            return res.render('Doctor/Doctor_Login',
                {
                    msg: "Please Login Here"
                })
        }

        const data =
        {
            Appointment_Id: req.body.appointment_id,

            Doctor_Id: req.session.doctor_id,

            Patient_Email: req.body.patient_email,

            Symptoms: req.body.symptoms,

            Diagnosis: req.body.diagnosis,

            Medicines: req.body.medicines,

            Advice: req.body.advice,

            Next_Visit_Date: req.body.next_visit_date
        }

        prescriptionmodal.Save_Prescription(data, (err) => {

            if (err) {

                console.log(err)

                req.session.error = "Error Saving Prescription"

            }
            else {

    // Change appointment status to Completed
    appointmentModel.Complete_Appointment(
    {
        Id: req.body.appointment_id
    },
    (statusErr) => {

        if (statusErr) {
            console.log(statusErr);
        }

        doctormodal.Fetch_Doctor_By_Id(
            { Id: req.session.doctor_id },
            (err, doctorResult) => {

                const doctorName = doctorResult[0].doctor_name;

                patientnotify.Create_Notification(
                    {
                        Email: req.body.patient_email,
                        Title: "Prescription Available",
                        Message: `${doctorName} has uploaded your prescription. Please check your prescription section.`,
                        Type: "prescription",
                        Action_Url: "/my_prescriptions"
                    },
                    () => { }
                );

            }
        );

    }
);

    req.session.success = "Prescription Added Successfully";

}

            res.redirect('/doctor/write_prescription/' + req.body.appointment_id)

        })
    }

    Prescription_History(req, res) {
        if (!req.session.doctor_email) {
            return res.redirect('/doctor/login')
        }

        const data =
        {
            Doctor_Id: req.session.doctor_id
        }

        prescriptionmodal
            .Doctor_Prescription_History(data,
                (err, result) => {
                    if (err) {
                        console.log(err)

                        return res.render(
                            'Doctor/Prescription_History',
                            {
                                prescription_record: []
                            })
                    }

                    res.render(
                        'Doctor/Prescription_History',
                        {
                            prescription_record: result
                        })
                })
    }

    View_Doctor_Prescription(req, res) {
        if (!req.session.doctor_email) {
            return res.redirect('/doctor/login')
        }

        const data =
        {
            Id: req.params.id
        }

        prescriptionmodal
            .Fetch_Prescription_By_Id(data,
                (err, result) => {
                    if (err || result.length == 0) {
                        return res.redirect(
                            '/doctor/prescription_history')
                    }

                    res.render(
                        'Doctor/View_Prescription',
                        {
                            prescription_data: result[0]
                        })
                })
    }

    Doctor_Profile(req, res) {
        if (!req.session.doctor_email) {
            return res.redirect('/doctor/login')
        }

        const data =
        {
            Id: req.session.doctor_id
        }

        doctormodal
            .Fetch_Doctor_By_Id(data,
                (err, result) => {
                    if (err || result.length == 0) {
                        return res.redirect('/doctor/dashboard')
                    }

                    res.render(
                        'Doctor/Doctor_Profile',
                        {
                            doctor_data: result[0]
                        })
                })
    }

    async Doctor_Settings(req, res) {

        if (req.method == 'GET') {

            if (!req.session.doctor_email) {

                return res.render('Doctor/Doctor_Login', {
                    msg: "Please Login Here"
                })
            }

            res.render('Doctor/Doctor_Settings')
        }

        else {

            if (!req.session.doctor_email) {

                return res.render('Doctor/Doctor_Login', {
                    msg: "Please Login Here"
                })
            }

            if (req.body.confpassword != req.body.newpassword) {

                return res.render('Doctor/Doctor_Settings', {
                    msg: "Password Mismatch"
                })
            }

            const bcrypt_salt = await bcrypt.genSalt(10)

            const hpassw = await bcrypt.hash(
                req.body.newpassword,
                bcrypt_salt
            )

            const data = {

                Email: req.session.doctor_email,

                NewPassword: hpassw
            }

            doctormodal.Check_Doctor_Password(data,
                async (err, result) => {

                    if (err) {

                        return res.render(
                            'Doctor/Doctor_Settings',
                            {
                                msg: "Error While Checking Password"
                            }
                        )
                    }

                    const dbpass = result[0].password

                    const ismatch = await bcrypt.compare(
                        req.body.oldpassword,
                        dbpass
                    )

                    if (ismatch) {

                        doctormodal.Change_Doctor_Password(
                            data,
                            (err) => {

                                if (err) {

                                    res.render(
                                        'Doctor/Doctor_Settings',
                                        {
                                            msg: "Error Contact Admin"
                                        }
                                    )
                                }

                                else {

                                    res.render(
                                        'Doctor/Doctor_Settings',
                                        {
                                            msg: "Password Changed Successfully"
                                        }
                                    )
                                }
                            })
                    }

                    else {

                        res.render(
                            'Doctor/Doctor_Settings',
                            {
                                msg: "Current Password Incorrect"
                            }
                        )
                    }
                })
        }
    }

    Assigned_Patients(req, res) {

        if (!req.session.doctor_email) {

            return res.render('Doctor/Doctor_Login', {
                msg: "Please Login Here"
            })
        }

        const data = {

            Doctor_Id: req.session.doctor_id
        }

        appointmentModel.Assigned_Patients(data,
            (err, result) => {

                if (err) {

                    console.log(err)

                    return res.render(
                        'Doctor/Assigned_Patients',
                        {
                            patient_record: []
                        }
                    )
                }

                res.render(
                    'Doctor/Assigned_Patients',
                    {
                        patient_record: result
                    }
                )
            })
    }

    View_Assigned_Patient(req, res) {

        if (!req.session.doctor_email) {

            return res.render('Doctor/Doctor_Login', {
                msg: "Please Login Here"
            })
        }

        const data = {

            Email: req.params.email
        }

        appointmentModel.Fetch_Assigned_Patient(data,
            (err, result) => {

                if (err || result.length == 0) {

                    console.log(err)

                    return res.redirect('/doctor/assigned_patients')
                }

                prescriptionmodal.Patient_Timeline(

                    {

                        Email: req.params.email,

                        Doctor_Id: req.session.doctor_id

                    },

                    (err2, timeline_result) => {

                        if (err2) {

                            console.log(err2)

                            timeline_result = []

                        }

                        res.render(

                            'Doctor/View_Assigned_Patient',

                            {

                                patient_data: result[0],

                                timeline_record: timeline_result

                            }

                        )

                    }

                )
            })
    }

}

module.exports = new Doctor()