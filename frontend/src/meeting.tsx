import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import necessary hooks
import { Authentication } from './Auth/Authentication';

const MeetingPage = () => {
    const { getID, getRole } = Authentication()
    const navigate = useNavigate();
    const { class_id, meeting_name } = useParams();
    
    
    useEffect(() => {
        // Redirect based on user role        
        const meet_name = decodeURIComponent(meeting_name || "");
        if (getRole() === 'Teacher') {
                        
            localStorage.setItem('meetingName', meet_name || "");
            localStorage.setItem('classId', class_id || "");
            window.open(`/teacher/${getID()}/class/${class_id}/meeting`, '_blank');
            navigate(-1)
                    
        } else if (getRole() === 'Student') {                        
            localStorage.setItem('meetingName', meet_name || "");
            localStorage.setItem('classId', class_id || "");            
            window.open(`/student/${getID()}/class/${class_id}/meeting`, '_blank');
            navigate(-1)
        }
    }, [getRole(), navigate, class_id, meeting_name]);

    return null; // No need to render anything as you are redirecting
};

export default MeetingPage;
