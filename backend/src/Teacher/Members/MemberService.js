const db = require("../../database/db")

const formatDateTimeForFullDetail = (date) => {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
}

const CreateMemberService = async (memberData) => {
    
    try {
        
        const {class_id, members} = memberData

        for (const student_id of members) {
            await db.query(
                `INSERT INTO class_students (class_id, student_id) VALUES (?, ?)`,
                [class_id, student_id.student_id]
            )
        }

        return {
            error: false,                        
        };

    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }
}

const GetMemberService = async (class_id) => {

    try {        
        const [ result ] = await db.query(
            `
                SELECT 
                    class_students.*,
                    students.student_id,
                    students.student_string_id,
                    CONCAT(students.last_name, ", ", students.first_name, " ",students.middle_name) AS fullname,
                    students.email_address
                FROM class_students
                LEFT JOIN students ON students.student_id = class_students.student_id
                WHERE class_students.class_id = ?
            `,
            [class_id]
        )
      
        
        if (!result.length) {
            return {
                error: false, 
                data: []
            }
        }
        result.forEach(member => {
            const createdTime = new Date(member.created_time);
            member.created_time = formatDateTimeForFullDetail(createdTime);
        });
        return {
            error: false, 
            data: result
        };

    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }
}

const RemoveMemberService = async (memberData) => {
    try {
        const {class_id, members} = memberData

        for (const member of members ) {
            await db.query(
                `DELETE FROM class_students WHERE class_id = ? AND student_id = ?`,
                [class_id, member.student_id]
            )
        }
        return {
            error: false,                        
        };

    } catch (error) {
        console.error(error);
        return {
            error: true
        }            
    }
}

module.exports = {
    CreateMemberService,
    GetMemberService,
    RemoveMemberService
}