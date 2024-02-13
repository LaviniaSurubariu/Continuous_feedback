import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setActivityIdForFeedback } from './store/slices/globalSlice';
import { useNavigate } from 'react-router-dom'
import { setActivities, deleteActivity } from './store/slices/activitySlice';
import { setChartData } from './store/slices/globalSlice';
import Modal from 'react-modal';

export default function Activity() {
    const [error, setError] = useState('');
    const token = useSelector((state) => state.global.token);
    const activities = useSelector((state) => state.activity.activities);
    const { chartData } = useSelector((state) => state.global);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [time, setTime] = useState('');



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    function validateInputs() {

        if (!date || !time || !duration) {
            alert('Date time and duration are mandatory');
            return false;
        }


        const durationPattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!durationPattern.test(duration)) {
            alert('The format of the duration must be HH:mm!');
            return false;
        }

        return true;
    }


    const handleAddActivity = async (event) => {
        event.preventDefault();
        if (validateInputs()) {

            let dbDate = date + " " + time + ":00" + " +02:00"
            let dbDuration = duration + ":00"

            event.preventDefault();

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    date: dbDate,
                    duration: dbDuration,
                    description: description
                })
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/activities/`, options);
            const data = await response.json();

            if (data.success) {
                getActivities()
            } else {
                alert('Error creating activity');
            }

            closeModal();
            setDate("");
            setTime("");
            setDuration("");
            setDescription("");

        }
    }

    const getActivities = () => {
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        fetch(`${process.env.REACT_APP_API_URL}/activities/user`, options)
            .then(res => res.json())
            .then(res => {
                dispatch(setActivities(res.data));
            })
            .catch((err) => setError(err));
    }

    const handleDeleteActivity = (id) => {
        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        fetch(`${process.env.REACT_APP_API_URL}/activities/${id}`, options)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    dispatch(deleteActivity(id));
                }
            })
            .catch((err) => setError(err));
    }

    const handleRowClick = async (id) => {
        const options = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const response = await fetch(`${process.env.REACT_APP_API_URL}/activities/${id}/feedbacks`, options);
        const data = await response.json();

        if (data.success && data.message === "Activities list for user") {
            dispatch(setChartData(data.data))
            navigate('/analytics');
        } else {
            alert('Activity not found!');
        }
    }

    useEffect(() => {
        getActivities();

    }, [activities])

    return (
        <>



            <div className='activitiesWrapper'>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add activity"
                    style={{ content: { width: '30%', height: '50%', margin: 'auto' } }}
                >
                    <h2>Add an activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'none', alignItems: 'left' }}>
                        <label>
                            Description:
                            <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Duration:
                            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} />
                        </label>

                        <br />
                        <label>
                            Date:
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </label>
                        <br />
                        <br />
                        <label>
                            Time:
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </label>
                        <br />
                        <button onClick={handleAddActivity}>Add</button>
                    </div>
                </Modal>

                <div className="header">
                    <div className="header-content" >
                        <button className="addButton" onClick={openModal}>+</button>
                    </div>
                </div>
                <table id="activities">

                    <tr>
                        <th>Key</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Delete</th>
                    </tr>
                    {activities?.map(activity => (
                        <tr key={activity.id} onClick={(e) => { e.stopPropagation(); handleRowClick(activity.id) }}>
                            <td>{activity.id}</td>
                            <td>{activity.description}</td>
                            <td>{activity.date}</td>
                            <td>{activity.duration}</td>
                            <td className='tableIcon' onClick={(e) => { e.stopPropagation(); handleDeleteActivity(activity.id); }}>X</td>
                        </tr>
                    ))}
                </table>
            </div>
        </>
    )
}
