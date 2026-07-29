const db = require('../Database/myconnect')

const Appointment =
{
    create: (data, callback) => {
        const q = `insert into appointment(name,email,phone,preferred_date,prefer_time,issue,address)values('${data.Name}','${data.Email}','${data.Phone}','${data.Date}','${data.Time}','${data.Issue}','${data.address}')`
        db.query(q, callback)
    },
    delete: (data, callback) => {
        const q = `delete from appointment where id=${data.id}`
        db.query(q, callback)
    },
    list_appointment: (callback) => {
        const q = `select * from appointment order by id DESC`
        db.query(q, callback)
    },
    list_appointment_search: (data, callback) => {
        const q = `select * from appointment where email='${data.Email}'`
        db.query(q, callback)
    },

    Appointment_Analytics: (callback) => {
        const q = `select preferred_date,count(*) as totalappointments from appointment group by preferred_date order by preferred_date asc`
        db.query(q, callback)
    },

    Appointment_Status_Chart: (callback) => {
        const q = `SELECT status,COUNT(*) as total FROM appointment GROUP BY status`
        db.query(q, callback)
    },

    Total_Appointments: (callback) => {
        const q = `select * from appointment`

        db.query(q, callback)
    },
    Fetch_Appointment_By_Id: (data, callback) => {
        const q = `
    
    select appointment.*,
    doctors.doctor_name

    from appointment

    LEFT JOIN doctors
    ON appointment.doctor_id=doctors.id

    where appointment.id='${data.Id}'
    
    `

        db.query(q, callback)
    },

    Approve_Appointment: (data, callback) => {
        const q = `update appointment set status='Approved'
    where id='${data.Id}'`

        db.query(q, callback)
    },

    Reject_Appointment: (data, callback) => {
        const q = `update appointment set status='Rejected', admin_response='${data.admin_response}'
    where id='${data.Id}'`

        db.query(q, callback)
    },

    Recent_Appointments: (callback) => {
        const q = `select * from appointment order by id desc limit 5`
        db.query(q, callback)
    },

    Assign_Doctor: (data, callback) => {

        const q = `
    
    update appointment set

    doctor_id='${data.doctor_id}',

    status='Approved',

    admin_response='Doctor assigned successfully'

    where id='${data.appointment_id}'
    
    `

        db.query(q, callback)
    },

    Visit_Appointment: (data, callback) => {

        const q = `

    update appointment set

    status='Visited'

    where id='${data.Id}'

    `

        db.query(q, callback)
    },

    Complete_Appointment: (data, callback) => {
        const q = `

    update appointment set

    status='Completed'

    where id='${data.Id}'

    `

        db.query(q, callback)
    },

    Doctor_Appointments: (data, callback) => {

        const q = `
    
    select * from appointment

    where doctor_id='${data.Doctor_Id}'
    
    order by id desc
    
    `

        db.query(q, callback)
    },

    Today_Doctor_Appointments: (data, callback) => {

        const q = `
    
    select * from appointment

    where doctor_id='${data.Doctor_Id}'

    AND preferred_date = CURDATE()
    
    `

        db.query(q, callback)
    },

    Doctor_Appointments_List: (data, callback) => {

        const q = `

    select appointment.*,
    doctors.doctor_name

    from appointment

    LEFT JOIN doctors
    ON appointment.doctor_id = doctors.id

    where appointment.doctor_id='${data.Doctor_Id}'

    order by appointment.id desc

    `

        db.query(q, callback)
    },

    Doctor_Appointment_Chart: (data, callback) => {

        const q = `

    SELECT status, COUNT(*) as total

    FROM appointment

    WHERE doctor_id='${data.Doctor_Id}'

    GROUP BY status

    `

        db.query(q, callback)
    },

    Assigned_Patients: (data, callback) => {

        const q = `

SELECT

user.name,
user.email,

COUNT(
CASE
WHEN appointment.status='Visited'
OR appointment.status='Completed'
THEN 1
END
) AS total_visits,

MAX(
CASE
WHEN appointment.status='Visited'
OR appointment.status='Completed'
THEN appointment.preferred_date
END
) AS last_visit

FROM appointment

INNER JOIN user
ON appointment.email=user.email

WHERE appointment.doctor_id='${data.Doctor_Id}'

GROUP BY user.email

`

        db.query(q, callback)

    },

    Doctor_Consultation_Summary: (data, callback) => {

    const q = `

    SELECT

    SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) AS completed,

    SUM(CASE WHEN status='Visited' THEN 1 ELSE 0 END) AS visited,

    SUM(CASE WHEN status='Approved' THEN 1 ELSE 0 END) AS pending

    FROM appointment

    WHERE doctor_id='${data.Doctor_Id}'

    `

    db.query(q, callback)

},

    Fetch_Assigned_Patient: (data, callback) => {

        const q = `

    SELECT *

    FROM user

    WHERE email='${data.Email}'

    `

        db.query(q, callback)
    },
   Update_Status(id, status, callback) {

    const sql = `
        UPDATE appointment
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], callback);

}
    
}

module.exports = Appointment;