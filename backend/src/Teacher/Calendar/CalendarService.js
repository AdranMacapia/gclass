const db = require("../../database/db")
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'jobportal@resiboph.site',
        pass: '9@omljoYWV'
    }
});


const CreateMeetingService = async (meetingData) => {

    try {
        const {class_id, title, start_date} = meetingData
        const link = `http://localhost:5173/meeting/${class_id}/${encodeURIComponent(title)}`
        const [result] = await db.query(
            `
            INSERT INTO class_meetings (class_id, title, link, start_date)
            VALUES (?, ?, ?, ?)`,
            [class_id, title, link, start_date]
        )

        if (!result.affectedRows) {
            return { 
                error: false,
                succesfull: false,
                data: []
            };
        }

        const [getStudentsResult] = await db.query(
            `SELECT students.email_address FROM students 
            LEFT JOIN class_students ON class_students.student_id = students.student_id
            WHERE class_students.class_id = ?`,
            [class_id]
        )
        
        const emailAddresses = getStudentsResult.map(student => student.email_address).join(',');
        
        const mailOptions = {
            from: 'jobportal@resiboph.site',
            to: emailAddresses,
            subject: "Meeting now",
            html: `<h4 className='text-sm'>
            🚨 <strong>Meeting now!</strong><br />
            <strong>${title}</strong><br />
            Don't forget, we've got a meeting today! Click the link below to join:<br />
            👉 <a href=${link} target="_blank" rel="noopener noreferrer">Join Meeting</a><br />
            See you there!
            </h4>`,            
        };
        
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent to all students');
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    
        return {
            error: false,
            succesfull: true,
            data: []
        };
    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }
}

const EditMeetingService = async (meetingData) => {

    try {
        const {start_date, class_meeting_id, class_id} = meetingData
        const [result] = await db.query(
            `
            UPDATE class_meetings SET start_date = ? WHERE class_meeting_id = ?`,
            [start_date, class_meeting_id]
        )

        if (!result.affectedRows) {
            return { 
                error: false,
                succesfull: false,
                data: []
            };
        }

        const [getStudentsResult] = await db.query(
            `SELECT students.email_address FROM students 
            LEFT JOIN class_students ON class_students.student_id = students.student_id
            WHERE class_students.class_id = ?`,
            [class_id]
        )
        
        const emailAddresses = getStudentsResult.map(student => student.email_address).join(',');
        
        const mailOptions = {
            from: 'jobportal@resiboph.site',
            to: emailAddresses,
            subject: "Meeting now",
            html: `<h4 className='text-sm'>
            🚨 <strong>Meeting now!</strong><br />
            <strong>${title}</strong><br />
            Don't forget, we've got a meeting today! Click the link below to join:<br />
            👉 <a href=${link} target="_blank" rel="noopener noreferrer">Join Meeting</a><br />
            See you there!
            </h4>`,            
        };
        
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent to all students');
        } catch (error) {
            console.error('Failed to send email:', error);
        }

        
    
        return {
            error: false,
            succesfull: true,
            data: []
        };
    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }
}

const RemoveMeetingService = async (class_meeting_id) => {

    try {

        const [result] = await db.query(
            `DELETE FROM class_meetings WHERE class_meeting_id = ?`,
            [class_meeting_id]
        )

        if (!result.affectedRows) {
            return { 
                error: false,
                succesfull: false,
                data: []
            };
        }
    
        return {
            error: false,
            succesfull: true,
            data: []
        };
    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }

}

const GetMeetingsService = async (teacher_id) => {
    try {

        const [result] = await db.query(
            `SELECT cm.* FROM class_meetings cm JOIN class c ON cm.class_id = c.class_id WHERE c.teacher_id = ?`,
            [teacher_id]
        )

        if (!result.length) {
            return { 
                error: false,
                succesfull: false,
                data: []
            };
        }

        const res = result.map((meeting) => {
            
            const dateObject = new Date(meeting.start_date);
                    
            const dayName = dateObject.toLocaleString('en-US', { weekday: 'short' }); 
            const monthName = dateObject.toLocaleString('en-US', { month: 'short' }); 
            const day = String(dateObject.getDate()).padStart(2, '0'); 
            const year = dateObject.getFullYear(); 
                    
            const hours = String(dateObject.getHours()).padStart(2, '0'); 
            const minutes = String(dateObject.getMinutes()).padStart(2, '0'); 
                                
            const formattedDate = `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:00 ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
                    
            meeting.date = formattedDate; 
            meeting.time = `${hours}:${minutes}`; 
        
            return meeting; 
        });
        

        console.log(res);
        
        return {
            error: false,
            succesfull: true,
            data: res
        };
    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }
}

module.exports = {    
    CreateMeetingService,
    EditMeetingService,
    RemoveMeetingService,
    GetMeetingsService
}