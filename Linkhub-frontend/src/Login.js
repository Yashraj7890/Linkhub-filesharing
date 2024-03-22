import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Access from './Access';
import swal from 'sweetalert';

function Login() {
  const [input_email, setEmail] = useState('');
  const [input_password, setPassword] = useState('');

  const fill_email = (event) => {
    setEmail(event.target.value);
  }
  const fill_password = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { Email: input_email, Password: input_password };
    try {
      const result = await axios.post(process.env.REACT_APP_SERVER_URL+'/login', data, {
        headers: { 'Content-Type': 'application/json' }
      });



      if (result.data.success) {
        window.localStorage.setItem("token", result.data.tkn);
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("user", input_email);
        window.location.href = "./access";
      }
      else {
        if (result.data.message === "wp") {
          swal('Invalid password.', "The password you've provided does not match.", "warning");
        }
        else {
          swal('No such email registered', "The email address you,ve provided is completely new to us.", "info");
        }

      }

    }
    catch (err) {
      console.log(err);
    }
  }
  return (

    <div className='login-box'>
      <div>
        <div className='heading-main'>LinkHub<span className='cursor'></span></div>
      </div>
      <div className='subheading'>
        <div>Login to access linkhub and start sharing.</div>
      </div>
      <div className='login-box-inner'>
        <div className='login-heading'>
          <div><i className="fa-solid fa-right-to-bracket"></i></div></div>
        <hr className='signup-box-hr'></hr>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 signup-email">
            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={fill_email} value={input_email} required></input>
          </div>
          <div className="mb-3 signup-password">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" onChange={fill_password} value={input_password} required></input>
          </div>
          <div className='login-btn-box'><button type="submit" className="btn btn-success">LogIn</button></div>
          <div className='sigunp-quick-link'><Link to="/">Don't have an account?</Link></div>

        </form>
      </div>


    </div>
  );
}

export default Login;