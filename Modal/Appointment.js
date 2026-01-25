const db = require('../Database/myconnect')

const Appointment =
{
    create: (data, callback) => {
        const q = `insert into appointment(name,email,phone,preferred_date,prefer_time,address)values('${data.Name}','${data.Email}','${data.Phone}','${data.Date}','${data.Time}','${data.address}')`
        db.query(q, callback)
    },
    delete: (data, callback) => {
        const q = `delete from appointment where id=${data.id}`
        db.query(q, callback)
    },
    list_appointment: (callback) => {
        const q = `select * from appointment`
        db.query(q, callback)
    },
    list_appointment_search:(data,callback) => 
    {
        const q = `select * from appointment where email='${data.Email}'`
        db.query(q, callback)
    }
    
}

module.exports = Appointment;