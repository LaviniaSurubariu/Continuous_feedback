import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewAccount() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();




    const handleClick = async (event) => {
        event.preventDefault();

        if (role === "" || username === "" || email === "" || password === "") {

            alert('All fields are mandatory')
        }
        else {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    role
                })
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/`, options);
            const data = await response.json();

            if (data != null) {
                navigate('/login');
            } else {
                alert('Error creating account');
            }
        }
    }

    return (
        <div className='formWrapper'>
            <label htmlFor="username">Username</label>
            <input type='text' name="username" id="username" onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="email">Email</label>
            <input type='text' name="email" id="email" onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type='password' name="password" id="password" onChange={(e) => setPassword(e.target.value)} />

            <label htmlFor="role">Role</label>
            <select className='role' name="role" id="role" onChange={(e) => setRole(e.target.value)}>
                <option value=''>Select your role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>



            <input className='new' value="Submit" onClick={handleClick} />
        </div>
    )
}

export default NewAccount;
