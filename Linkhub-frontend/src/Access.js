import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Signup from './Signup.js';
import Login from './Login.js';
import Linkhub from './Linkhub.js';
import swal from 'sweetalert';


const Access = () => {

  const [status, setStatus] = useState(false);

  useEffect(() => {

    const validate = async () => {
      try {
        let data = ({ tkn: window.localStorage.getItem("token") });

        let result = await axios.post('https://linkhub-server.onrender.com/authenticate', data);
        if (result.data.success) {
          setStatus(true);
        }
        else {
          setStatus(false);
          window.localStorage.clear();
          window.location.href = "./login";
        }
      } catch (error) {
        console.log(error);
      }
    };

    validate();
  }, []);

  return (
    <div>
      {status ? (
        <Linkhub />
      ) :
        (
          <div className='loading-screen'>
            <div >
              <div className='load-icon-box'><i className="fa-solid fa-spinner fa-spin-pulse"></i></div>
              <div className='load-txt'>Please wait..</div>
            </div>
          </div>
        )}
    </div>
  )
}
export default Access;