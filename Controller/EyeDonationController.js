const EyeDonation = require('../Modal/EyeDonation')

class EyeDonationController {

    Eye_Donation(req, res) {

        if (req.method == 'GET') {

            res.render('Eye_Donation')

        }

        else {

            const data = {

                Name: req.body.name,

                Email: req.body.email,

                Mobile: req.body.mobile,

                Age: req.body.age,

                BloodGroup: req.body.blood_group,

                Address: req.body.address,

                Emergency: req.body.emergency_contact

            }

            EyeDonation.Insert_Donor(

                data,

                (err) => {

                    if (err) {

                        console.log(err)

                        return res.render(
                            'Eye_Donation',
                            {
                                msg: "Error While Registration"
                            })

                    }

                    res.render(
                        'Eye_Donation',
                        {
                            msg: "Eye Donation Pledge Registered Successfully ❤️"
                        })

                })

        }

    }

}

module.exports = new EyeDonationController()