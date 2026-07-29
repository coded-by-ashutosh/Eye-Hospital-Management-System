const admin_modal = require('../Modal/Admin')
const notify_modal = require('../Modal/Notification')
const patientnotify = require('../Modal/PatientNotification')
const usermodal = require('../Modal/useraccount')
const appointmodal = require('../Modal/Appointment')
const doctormodal = require('../Modal/Doctor')
const enquirymodal = require('../Modal/contact')
const eyedonationmodal = require('../Modal/EyeDonation')

class Admin {
    Check_admin(req, res) {
        if (req.method == 'GET') {
            res.render('Admin/Admin_Login')
        }
        else {
            const data = {
                username: req.body.username,
                password: req.body.password
            }
            admin_modal.admin_login(data, (err, result) => {
                if (err) {
                    res.render('Admin/Admin_login', { msg: "Error While Checking" })
                }
                else {
                    if (result.length > 0) {
                        const userpassword = result[0].password
                        if (data.password == userpassword) {
                            req.session.admin_user = data.username
                            res.redirect('/admin/dashboard')
                        }
                        else {
                            res.render('Admin/Admin_Login', { msg: "Incorrect Password", username: data.username })
                        }
                    }
                    else {
                        res.render('Admin/Admin_Login', { msg: "Username Not Exists" })
                    }
                }
            })
        }
    }

    // Dashboard(req,res)
    // {
    //     if(!req.session.admin_user)
    //     {
    //         res.render('Admin/Admin_Login',{msg:"Login Here"})
    //     }
    //     else
    //     {
    //         res.render('Admin/Dashboard')
    //     }
    // }

    Dashboard(req, res) {
        notify_modal.Delete_Expired(() => { })
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', {
                msg: "Login Here"
            })
        }
        else {
            usermodal.Total_Patients((err, userresult) => {

                appointmodal.Total_Appointments((err, appointresult) => {

                    appointmodal.Appointment_Status_Chart((err, chartresult) => {

                        doctormodal.Total_Doctors((err, doctorresult) => {

                            enquirymodal.Total_Enquiries((err, enquiryresult) => {

                                appointmodal.Appointment_Analytics((err, chartdata) => {

                                    appointmodal.Recent_Appointments((err, recentappointmentresult) => {

                                        usermodal.Recent_Users((err, recentuserresult) => {

                                            enquirymodal.Recent_Enquiries((err, recentenquiryresult) => {

                                                if (err) {
                                                    res.render('Admin/Dashboard', {
                                                        msg: "Error In Loading Dashboard"
                                                    })
                                                }
                                                else {
                                                    res.render('Admin/Dashboard',
                                                        {
                                                            total_patients: userresult.length,

                                                            total_appointments: appointresult.length,

                                                            total_doctors: doctorresult.length,

                                                            total_enquiries: enquiryresult.length,

                                                            appointmentchart: chartdata,

                                                            appointment_status_chart: chartresult,

                                                            recent_appointments: recentappointmentresult,

                                                            recent_users: recentuserresult,

                                                            recent_enquiries: recentenquiryresult
                                                        })
                                                }

                                            })

                                        })

                                    })

                                })

                            })

                        })

                    })

                })
            })
        }
    }

    Logout(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', { msg: "Login Here" })
        }
        else {
            req.session.destroy()
            res.render('Admin/Admin_Login', { msg: "Logout Successfully" })
        }
    }

}

