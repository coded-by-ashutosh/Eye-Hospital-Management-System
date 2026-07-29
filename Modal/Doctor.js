const db = require('../Database/myconnect')

const Doctor =
{
    Doctor_Login: (data, callback) => {
        const q = `
    select * from doctors
    where email='${data.Email}'
    `

        db.query(q, callback)
    },


    Add_Doctor: (data, callback) => {
        const q = `
        insert into doctors
        (
            doctor_name,
            speciality,
            experience,
            qualification,
            description,
            doctor_image,
            doctor_signature,
            doctor_status,
            email,
            password
        )

        values
        (
            '${data.Doctor_Name}',
            '${data.Speciality}',
            '${data.Experience}',
            '${data.Qualification}',
            '${data.Description}',
            '${data.Doctor_Image}',
            '${data.Doctor_Signature}',
            'active',
            '${data.Email}',
            '${data.Password}'
        )`

        db.query(q, callback)
    },

    Fetch_Doctors: (callback) => {
        const q = `select * from doctors order by id desc`

        db.query(q, callback)
    },

    Fetch_Limited_Doctors: (callback) => {
        const q = `select * from doctors order by id desc limit 4`

        db.query(q, callback)
    },

    Update_Doctor: (data, callback) => {
        const q = `
        update doctors set

        doctor_name='${data.Doctor_Name}',
        speciality='${data.Speciality}',
        experience='${data.Experience}',
        qualification='${data.Qualification}',
        description='${data.Description}',
        doctor_image='${data.Doctor_Image}',
        doctor_signature='${data.Doctor_Signature}',
        email='${data.Email}'

        where id='${data.Id}'
        `

        db.query(q, callback)
    },

    Delete_Doctor: (data, callback) => {
        const q = `delete from doctors where id='${data.Id}'`

        db.query(q, callback)
    },

    Total_Doctors: (callback) => {
        const q = `select * from doctors`

        db.query(q, callback)
    },

    Block_Doctor: (data, callback) => {
        const q = `
    update doctors set
    doctor_status='blocked'
    where id='${data.Id}'
    `

        db.query(q, callback)
    },

    Unblock_Doctor: (data, callback) => {
        const q = `
    update doctors set
    doctor_status='active'
    where id='${data.Id}'
    `

        db.query(q, callback)
    },

    Fetch_Doctor_By_Id: (data, callback) => {
        const q = `select * from doctors where id='${data.Id}'`

        db.query(q, callback)
    },

    Check_Doctor_Password: (data, callback) => {

        const q = `
    
    select password from doctors
    
    where email='${data.Email}'
    
    `

        db.query(q, callback)
    },

    Change_Doctor_Password: (data, callback) => {

        const q = `
    
    update doctors set
    
    password='${data.NewPassword}'
    
    where email='${data.Email}'
    
    `

        db.query(q, callback)
    },

    Check_Doctor_Available: (data, callback) => {
        const q = `

SELECT appointment.id

FROM appointment

LEFT JOIN doctors
ON appointment.doctor_id=doctors.id

WHERE

appointment.doctor_id='${data.Doctor_Id}'

AND

appointment.preferred_date='${data.Date}'

AND

appointment.prefer_time='${data.Time}'

AND

appointment.status IN
(
'Pending',
'Approved',
'Visited'
)

`

        db.query(q, callback)

    },

    Check_Doctor_Status: (data, callback) => {

        const q = `

SELECT doctor_status, doctor_name

FROM doctors

WHERE id='${data.Doctor_Id}'

`

        db.query(q, callback)

    },

    Fetch_Active_Doctors: (callback) => {

        const q = `

    SELECT *

    FROM doctors

    WHERE doctor_status='active'

    ORDER BY doctor_name

    `

        db.query(q, callback)
    }
}

module.exports = Doctor