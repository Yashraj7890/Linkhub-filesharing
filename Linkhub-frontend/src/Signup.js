
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./index.css"
import swal from 'sweetalert';
export default function Signup() {
    const [input_email, setEmail] = useState('');
    const [input_password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fill_email = (event) => {
        setEmail(event.target.value);
    }
    const fill_password = (event) => {
        setPassword(event.target.value);
    }


    const handlesubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const data = { Email: input_email, Password: input_password };
        try {
            const result = await axios.post(process.env.REACT_APP_SERVER_URL + '/signup', data, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (result.data.success) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("loggedIn");
                window.localStorage.removeItem("user");
                swal("Account created", "Your account has been successfully created now you can login to access Linkhub.", "success");
            }
            else {
                swal(result.data.message, "The email provided is already registered", "error");
            }
        }
        catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div>
                <div className='heading-main'>LinkHub<span className='cursor'></span></div>
            </div>
            <div className='subheading'>
                <div>File sharing made simple , signup to start sharing files.</div>
            </div>


            <div className='signup-box'>
                <div className='signup-box-inner'>
                    <div className='signup-box-heading'>
                        <div><i className="fa-solid fa-user-plus"></i></div>
                        <hr className='signup-box-hr'></hr>
                    </div>
                    <form onSubmit={handlesubmit}>
                        <div className="mb-3 signup-email">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={fill_email} value={input_email} required></input>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3 signup-password">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" onChange={fill_password} value={input_password} required></input>
                        </div>
                        <div className='create-account-btn'>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? <i class="fa-solid fa-spinner fa-spin"></i> : 'Sign Up'}
                            </button>
                        </div>
                        <div className='login-quicklink'>
                            <Link to="/login">Have an account?</Link>
                        </div>
                    </form>
                </div>

            </div>
        </div>

    )
}
