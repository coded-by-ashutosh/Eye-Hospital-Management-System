const db = require('../Database/myconnect')

const adminuser =
{
    admin_login:(data,callback) => 
    {
        const q = `select * from admin where username='${data.username}'`
        db.query(q, callback)
    }
}

module.exports=adminuser