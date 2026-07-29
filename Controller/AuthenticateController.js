const usermodal = require('../Modal/useraccount')
const notify_modal = require('../Modal/Notification')
const pdash_notify = require('../Modal/Pdash_counter')
const patientnotify = require('../Modal/PatientNotification')
const prescriptionmodal = require('../Modal/Prescription')
const enquirymodal = require('../Modal/contact')
const bcrypt = require('bcryptjs')

class Auth {

    Appointment_Counter(req) {
        return new Promise((resolve, reject) => {
            const data = {
                user_email: req.session.patient_email
            }
            pdash_notify.Total_Appointment(data, (err, result) => {
                req.session.patient_appointment_counter = result.length
                resolve(result.length)
            })
        })

    }

    Enquiry_Counter(req) {
        return new Promise((resolve, reject) => {
            const data =
            {
                user_email: req.session.patient_email
            }

            pdash_notify.Total_Enquiry(data, (err, result) => {
                resolve(result.length)
            })
        })
    }

    Prescription_Counter(req) {
        return new Promise((resolve, reject) => {
            const data =
            {
                user_email: req.session.patient_email
            }

            pdash_notify.Total_Prescription(data, (err, result) => {
                resolve(result.length)
            })
        })
    }

    Patient_Notifications(req, res) {

        if (!req.session.patient_email) {

            return res.render(
                'Login',
                {
                    msg: "Please Login Here"
                }
            )

        }

        const data = {

            Email: req.session.patient_email

        }

        patientnotify.Archive_Old_Notifications(() => {

            patientnotify.Fetch_Notifications(

                data,

                (err, notifications) => {

                    if (err) {

                        notifications = []

                    }

                    patientnotify.Mark_Read(

                        data,

                        () => {

                            res.render(
                                'Patient_Notifications',
                                {
                                    notifications
                                }
                            )

                        }

                    )

                }

            )

        })

    }

    Archived_Notifications(req, res) {

        if (!req.session.patient_email) {

            return res.render(
                'Login',
                {
                    msg: "Please Login Here"
                }
            )

        }

        const data = {

            Email: req.session.patient_email

        }

        patientnotify.Fetch_Archived_Notifications(

            data,

            (err, result) => {

                if (err) {

                    console.log(err)

                    return res.redirect(
                        '/Patient_Dashboard'
                    )

                }

                res.render(
                    'Archived_Notifications',
                    {
                        notifications: result
                    }
                )

            }

        )

    }

    Archive_Notification(req, res) {

        if (!req.session.patient_email) {

            return res.render(
                'Login',
                {
                    msg: "Please Login Here"
                }
            )

        }

        const data = {

            Id: req.params.id

        }

        patientnotify.Archive_Notification(

            data,

            (err) => {

                if (err) {

                    console.log(err)

                }

                res.redirect(
                    '/patient_notifications'
                )

            }

        )

    }

    checkAuth(req, res) {
        if (req.method == 'GET') {
            res.render('Login')
        }
        else {
            const data = {
                Email: req.body.email
            }
            usermodal.check_login(data, async (err, result) => {
                if (err) {
                    res.render('Login', { msg: "Error in Login" })
                }
                else {
                    if (result.length > 0) {
                        const dbpass = result[0].password
                        const ismatch = await bcrypt.compare(req.body.password, dbpass)
                        if (ismatch) {
                            req.session.patient_email = result[0].email
                            const profile_check_status = result[0].profile_complete
                            if (profile_check_status == "no") {
                                res.render('Profile_Uncomplete', { msg: result[0].email })
                            }
                            else {
                                res.redirect('/Patient_Dashboard')
                            }
                        }
                        else {
                            res.render('Login', { msg: "Incorrect Password!", useremail: result[0].email })
                        }
                    }
                    else {
                        res.render('Login', { msg: "Email_ID Not Registered" })
                    }
                }
            })
        }
    }

    async create_user(req, res) {
        if (req.method == 'GET') {
            res.render('NewUser')
        }
        else {
            if (req.body.password != req.body.cpassword) {
                res.render('NewUser', { msg: "Password Mismatch" })
            }
            else {
                const bcrypt_salt = await bcrypt.genSalt(10)
                const hpassw = await bcrypt.hash(req.body.password, bcrypt_salt)
                const data = {
                    Name: req.body.username,
                    Email: req.body.email,
                    Password: hpassw,
                    Gender: req.body.gender,
                    Address: req.body.address
                }
                usermodal.create(data, (err) => {
                    if (err) {
                        res.render('NewUser', { msg: err + " Error in Account Creation" })
                    }
                    else {
                        res.render('NewUser', { msg: data.Name + " Account created Successfully" })
                    }
                })
            }
        }
    }

    async Patients_dashboard(req, res) {
        patientnotify.Archive_Old_Notifications(() => { })
        if (req.method == 'GET') {
            if (!req.session.patient_email) {
                res.render('Login', { msg: "Please Login Here" })
            }
            else {
                notify_modal.fetch_notification(async (err, record) => {

                    if (err) {

                        res.render('Login',
                            {
                                msg: "Problem In Loading Dashboard"
                            })
                    }
                    else {

                        var total_Apt = await this.Appointment_Counter(req)

                        var total_Enquiry = await this.Enquiry_Counter(req)

                        var total_Prescription = await this.Prescription_Counter(req)

                        const data =
                        {
                            user_email: req.session.patient_email
                        }

                        pdash_notify.Appointment_Status_Graph(data, (err, graphresult) => {
                            pdash_notify.Health_Activity(data, (err, healthresult) => {
                                patientnotify.Count_Unread({ Email: req.session.patient_email }, (err, notifyresult) => {
                                    let unread = 0
                                    if (!err && notifyresult.length > 0) {
                                        unread = notifyresult[0].total
                                    }
                                    res.render('PDashboard', {
                                        data: record,

                                        total_Appoint: total_Apt,

                                        total_Enquiry: total_Enquiry,

                                        total_Prescription: total_Prescription,

                                        appointment_graph: graphresult,

                                        health_record: healthresult[0],

                                        unread_count: unread
                                    })

                                })

                            })

                        })

                    }
                })
            }

        }

    }

