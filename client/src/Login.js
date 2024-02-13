import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setLoggedIn, setUserRole } from './store/slices/globalSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchLogin = async () => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }

            const result = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, options)
            const reponse = await result.json();

            if (reponse.success) {
                localStorage.setItem('token', reponse.data);
                dispatch(setToken(reponse.data));
                dispatch(setLoggedIn(true));
                dispatch(setUserRole(reponse.role))
                if (reponse.role === 'student') {
                    navigate('/');
                } else if (reponse.role === 'teacher') {
                    navigate('/');
                }

            }
        } catch (error) {
            setError(error);
        }
    }
    const handleNewAccount = () => {
        navigate('/newAccount');
    }

    return (
        <div className='formWrapper'>
            <label htmlFor="email">Email</label>
            <input type='text' name="email" id="email" onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type='password' name="password" id="password" onChange={(e) => setPassword(e.target.value)} />

            <input type="submit" value="Submit" onClick={(e) => fetchLogin(e)} />
            <button className='new' onClick={handleNewAccount}>New Account</button>
            {error?.length > 0 && <p>{error}</p>}
        </div>
    )
}

export default Login;