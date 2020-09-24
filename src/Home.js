import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import {NavLink, Route, Switch} from "react-router-dom";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import Input from "./component/input/input";

class Home extends Component {
    constructor(props) {
        super();
        this.state = {
            Search: "",
            searchItems: [],
            searchItem: {},
            commentItems: [],
            Pingedme:[]

        };
    }

    onSubmitHandler = event => {
        var data = {
            search: this.state.Search
        };
        console.log(this.state.Search);
        axios
            .get("http://localhost:3303/searchbooks", {
                params: {
                    search: this.state.Search
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({ searchItems: res.data });
            })
            .catch(error => {
                console.log("Error");
            });

        console.log(this.props.history.location);

    };
    viewComment=(title, author)=>{
        axios
            .get("http://localhost:3303/viewComment", {
                params: {
                    Title:title,
                    Author:author
                }
            })
            .then(res => {
                console.log(res.data);
                this.setState({ commentItems: res.data });
            })
            .catch(error => {
                console.log("Error");
            });

    };

    componentDidMount() {
        axios.get("http://localhost:3303/pingedme")

            .then(res=>{
                console.log(res.data);
                this.setState({Pingedme:res.data});

            })
    }
    render() {
        return (
            <div className="App">
                <br />
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="#home">Readers Corner</Navbar.Brand>
                    <Nav className="mr-auto">
                        &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;
                        <NavLink to="/book">
                            <Nav.Link href="#book">Books</Nav.Link>

                        </NavLink> &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;

                        <NavLink to="/user-profile">
                            <Nav.Link href="#usersprofile">Users</Nav.Link>
                        </NavLink> &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                        <NavLink to="/addbook">
                            <Nav.Link href="#addbook">Add New Book</Nav.Link>
                        </NavLink> &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                        <NavLink to="/my-profile">
                            <Nav.Link href="#myprofile">Profile</Nav.Link>
                        </NavLink>
                    </Nav>
                    <div className="right">
                        <Form inline>
                            <FormControl
                                placeholder="Search Books"
                                value={this.state.Search}
                                onChange={e => this.setState({ Search: e.target.value })}
                                className="mr_sm-2"
                            />

                            <Button variant="outline-light" onClick={this.onSubmitHandler}>
                                Search
                            </Button>

                        </Form>
                    </div>
                </Navbar>



                    {this.state.searchItems.map((item, index) => {
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


                // { this.props.history.location.pathname === "/search" && <div className = 'SearchOutput' >
                //
                //     {this.state.commentItems.map((item, index) => {
                //         console.log(item);
                //         return (
                //             <div className="comment" >
                //
                //                 <div>By:{item.by}</div>
                //
                //                 <div>{item.Comments}</div>
                //             </div>
                //         )
                //     })}
                // </div>
                // // }



                        );

                    })}
                <div className="left">
                    <mark> This people pinged you</mark>
                    {this.state.Pingedme.map((item, index) => {
                            console.log(item);
                            return (
                                <div >
                                    <div>{item.pingfrom} pinged you :D.</div>
                                </div>



                        )




                        }
                    )}
                    <div>You can ping other users. Go to Users!!!!</div>
                </div>

                </div>
        );
    }
}
export default withRouter(Home);
