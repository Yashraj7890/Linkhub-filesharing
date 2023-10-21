
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Signup from './Signup.js'
import Login from './Login.js'
import Access from './Access';
import axios from 'axios';

function App() {
  const [loggedIn, setStatus] = useState(false);
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
        }
      } catch (error) {
        console.log(error);
      }
    };

    validate();
  }, []);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Signup />} />
        <Route exact path="/login" element={loggedIn ? <Access/> : <Login />} />
        <Route exact path="/access" element={loggedIn ? <Access/> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
