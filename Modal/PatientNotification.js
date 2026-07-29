const db = require('../Database/myconnect')

const PatientNotification =
{
    Add_Notification: (data, callback) => {
        const q = `

        INSERT INTO patient_notifications
        (
            patient_email,
            title,
            message,
            type
        )

        VALUES
        (
            '${data.Patient_Email}',
            '${data.Title}',
            '${data.Message}',
            '${data.Type}'
        )

        `

        db.query(q, callback)
    },

    Fetch_Notifications: (data, callback) => {

        const q = `

SELECT *

FROM patient_notifications

WHERE patient_email='${data.Email}'
AND archive_status='active'

ORDER BY created_at DESC

`

        db.query(q, callback)

    },

    Fetch_Archived_Notifications: (data, callback) => {

        const q = `

        SELECT *

        FROM patient_notifications

        WHERE patient_email='${data.Email}'

        AND archive_status='archived'

        ORDER BY created_at DESC

        `

        db.query(q, callback)

    },

    Archive_Old_Notifications: (callback) => {

        const q = `

UPDATE patient_notifications

SET archive_status='archived'

WHERE is_read='yes'

AND archive_status='active'

AND created_at < NOW() - INTERVAL 1 DAY

`

        db.query(q, callback)

    },

    Count_Unread: (data, callback) => {
        const q = `

        SELECT COUNT(*) AS total

        FROM patient_notifications

        WHERE patient_email='${data.Email}'

        AND is_read='no'

        AND archive_status='active'

        `

        db.query(q, callback)
    },

    Mark_Read: (data, callback) => {
        const q = `

        UPDATE patient_notifications

        SET is_read='yes'

        WHERE patient_email='${data.Email}'

        `

        db.query(q, callback)
    },

    Create_Notification: (data, callback) => {

        const q = `

INSERT INTO patient_notifications
(

patient_email,

title,

message,

type,

action_url,

is_read,

archive_status

)

VALUES
(

'${data.Email}',

'${data.Title}',

'${data.Message}',

'${data.Type || "general"}',

'${data.Action_Url || ""}',

'no',

'active'


)

`

        db.query(q, callback)

    },

    Archive_Notification: (data, callback) => {

        const q = `

UPDATE patient_notifications

SET archive_status='archived'

WHERE id='${data.Id}'

`

        db.query(q, callback)

    },

}

module.exports = PatientNotification