const db = require('../Database/myconnect')

const EyeDonation = {

    Insert_Donor: (data, callback) => {

        const q = `

INSERT INTO eye_donation
(
donor_name,
email,
mobile,
age,
blood_group,
address,
emergency_contact,
consent
)

VALUES
(
'${data.Name}',
'${data.Email}',
'${data.Mobile}',
'${data.Age}',
'${data.BloodGroup}',
'${data.Address}',
'${data.Emergency}',
'yes'
)

`

        db.query(q, callback)

    },

    Fetch_Donors: (callback) => {

        const q = `

SELECT *

FROM eye_donation

ORDER BY created_at DESC

`

        db.query(q, callback)

    },

    Approve_Donor: (data, callback) => {

        const q = `

UPDATE eye_donation

SET status='approved'

WHERE id='${data.Id}'

`

        db.query(q, callback)

    },

    Reject_Donor: (data, callback) => {

        const q = `

UPDATE eye_donation

SET status='rejected'

WHERE id='${data.Id}'

`

        db.query(q, callback)

    },

    Delete_Donor: (data, callback) => {

        const q = `

DELETE FROM eye_donation

WHERE id='${data.Id}'

`

        db.query(q, callback)

    }

}

module.exports = EyeDonation