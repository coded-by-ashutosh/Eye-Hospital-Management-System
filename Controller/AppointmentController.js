const appointmentModel = require('../Modal/Appointment')
class AppointmentController {

    Add_Appointment(req,res) {
          
               const  data={
                    Name:req.body.name,
                    Email:req.body.email,
                    Phone:req.body.phone,
                    Date:req.body.date,
                    Time:req.body.time,
                    address:req.body.address
                }
                appointmentModel.create(data,(err)=>{
                    if(err){
                        res.render('Home',{mesg:" Error in Booking Appointment"})
                    }
                    else{
                        res.render('Home',{mesg:data.Name+" Appointment Booked Successfully"})
                    }
                })
                    
            }

    get_records(req,res) 
    {
        const data={
            Email:req.session.patient_email
        }
         if(!req.session.patient_email)
            {
                res.render('Login',{msg:"Please Login Here"})
            }
            else
            {
                appointmentModel.list_appointment_search(data,(err,result)=>
                {
                    if(err)
                    {
                        res.render('PAppointment_List',{msg:"Error While Fetching Contact Admin"})
                    }
                    else
                    {
                        if(result.length>0)
                        {
                           res.render('PAppointment_List',{datas:result})
                        }
                        else
                        {
                           res.render('PAppointment_List',{msg:"Not Any Appointment Exists Releated To This Account"})
                        }
                    }
                    
                })
            }
    }
    
}


module.exports=new AppointmentController()