    Patients_Logout(req, res) {
        req.session.destroy()
        res.render('Login', { msg: "Logout Successfully" })
    }
}

class Sets extends Auth {
    async Patients_Setting(req, res) {
        if (req.method == 'GET') {
            if (!req.session.patient_email) {
                res.render('Login', { msg: "Please Login Here" })
            }
            else {
                res.render('Pchangepassword')
            }
        }
        else {
            if (!req.session.patient_email) {
                res.render('Login', { msg: "Please Login Here" })
            }
            else {
                if (req.body.confpassword == req.body.newpassword) {
                    const bcrpyt_salt = await bcrypt.genSalt(10)
                    const hpassw = await bcrypt.hash(req.body.newpassword, bcrpyt_salt)
                    const data = {
                        useremail: req.session.patient_email,
                        newpassword: hpassw
                    }
                    usermodal.check_password(data, async (err, result) => {
                        if (err) {
                            res.render('Pchangepassword', { msg: " Error in While Checking" })
                        }
                        else {
                            const dbpass = result[0].password
                            const ismatch = await bcrypt.compare(req.body.oldpassword, dbpass)
                            if (ismatch) {
                                usermodal.change_password(data, (err) => {
                                    if (err) {
                                        res.render('Pchangepassword', { msg: " Error Contact Admin" })
                                    }
                                    else {
                                        res.render('Pchangepassword', { msg: "Password Changed Successfully" })
                                    }
                                })
                            }
                            else {
                                res.render('Pchangepassword', { msg: "Current Password Incorrect" })
                            }
                        }
                    })
                }
                else {
                    res.render('Pchangepassword', { msg: "Password Mismatch" })
                }
            }
        }
    }

    Patients_Profile_Complete(req, res) {
        if (!req.session.patient_email) {
            res.render('Login', { msg: "Please Login Here" })
        }
        else {
            const data = {
                Email: req.session.patient_email,
                Mobile: req.body.mobile,
                AyushCard: req.body.ayushcard,
                Dhistory: req.body.dhistory,
                Profile_Photo: req.file.filename
            }
            usermodal.Patient_Profile_update(data, (err) => {
                if (err) {
                    res.render('Login', { msg: " Error in Profile Completion Contact Admin" })
                }
                else {
                    res.render('Login', { msg: " Profile Updated Successfully! Please Login again" })
                }
            })
        }


    }

    Patient_Profile(req, res) {
        if (!req.session.patient_email) {
            res.render('Login', { msg: "Please Login Here" })
        }
        else {
            const data = {
                Email: req.session.patient_email
            }
            usermodal.Fetch_Profile(data, (err, result) => {
                if (err) {
                    res.render('Pchangepassword', { msg: " Error in While Checking" })
                }
                else {
                    res.render('Pprofile', { record: result })
                }

            })
        }
    }

    My_Prescriptions(req, res) {

        if (!req.session.patient_email) {

            return res.render('Login',
                {
                    msg: "Please Login Here"
                })
        }

        const data =
        {
            Email: req.session.patient_email
        }

        prescriptionmodal.Fetch_Patient_Prescriptions(data, (err, result) => {

            if (err) {

                console.log(err)

                res.render('PPrescription_List',
                    {
                        msg: "Error Loading Prescriptions"
                    })
            }
            else {

                res.render('PPrescription_List',
                    {
                        prescription_record: result
                    })
            }
        })
    }

    View_Prescription(req, res) {

        if (!req.session.patient_email) {

            return res.render('Login',
                {
                    msg: "Please Login Here"
                })
        }

        const data =
        {
            Id: req.params.id
        }

        prescriptionmodal.Fetch_Prescription_By_Id(data, (err, result) => {

            if (err) {

                console.log(err)

                res.redirect('/my_prescriptions')
            }
            else {

                res.render('View_Prescription',
                    {
                        prescription_data: result[0]
                    })
            }
        })
    }

    My_Enquiries(req, res) {
        if (!req.session.patient_email) {
            return res.render('Login',
                {
                    msg: "Please Login Here"
                })
        }

        const data =
        {
            Email: req.session.patient_email
        }

        enquirymodal.Patient_Enquiries(data, (err, result) => {
            if (err) {
                console.log(err)

                res.render('PEnquiry_List',
                    {
                        msg: "Error Loading Enquiries"
                    })
            }
            else {
                res.render('PEnquiry_List',
                    {
                        enquiry_record: result
                    })
            }
        })
    }

    Medical_History(req, res) {
        if (!req.session.patient_email) {
            return res.render('Login',
                {
                    msg: "Please Login Here"
                })
        }

        const data =
        {
            Email: req.session.patient_email
        }

        prescriptionmodal.Medical_History(data, (err, result) => {
            if (err) {
                console.log(err)

                res.render('PTreatment_History',
                    {
                        msg: "Error Loading Medical History"
                    })
            }
            else {
                res.render('PTreatment_History',
                    {
                        medical_record: result
                    })
            }
        })
    }

}
module.exports = new Sets();