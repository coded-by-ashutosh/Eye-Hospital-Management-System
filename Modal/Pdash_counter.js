const db = require('../Database/myconnect')

const counter_notify =
{
    Total_Appointment:(data,callback) => 
    {
        const q = `select * from appointment where email='${data.user_email}'`
        db.query(q, callback)
    }
}

module.exports=counter_notify