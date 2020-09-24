import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Form from './Add';
import Home from './Home';
import Books from './Book'
import MyProfile from "./MyProfile";
import UserProfile from "./UsersProfile";
import './Homepage.css';
import axios from 'axios';
import Signup from "./Signup";

function App() {
    var user = localStorage.getItem("usertype")
    var token = localStorage.getItem("token")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

         if (user === "loggedin") {
            return (
                <Router>
                    <div>

                        <Login/>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/login' component={Login}/>
                            <Route path='/book' component={Books}/>
                            <Route path='/addbook' component={Form}/>
                            <Route path='/my-profile' component={MyProfile}/>
                            <Route path='/user-profile' component={UserProfile}/>
                        </Switch>

                    </div>
                </Router>


        )
    }
    else {
            return (
                <div className="s">
                    <Login/>
                </div>
            )
        }
}

export default App;
