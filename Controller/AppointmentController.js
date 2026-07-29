const appointmentModel = require('../Modal/Appointment')
class AppointmentController {

    Add_Appointment(req, res) {

        const selectedDate =
            new Date(req.body.date)

        const selectedDay =
            selectedDate.getDay()

        const selectedTime =
            req.body.time

        if (selectedDay === 0) {

            req.session.msg =
                "Appointments available Monday to Saturday only"

            return res.redirect('/bookappointment_success')
        }

        if (
            selectedTime < '09:00'
            ||
            selectedTime > '20:00'
        ) {

            req.session.msg =
                "Appointments allowed only between 9 AM and 8 PM"

            return res.redirect('/bookappointment_success')
        }

        const data =
        {
            Name: req.body.name,
            Email: req.body.email,
            Phone: req.body.phone,
            Date: req.body.date,
            Time: req.body.time,
            Issue: req.body.issue,
            address: req.body.address
        }

        appointmentModel.create(data, (err) => {

            if (err) {

                req.session.msg =
                    "Error in Booking Appointment"

            }
            else {

                req.session.msg =
                    data.Name +
                    " your appointment request has been submitted successfully. Please register/login to track your appointment status."

            }

            res.redirect('/bookappointment_success')

        })

    }

    get_records(req, res) {
        const data = {
            Email: req.session.patient_email
        }
        if (!req.session.patient_email) {
            res.render('Login', { msg: "Please Login Here" })
        }
        else {
            appointmentModel.list_appointment_search(data, (err, result) => {
                if (err) {
                    res.render('PAppointment_List', { msg: "Error While Fetching Contact Admin" })
                }
                else {
                    if (result.length > 0) {
                        res.render('PAppointment_List', { datas: result })
                    }
                    else {
                        res.render('PAppointment_List', { msg: "Not Any Appointment Exists Releated To This Account" })
                    }
                }

            })
        }
    }

}


module.exports = new AppointmentController()