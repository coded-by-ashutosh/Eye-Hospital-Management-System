const db = require('../Database/myconnect')

const contact =
{
    create: (data, callback) => {
        const q = `insert into contact(name,email,subject,message) values('${data.Name}','${data.Email}','${data.Subject}','${data.Message}')`
        db.query(q, callback)
    },
    delete: (data, callback) => {
        const q = `delete from contact where id=${data.id}`
        db.query(q, callback)
    },
    update_contact: (callback) => {
        const q = `update contact set name='${data.Name}',subject='${data.Subject}',message='${data.Message}' where email='${data.Email}'`
        db.query(q, callback)
    },
    list_contact:(callback) => {
        const q='Select * from contact'
         db.query(q, callback)
    }
}

module.exports = contact;