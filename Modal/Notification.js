const db = require('../Database/myconnect')

const admin_notify =
{
    add_notification: (data, callback) => {
        const q = `insert into notification(title,message,publish_by,expiry_date)values('${data.title}','${data.message}','${data.publishby}','${data.expiry_date}')`
        db.query(q, callback)
    },
    fetch_notification: (callback) => {
        const q = `select * from notification where expiry_date is null or expiry_date >= curdate() order by id desc`
        db.query(q, callback)
    },
    Total_Notifications: (callback) => {
        const q = `select * from notification`

        db.query(q, callback)
    },
    delete_notification: (data, callback) => {
        const q = `delete from notification where id='${data.Id}'`

        db.query(q, callback)
    },
    Delete_Expired: (callback) => {
        const q = `DELETE FROM notification WHERE expiry_date < CURDATE()`

        db.query(q, callback)
    }
}

module.exports = admin_notify