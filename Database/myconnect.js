const mysql=require('mysql2')

const pool=mysql.createPool({
      host:'localhost',
      user:'root',
      password:'',
      database:'eyra',
      waitForConnections:true,
      connectionLimit:10,
      queueLimit:0,
      multipleStatements:true
})

pool.getConnection((err,connection)=>{
      if(err) throw err;
      console.log("Database connected successfully ID: "+connection.threadId);
})

module.exports=pool

