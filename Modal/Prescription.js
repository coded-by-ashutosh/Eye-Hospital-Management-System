const db = require('../Database/myconnect')

const Prescription =
{
    Save_Prescription: (data, callback) => {
        const q = `

        insert into prescription
        (
            appointment_id,
            doctor_id,
            patient_email,
            symptoms,
            diagnosis,
            medicines,
            advice,
            next_visit_date
        )

        values
        (
            '${data.Appointment_Id}',
            '${data.Doctor_Id}',
            '${data.Patient_Email}',
            '${data.Symptoms}',
            '${data.Diagnosis}',
            '${data.Medicines}',
            '${data.Advice}',
            '${data.Next_Visit_Date}'
        )

        `

        db.query(q, callback)
    },

    Fetch_Patient_Prescriptions: (data, callback) => {

        const q = `

    select prescription.*,
    doctors.doctor_name,
    appointment.preferred_date,
    appointment.status

    from prescription

    LEFT JOIN doctors
    ON prescription.doctor_id = doctors.id

    LEFT JOIN appointment
    ON prescription.appointment_id = appointment.id

    where prescription.patient_email='${data.Email}'

    order by prescription.created_at desc

    `

        db.query(q, callback)
    },

    Fetch_Prescription_By_Id: (data, callback) => {

        const q = `

    select prescription.*,
    doctors.doctor_name,
    doctors.speciality,
    doctors.doctor_signature,
    appointment.preferred_date

    from prescription

    LEFT JOIN doctors
    ON prescription.doctor_id = doctors.id

    LEFT JOIN appointment
    ON prescription.appointment_id = appointment.id

    where prescription.id='${data.Id}'

    `

        db.query(q, callback)
    },

    Medical_History: (data, callback) => {
        const q = `

    SELECT

    appointment.id,
    appointment.preferred_date,
    appointment.issue,
    appointment.status,

    doctors.doctor_name,
    doctors.speciality,

    prescription.next_visit_date,
    prescription.diagnosis

    FROM appointment

    LEFT JOIN doctors
    ON appointment.doctor_id=doctors.id

    LEFT JOIN prescription
    ON appointment.id=prescription.appointment_id

    WHERE appointment.email='${data.Email}'

    ORDER BY appointment.preferred_date DESC

    `

        db.query(q, callback)
    },

    Doctor_Prescription_History: (data, callback) => {
        const q = `

    SELECT

    prescription.*,

    appointment.name,
    appointment.preferred_date,
    appointment.status,

    doctors.doctor_name

    FROM prescription

    LEFT JOIN appointment
    ON prescription.appointment_id=appointment.id

    LEFT JOIN doctors
    ON prescription.doctor_id=doctors.id

    WHERE prescription.doctor_id='${data.Doctor_Id}'

    ORDER BY prescription.id DESC

    `

        db.query(q, callback)
    },

    Patient_Timeline: (data, callback) => {

        const q = `

    SELECT

    appointment.id,
    appointment.preferred_date,
    appointment.issue,
    appointment.status,

    prescription.id as prescription_id,
    prescription.next_visit_date

    FROM appointment

    LEFT JOIN prescription
    ON appointment.id = prescription.appointment_id

     WHERE appointment.email='${data.Email}'

    AND appointment.doctor_id='${data.Doctor_Id}'

    ORDER BY appointment.preferred_date DESC

    `

        db.query(q, callback)
    },
}

module.exports = Prescription