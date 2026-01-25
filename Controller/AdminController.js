const admin_modal=require('../Modal/Admin')
const notify_modal=require('../Modal/Notification')
class Admin
{
    Check_admin(req,res)
    {
        if(req.method=='GET')
        {
            res.render('Admin/Admin_Login')
        }
        else
        {
            const data={
                username:req.body.username,
                password:req.body.password
            }
            admin_modal.admin_login(data,(err,result)=>
            {
                if(err)
                {
                    res.render('Admin/Admin_login',{msg:"Error While Checking"})
                }
                else
                {
                    if(result.length>0)
                    {
                        const userpassword=result[0].password
                        if(data.password==userpassword)
                        {
                            req.session.admin_user=data.username
                            res.redirect('/admin/dashboard')
                        }
                        else
                        {
                            res.render('Admin/Admin_Login',{msg:"Incorrect Password",username:data.username})
                        }
                    }
                    else
                    {
                        res.render('Admin/Admin_Login',{msg:"Username Not Exists"})
                    }
                }
            })
        }
    }

    Dashboard(req,res)
    {
        if(!req.session.admin_user)
        {
            res.render('Admin/Admin_Login',{msg:"Login Here"})
        }
        else
        {
            res.render('Admin/Dashboard')
        }
    }

    Logout(req,res)
    {
        if(!req.session.admin_user)
        {
            res.render('Admin/Admin_Login',{msg:"Login Here"})
        }
        else
        {
            req.session.destroy()
            res.render('Admin/Admin_Login',{msg:"Logout Successfully"})
        }
    }
    
}

class sub_admin extends Admin
{
    notification(req,res)
    {
        if(!req.session.admin_user)
        {
            res.render('Admin/Admin_Login',{msg:"Login Here...."})
        }
        else
        {
            if(req.method=="GET")
            {
                res.render('Admin/push_notifications.ejs')
            }
            else
            {
                const data={
                    title:req.body.title,
                    message:req.body.message,
                    publishby:req.session.admin_user
                }
                notify_modal.add_notification(data,(err)=>
                {
                    if(err)
                    {
                        res.render('Admin/push_notifications',{msg:" Error Check Server"})
                    }
                    else
                    {
                        res.render('Admin/push_notifications',{msg:" Notification Added Successfully"})
                    }
                })
            }
        }
    }
}

module.exports=new sub_admin