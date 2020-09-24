import React,{Component} from 'react';
import axios from 'axios';
import './Homepage.css';
import Input from './component/input/input';
import { Redirect } from 'react-router';

class Books extends Component{
    constructor(props) {
        super();
        this.state = {


            bookitems: [],
            reviewitems: [],
            Review:"",
            date:new Date()

        };

    }


    AddReview=(title, author,comment,date)=>{
        var data={
            Review:comment,
            Title:title,
            Author:author,
            Date:date,
        }
        if (comment ==" "){
            alert("Empty review!! not valid")
            this.props.history.push('/book');

        }
        else {
            axios.post('http://localhost:3303/addReview', data)
                .then(res => {
                    console.log(comment);
                    console.log(res.data);
                    if (res.data == 'Comment Added') {
                        alert('Review added on' + ' ' + 'book' + ' ' + title);
                        this.props.history.push('/book');
                    }
                })
                .catch((error) => {
                    console.log("Error");
                });
        }
    }
    ViewReview=(title, author)=>{
        axios
            .get("http://localhost:3303/viewReview", {
                params: {
                    Title:title
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({ reviewitems: res.data });
            })
            .catch(error => {
                console.log("Error");
            });

    };


    componentDidMount(){
        axios.get("http://localhost:3303/getbook")
            .then(res=>{


                this.setState({bookitems:res.data});
                window.result = res.data;
                console.log(window.result);
            })
        this.props.history.push('/book');

        console.log(this.props.history.location);

    }
    onChange = date => this.setState({ date })
    render(

    ){


        return(
            <div>

                { this.props.history.location.pathname === "/book" && <div className = 'SearchOutput' >
                    <div className="searchhead search" >
                        <div>Title</div>
                        <div>Author</div>
                        <div> Add Comments</div>
                        <div> Review Comments</div>
                        <div></div>
                    </div>
                    {this.state.bookitems.map((item, index) => {
                        console.log(item);
                        return (
                            <div className="search" >
                                <div>{item.bookname}</div>
                                <div>{item.author}</div>
                                <div>
                                    <Input
                                        inputSize="inputSmall"
                                        type="text"
                                        placeholder='Review'
                                        value={this.state.Review}
                                        changed={e => this.setState({ Review: e.target.value })}
                                    />
                                      <br/>&nbsp;&nbsp;&nbsp;


                                    <button onClick={() => this.AddReview(item.bookname, item.author,this.state.Review,this.state.date)}>
                                    Add Review</button></div>
                                <div>


                                    <button onClick={() => this.ViewReview(item.bookname, item.author,)}>
                                        View Review</button></div>


                            </div>


                        );

                    })}
                </div>
                }
                { this.props.history.location.pathname === "/book" && <div className = 'comment '>

                    {this.state.reviewitems.map((item, index) => {
                        console.log(item);
                        return (
                            <div className="shift"  >
                                {item.byuser}: {item.review}

                                </div>

                        )
                    })}
                </div>
                }

            </div>

        );
    }
}
export default Books;
