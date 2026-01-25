const db = require('../Database/myconnect')

const admin_notify =
{
    add_notification:(data,callback) => 
    {
        const q = `insert into notification(title,message,publish_by)values('${data.title}','${data.message}','${data.publishby}')`
        db.query(q, callback)
    },
    fetch_notification:(callback) =>
    {
        const q = `select * from notification`
        db.query(q, callback)
    }
}

module.exports=admin_notify