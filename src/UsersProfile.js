import React,{Component} from 'react';
import axios from 'axios';
import './Homepage.css';
import Input from './component/input/input'

class UserProfile extends Component{
    constructor(props) {
        super();
        this.state = {


            users: [],

        };

    }
    Ping=(whom)=>{

        var data={
            To:whom,
        }
            axios.post('http://localhost:3303/addPing', data)
                .then(res => {
                    console.log(res.data);
                    if (res.data == 'Pinged') {
                        alert('You pinged' + ' ' + whom);
                        this.props.history.push('/home');
                    }
                })
                .catch((error) => {
                    console.log("Error");
                });
        }



    componentDidMount(){
        axios.get("http://localhost:3303/getusers")
            .then(res=>{


                this.setState({users:res.data});
                window.result = res.data;
                console.log(window.result);
            })
        this.props.history.push('/user-profile');

        console.log(this.props.history.location);

    }
    render(){

        return(
            <div>

                { this.props.history.location.pathname === "/user-profile" && <div className = 'SearchOutput' >
                    <div className="searchhead search" >
                        <div>Name</div>
                        <div> Ping</div>
                        <div></div>
                    </div>
                    {this.state.users.map((item, index) => {
                        console.log(item);
                        return (
                            <div className="search" >
                                <div>{item.name}</div>
                                <div>
                                <button onClick={() => this.Ping(item.name)}>
                                        Ping</button></div>


                            </div>


                        );

                    })}
                </div>
                }


            </div>

        );
    }
}
export default UserProfile;