class sub_admin extends Admin {
    notification(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', { msg: "Login Here...." })
        }
        else {
            if (req.method == "GET") {
                res.render('Admin/push_notifications.ejs')
            }
            else {
                const data = {
                    title: req.body.title,
                    message: req.body.message,
                    publishby: req.session.admin_user,
                    expiry_date: req.body.expiry_date
                }
                notify_modal.add_notification(data, (err) => {
                    if (err) {
                        res.render('Admin/push_notifications', { msg: " Error Check Server" })
                    }
                    else {
                        res.render('Admin/push_notifications', { msg: " Notification Added Successfully" })
                    }
                })
            }
        }
    }

    Manage_Notifications(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', {
                msg: "Please Login Here"
            })
        }
        else {
            notify_modal.fetch_notification((err, result) => {
                if (err) {
                    res.render('Admin/Dashboard', {
                        msg: "Error In Loading Notifications"
                    })
                }
                else {
                    res.render('Admin/Manage_Notifications', {
                        notification_record: result
                    })
                }
            })
        }
    }

    Delete_Notification(req, res) {
        const data =
        {
            Id: req.params.id
        }

        notify_modal.delete_notification(data, (err) => {
            if (err) {
                res.redirect('/manage_notifications')
            }
            else {
                res.redirect('/manage_notifications')
            }
        })
    }



    Manage_Enquiries(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', {
                msg: "Login Here"
            })
        }
        else {
            enquirymodal.list_contact((err, result) => {
                if (err) {
                    res.render('Admin/Dashboard', {
                        msg: "Error In Loading Enquiries"
                    })
                }
                else {
                    res.render('Admin/Manage_Enquiries', {
                        enquiry_record: result
                    })
                }
            })
        }
    }

    Reply_Enquiry(req, res) {

    if (!req.session.admin_user) {

        return res.render('Admin/Admin_Login', {
            msg: "Login Here"
        })
    }

    const data = {
        Id: req.body.id,
        Admin_Reply: req.body.admin_reply
    }

    // Fetch enquiry first
    enquirymodal.Fetch_Enquiry_By_Id(
        { Id: req.body.id },

        (err, result) => {

            if (err || result.length == 0) {

                return res.redirect('/manage_enquiry')

            }

            const patientEmail = result[0].email

            enquirymodal.Reply_Enquiry(data, (err) => {

                if (err) {

                    return res.redirect('/manage_enquiry')

                }

                patientnotify.Create_Notification(
                    {
                        Email: patientEmail,

                        Title: "Enquiry Replied",

                        Message: "Admin has replied to your enquiry. Click to view the response.",

                        Type: "enquiry",

                        Action_Url: "/my_enquiries"
                    },

                    () => {

                        res.redirect('/manage_enquiry')

                    }
                )

            })

        }
    )
}

    Delete_Enquiry(req, res) {
        const data =
        {
            id: req.params.id
        }

        enquirymodal.delete(data, (err) => {
            if (err) {
                res.redirect('/manage_enquiry')
            }
            else {
                res.redirect('/manage_enquiry')
            }
        })
    }

    Manage_Users(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', {
                msg: "Please Login Here"
            })
        }
        else {
            usermodal.list_appointment((err, result) => {
                if (err) {
                    res.render('Admin/Dashboard', {
                        msg: "Error In Loading Users"
                    })
                }
                else {
                    res.render('Admin/Manage_Users', {
                        user_record: result
                    })
                }
            })
        }
    }

    Delete_User(req, res) {
        const data =
        {
            Id: req.params.id
        }

        usermodal.Delete_User(data, (err) => {
            if (err) {
                res.redirect('/user_account')
            }
            else {
                res.redirect('/user_account')
            }
        })
    }

    View_User_Profile(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login', {
                msg: "Please Login Here"
            })
        }
        else {
            const data =
            {
                Id: req.params.id
            }

            usermodal.Fetch_User_By_Id(data, (err, result) => {
                if (err) {
                    res.render('Admin/Dashboard', {
                        msg: "Error In Loading User Profile"
                    })
                }
                else {
                    res.render('Admin/View_User_Profile', {
                        user_data: result[0]
                    })
                }
            })
        }
    }

    Manage_Appointments(req, res) {
        if (!req.session.admin_user) {
            res.render('Admin/Admin_Login',
                {
                    msg: "Please Login Here"
                })
        }
        else {
            appointmodal.list_appointment((err, result) => {

                const success =
                    req.session.appointment_success

                const error =
                    req.session.appointment_error

                req.session.appointment_success = null
                req.session.appointment_error = null

                if (err) {
                    res.render('Admin/Dashboard',
                        {
                            msg: "Error In Loading Appointments"
                        })
                }
                else {
                    res.render('Admin/Manage_Appointments',
                        {
                            appointment_record: result,
                            success: success,
                            error: error
                        })
                }

            })
        }
    }

    View_Appointment(req, res) {
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

            appointmodal.Fetch_Appointment_By_Id(data, (err, result) => {
                if (err) {
                    res.redirect('/manage_appointments')
                }
                else {
                    doctormodal.Fetch_Active_Doctors((err, doctorresult) => {

                        res.render(
                            'Admin/View_Appointment',
                            {
                                appoint_data: result[0],
                                doctors: doctorresult
                            }
                        )

                    })
                }
            })
        }

    }

    Approve_Appointment(req, res) {

        const data = {
            Id: req.params.id
        }

        appointmodal.Fetch_Appointment_By_Id(

            data,

            (err, result) => {

                if (err || result.length == 0) {

                    console.log("Appointment fetch error")

                    return res.redirect(
                        '/manage_appointments'
                    )
                }

                console.log(result[0])

                const patientEmail =
                    result[0].email ||
                    result[0].patient_email

                console.log(
                    "Patient Email:",
                    patientEmail
                )

                if (!patientEmail) {

                    console.log(
                        "Email not found"
                    )

                    return res.redirect(
                        '/manage_appointments'
                    )
                }

                appointmodal.Approve_Appointment(

                    data,

                    (err) => {

                        if (err) {

                            console.log(err)

                            return res.redirect(
                                '/manage_appointments'
                            )
                        }


                    }

                )

            }

        )

    }

    Reject_Appointment(req, res) {

        const data =
        {
            Id: req.body.appointment_id,

            admin_response: req.body.admin_response
        }

        appointmodal.Fetch_Appointment_By_Id(

            {
                Id: data.Id
            },

            (err, result) => {

                if (err || result.length == 0) {

                    return res.redirect(
                        '/manage_appointments'
                    )

                }

                const patientEmail =
                    result[0].email

                appointmodal.Reject_Appointment(

                    data,

                    (err) => {

                        if (err) {

                            return res.redirect(
                                '/manage_appointments'
                            )

                        }

                        patientnotify.Create_Notification(

                            {

                                Email:
                                    patientEmail,

                                Title:
                                    "Appointment Rejected",

                                Message:

                                    "Your appointment request was rejected. Reason: "

                                    +

                                    data.admin_response,

                                Type: "appointment",

                                Action_Url: "/Patient_Appointment"

                            },

                            () => {

                                res.redirect(
                                    '/manage_appointments'
                                )

                            }

                        )

                    }

                )

            }

        )

    }

    Delete_Appointment(req, res) {
        const data =
        {
            id: req.params.id
        }

        appointmodal.delete(data, (err) => {
            if (err) {
                res.redirect('/manage_appointments')
            }
            else {
                res.redirect('/manage_appointments')
            }
        })
    }

    Assign_Doctor(req, res) {

        const data =
        {
            appointment_id: req.body.appointment_id,
            doctor_id: req.body.doctor_id,
            admin_response: req.body.admin_response
        }

        doctormodal.Check_Doctor_Status(
            {
                Doctor_Id: data.doctor_id
            },

            (err, status_result) => {

                if (err || status_result.length == 0) {
                    req.session.appointment_error =
                        "Unable to verify doctor"

                    return res.redirect('/manage_appointments')
                }

                if (status_result[0].doctor_status != "active") {
                    req.session.appointment_error =
                        "Doctor is blocked. Cannot assign."

                    return res.redirect('/manage_appointments')
                }

                appointmodal.Fetch_Appointment_By_Id(
                    {
                        Id: data.appointment_id
                    },

                    (err, appointment_result) => {

                        if (err || appointment_result.length == 0) {
                            req.session.appointment_error =
                                "Appointment not found"

                            return res.redirect('/manage_appointments')
                        }

                        const slot_data =
                        {
                            Doctor_Id: data.doctor_id,
                            Date: appointment_result[0].preferred_date,
                            Time: appointment_result[0].prefer_time
                        }

                        doctormodal.Check_Doctor_Available(
                            slot_data,

                            (err, busy_result) => {

                                if (err) {
                                    req.session.appointment_error =
                                        "Unable to check availability"

                                    return res.redirect('/manage_appointments')
                                }

                                if (busy_result.length > 0) {
                                    req.session.appointment_error =
                                        "Doctor already occupied on selected slot"

                                    return res.redirect('/manage_appointments')
                                }

                                appointmodal.Assign_Doctor(

                                    data,

                                    (err) => {

                                        if (err) {

                                            req.session.appointment_error =
                                                "Doctor assignment failed"

                                            return res.redirect(
                                                '/manage_appointments'
                                            )

                                        }

                                        const patientEmail =
                                            appointment_result[0].email
                                        console.log(status_result);
                                        patientnotify.Create_Notification(

                                            {

                                                Email: appointment_result[0].email,

                                                Title: "Appointment Approved",

                                                Message: status_result[0].doctor_name + " has been assigned to your appointment.",

                                                Type: "appointment",

                                                Action_Url: "/Patient_Appointment"

                                            },

                                            () => {

                                                req.session.appointment_success =
                                                    "Doctor assigned successfully"

                                                res.redirect(
                                                    '/manage_appointments'
                                                )

                                            }

                                        )

                                    })

                            })

                    })

            })

    }

    Manage_Eye_Donation(req, res) {

        if (!req.session.admin_user) {

            return res.render(

                'Admin/Admin_Login',

                {

                    msg: "Please Login Here"

                })

        }

        eyedonationmodal.Fetch_Donors(

            (err, result) => {

                if (err) {

                    return res.render(

                        'Admin/Dashboard',

                        {

                            msg: "Error Loading Donors"

                        })

                }

                res.render(

                    'Admin/Manage_Eye_Donation',

                    {

                        donor_record: result

                    })

            })

    }

    Approve_Eye_Donor(req, res) {

        const data = {

            Id: req.params.id

        }

        eyedonationmodal.Approve_Donor(

            data,

            (err) => {

                res.redirect(

                    '/manage_eye_donation'

                )

            })

    }

    Reject_Eye_Donor(req, res) {

        const data = {

            Id: req.params.id

        }

        eyedonationmodal.Reject_Donor(

            data,

            (err) => {

                res.redirect(

                    '/manage_eye_donation'

                )

            })

    }

    Delete_Eye_Donor(req, res) {

        const data = {

            Id: req.params.id

        }

        eyedonationmodal.Delete_Donor(

            data,

            (err) => {

                res.redirect(

                    '/manage_eye_donation'

                )

            })

    }

}

module.exports = new sub_admin