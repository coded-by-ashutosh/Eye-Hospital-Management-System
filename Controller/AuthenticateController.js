const usermodal=require('../Modal/useraccount')
const notify_modal=require('../Modal/Notification')
const pdash_notify=require('../Modal/Pdash_counter')
const bcrypt=require('bcryptjs')

class Auth 
{

    Appointment_Counter(req)
    {
        return new Promise((resolve ,reject)=>
        {
           const data={
            user_email:req.session.patient_email
        }
        pdash_notify.Total_Appointment(data,(err,result)=>
        {
            req.session.patient_appointment_counter=result.length
            resolve(result.length)
        })
        })

    }


    checkAuth(req, res) 
    {
        if (req.method == 'GET') {
            res.render('Login')
        }
        else 
        {
            const data={
                Email:req.body.email
            }
            usermodal.check_login(data,async(err,result) => {
                if(err)
                {
                    res.render('Login',{msg:"Error in Login"})
                }
                else
                {
                    if(result.length>0)
                    {
                        const dbpass=result[0].password
                        const ismatch=await bcrypt.compare(req.body.password,dbpass)
                        if(ismatch)
                        {
                            req.session.patient_email=result[0].email
                            const profile_check_status=result[0].profile_complete
                            if(profile_check_status=="no")
                            {
                                res.render('Profile_Uncomplete',{msg:result[0].email})
                            }
                            else
                            {
                                res.redirect('/Patient_Dashboard')
                            }
                        }
                        else
                        {
                            res.render('Login',{msg:"Incorrect Password!",useremail:result[0].email})
                        }
                    }
                    else
                    {
                        res.render('Login',{msg:"Email_ID Not Registered"})
                    }
                }
            })
        }
    }

    async create_user(req, res) 
    {
        if (req.method == 'GET') {
            res.render('NewUser')
        }
        else {
            if (req.body.password!=req.body.cpassword) {
                res.render('NewUser', {msg: "Password Mismatch" })
            }
            else {
                const bcrypt_salt=await bcrypt.genSalt(10)
                const hpassw=await bcrypt.hash(req.body.password,bcrypt_salt)
                const data = {
                    Name: req.body.username,
                    Email: req.body.email,
                    Password:hpassw,
                    Gender: req.body.gender,
                    Address: req.body.address
                }
                usermodal.create(data,(err)=>{
                    if(err)
                    {
                        res.render('NewUser',{msg:err+" Error in Account Creation"})
                    }
                    else
                    {
                        res.render('NewUser',{msg:data.Name+" Account created Successfully"})
                    }
                })
            }
        }
    }

    async Patients_dashboard(req, res) 
    {
        if (req.method == 'GET') 
            {
            if(!req.session.patient_email)
            {
                res.render('Login',{msg:"Please Login Here"})
            }
            else
            {
                notify_modal.fetch_notification(async(err,record)=>
                {
                    if(err)
                    {
                        res.render('Login',{msg:"Problem In Loading Dashboard"})
                    }
                    else
                    {
                        var total_Apt=await this.Appointment_Counter(req)
                        res.render('PDashboard',{data:record,total_Appoint:total_Apt})
                    }
                })
            }
           
        }
        
    }

    Patients_Logout(req,res)
    {
        req.session.destroy()
        res.render('Login',{msg:"Logout Successfully"})
    }
}

class Sets extends Auth 
{
     async Patients_Setting(req,res)
      {
        if(req.method=='GET')
         {
            if(!req.session.patient_email)
            {
                res.render('Login',{msg:"Please Login Here"})
            }
            else 
            {
            res.render('Pchangepassword')
            }
         }
         else 
         {
            if(!req.session.patient_email)
            {
                res.render('Login',{msg:"Please Login Here"})
            }
            else 
            {
                    if(req.body.confpassword==req.body.newpassword)
                    {
                        const bcrpyt_salt=await bcrypt.genSalt(10)
                       const hpassw=await bcrypt.hash(req.body.newpassword,bcrpyt_salt)
                        const data={
                             useremail:req.session.patient_email,
                             newpassword:hpassw
                        }
                            usermodal.check_password(data,async (err,result)=>{
                            if (err)
                            {
                                res.render('Pchangepassword',{msg:" Error in While Checking"})
                            }
                            else
                            {        
                                  const dbpass=result[0].password 
                                    const ismatch=await bcrypt.compare(req.body.oldpassword,dbpass)   
                                    if(ismatch)
                                   {                
                                     usermodal.change_password(data,(err)=>
                                     {
                                         if(err)
                                         {
                                             res.render('Pchangepassword',{msg:" Error Contact Admin"})
                                         }
                                         else 
                                         {
                                            res.render('Pchangepassword',{msg:"Password Changed Successfully"})
                                         }
                                     })
                                   }                
                                else 
                                {
                                    res.render('Pchangepassword',{msg:"Current Password Incorrect"})
                                }
                            }
                            })
                    }
                    else 
                    {
                        res.render('Pchangepassword',{msg:"Password Mismatch"})
                    }
                }
         }
      }

     Patients_Profile_Complete(req,res)
      {
            if(!req.session.patient_email)
            {
                res.render('Login',{msg:"Please Login Here"})
            }
            else
            {
                 const data={
                      Email:req.session.patient_email,
                      Mobile:req.body.mobile,
                      AyushCard:req.body.ayushcard,
                      Dhistory:req.body.dhistory,
                      Profile_Photo:req.file.filename
        }
            usermodal.Patient_Profile_update(data,(err)=>{
                    if(err)
                    {
                        res.render('Login',{msg:" Error in Profile Completion Contact Admin"})
                    }
                    else
                    {
                        res.render('Login',{msg:" Profile Updated Successfully! Please Login again"})
                    }
                })
            }
        

      }

     Patient_Profile(req,res)
      {
        if(!req.session.patient_email)
            {
                res.render('Login',{msg:"Please Login Here"})
            }
            else
            {
                const data={
                    Email:req.session.patient_email
                }
                usermodal.Fetch_Profile(data,(err,result)=>{
                            if (err)
                            {
                                res.render('Pchangepassword',{msg:" Error in While Checking"})
                            }
                            else
                            {  
                                res.render('Pprofile',{record:result}) 
                            }
                                
            })
            }
      }
}
module.exports=new Sets();