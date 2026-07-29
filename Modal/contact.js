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
    update_contact: (data, callback) => {
        const q = `update contact set name='${data.Name}',subject='${data.Subject}',message='${data.Message}' where email='${data.Email}'`
        db.query(q, callback)
    },
    list_contact: (callback) => {
        const q = 'Select * from contact'
        db.query(q, callback)
    },
    Fetch_Enquiry_By_Id: (data, callback) => {
        const q = `select * from contact where id='${data.Id}'`

        db.query(q, callback)
    },
    Total_Enquiries: (callback) => {
        const q = `select * from contact`

        db.query(q, callback)
    },
    Recent_Enquiries: (callback) => {
        const q = `select * from contact order by id desc limit 5`
        db.query(q, callback)
    },
    Reply_Enquiry: (data, callback) => {
        const q = `update contact set admin_reply='${data.Admin_Reply}', reply_status='Resolved' where id='${data.Id}'`
        db.query(q, callback)
    },
    Patient_Enquiries: (data, callback) => {
        const q = `select * from contact where email='${data.Email}' order by id desc`
        db.query(q, callback)
    },
}

module.exports = contact;