import React,{Component} from 'react';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import Input from './component/input/input';
import './MyProfile.css'
import { withRouter } from "react-router-dom";

class MyProfile extends Component{
    constructor(props) {
        super();
        this.state = {


            items: [],
            Reviewed: [],
            name :'',
            NewReview:'',
            date:new Date(),
            Ipinged:[]
        };

    }
    DeleteReview=(title,review,date)=>{
        var data= {
            Review: review,
            Title: title,
            Date: date,
        }
            axios.post('http://localhost:3303/DeleteReview', data)
                .then(res => {
                    if (res.data == 'Review Deleted') {
                        alert('Review deleted on' + ' '  + title);
                         this.props.history.push('/book');
                    }
                })
                .catch((error) => {
                    console.log("Error");
                });
        }

    EditReview=(title, review,newreview,date)=>{
    var data= {
        Review: review,
        Title: title,
        NewReview: newreview,
        date: date,
    }
         axios
            .post("http://localhost:3303/EditReview", data)

            .then(res => {
                if (res.data == 'Review Edited')
                    this.props.history.push('/book');


            })
             .catch((error) => {
                 console.log("Error");
             });
            }



    Logout=(e)=>{
        localStorage.clear();
        window.location.reload();
    }

    componentDidMount() {

        axios.post("http://localhost:3303/getmydata",)
            .then(res => {
                console.log(res.data);
                console.log("Nirva")
                this.setState({items: res.data});
                console.log(this.state.items);
            })
        axios.get("http://localhost:3303/getrevieweddata")

            .then(res=>{
                console.log(res.data);
                this.setState({Reviewed:res.data});

            })

    axios.get("http://localhost:3303/ipinged")

         .then(res=>{
               console.log(res.data);
               this.setState({Ipinged:res.data});

})
}


    onChange = date => this.setState({ date })

    render(){

        return(
            <div className="an">

                <div className="name"> Name:&nbsp;&nbsp;{ this.state.items}</div>
                <br/>
                <br/>
                <div className="searchhead search" >
                    <div>Title</div>
                    <div> Your Comments</div>
                    <div>Date</div>
                    <div>Delete</div>
                    <div>Modify</div>

                </div>
                {this.state.Reviewed.map((item, index) => {
                    console.log(item);
                        return (
                            <div className="search" >
                                <div>{item.bookname}</div>
                                <div>{item.review}</div>
                                <div>{item.date}</div>
                                <div>
                                    <button onClick={() => this.DeleteReview(item.bookname, item.review,item.date)}>
                                        Delete Review</button>
                                </div>
                                <div>
                                        <Input
                                            inputSize="inputSmall"
                                            type="text"
                                            placeholder='Edit Review'
                                            value={this.state.NewReview}
                                            changed={e => this.setState({ NewReview: e.target.value })}
                                        />
                                        &nbsp; &nbsp;&nbsp;

                                    <button onClick={() => this.EditReview(item.bookname, item.review,this.state.NewReview,this.state.date)}>
                                        Edit</button>

                                </div>

                            </div>
                        )
                    }
                )}


                <br/>
                <br/>
               
                <br/>
                <br/>
                <button className="button5" onClick={this.Logout}>Logout</button>
                <div className="left">
                    {this.state.Ipinged.map((item, index) => {
                            console.log(item);
                            return (
                                <div className="search" >
                                    <div>You pinged {item.pingto} :D.</div>




                                </div>
                            )
                        }
                    )}
                </div>

            </div>




        )
    }
}
export default withRouter(MyProfile);
