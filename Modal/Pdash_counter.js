const db = require('../Database/myconnect')

const counter_notify =
{
    Total_Appointment:(data,callback) => 
    {
        const q = `select * from appointment where email='${data.user_email}'`
        db.query(q, callback)
    },
    Total_Enquiry:(data,callback)=>
    {
        const q = `select * from contact where email='${data.user_email}'`
        db.query(q,callback)
    },
    Total_Prescription:(data,callback)=>
    {
        const q = `select * from prescription where patient_email='${data.user_email}'`
        db.query(q,callback)
    },
    Appointment_Status_Graph:(data,callback)=>
    {
        const q = `SELECT status,COUNT(*) as total FROM appointment WHERE email='${data.user_email}' GROUP BY status`
    db.query(q,callback)
    },
    Health_Activity:(data,callback)=>
    {
        const q=`SELECT(
        SELECT COUNT(*) 
        FROM prescription
        WHERE patient_email='${data.user_email}'
    ) AS total_prescriptions,

    (SELECT COUNT(*)
        FROM appointment
        WHERE email='${data.user_email}'
        AND status='Completed'
    ) AS completed_visits,

    (SELECT COUNT(*)
        FROM appointment
        WHERE email='${data.user_email}'
        AND status='Pending'
    ) AS pending_appointments`
    db.query(q,callback)
    }
    
}

module.exports=counter_notify