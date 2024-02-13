import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActivityIdForFeedback } from './store/slices/globalSlice';
import { useDispatch } from 'react-redux';

function Homepage() {
    const { loggedIn, userRole, activityIdForFeedback } = useSelector((state) => state.global);
    const [code, setCode] = useState('');



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const options = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const response = await fetch(`${process.env.REACT_APP_API_URL}/activities/check/${code}`, options);
        const data = await response.json();

        if (data.success && data.message === "Activity found") {
            dispatch(setActivityIdForFeedback(data.data.id))
            navigate('/reactions');

        }
        else if (data.message === 'Error Activity is not in progress.') {
            alert('Activity is not in progress!');
        } else {
            alert('Activity not found!');
        }
    };

    const handleAccesare = async (event) => {
        event.preventDefault();
        const options = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        navigate('/activities');

    };


    if (!loggedIn) {
        return <div className='home'>Homepage</div>;
    } else if (userRole === 'student') {
        return (

            <div className="center-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="code" className="my-label">Enter the access key:</label>
                    <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button type="submit" className="my-button">Join</button>
                </form>
            </div>

        );
    } else if (userRole === 'teacher') {
        return (
            <div className="center-container">
                <form onSubmit={handleAccesare}>
                    <button type="submit" className="my-button">View your activities</button>
                </form>
            </div>
        )
    }
}

export default Homepage;
