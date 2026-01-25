const db = require('../Database/myconnect')

const user =
{
    create: (data, callback) => {
        const q = `insert into user(name,email,password,gender,address)values('${data.Name}','${data.Email}','${data.Password}','${data.Gender}','${data.Address}')`
        db.query(q, callback)
    },
    delete: (data, callback) => {
        const q = `delete from user where id=${data.id}`
        db.query(q, callback)
    },
    list_appointment: (callback) => {
        const q = `select * from user`
        db.query(q, callback)
    },
    check_login:(data,callback) => {
        const q = `select * from user where email='${data.Email}'`
        db.query(q, callback)
    },
    check_password:(data,callback) => {
        const q = `select * from user where email='${data.useremail}'`
        db.query(q, callback)
    },
    change_password:(data,callback) => {
        const q = `update user set password='${data.newpassword}' where email='${data.useremail}'`
        db.query(q, callback)
    },
    Patient_Profile_update: (data, callback) => {
        const q = `update user set mobile='${data.Mobile}',ayushmaan_card='${data.AyushCard}',dis_history='${data.Dhistory}',
        photo='${data.Profile_Photo}',profile_complete='yes' where email='${data.Email}'`
        db.query(q, callback)
    },
     Fetch_Profile: (data,callback) => {
        const q = `select * from user where email='${data.Email}'`
        db.query(q, callback)
    }
}

module.exports = user;