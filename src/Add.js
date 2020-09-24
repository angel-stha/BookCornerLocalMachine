 import React, { Component } from 'react'
 import axios from 'axios';
 import './App.css';
 import Input from './component/input/input';
 class Form extends Component{
     constructor(props){
         super();
         this.state ={
             Title: "",
             Author: "",
             Review:"",
             date:new Date()
         };
     }
     onSubmitHandler=(event)=>{
         var data={

             Title:this.state.Title,
             Author:this.state.Author,
             Review: this.state.Review,

         }
         console.log(data)
         axios.post('http://localhost:3303/addbook',data)
             .then(res => {
                 console.log(res.data);
                 if (res.data=="Book Already in the Stack please review there"){
                     alert("Book is already in stack please review  there")
                 }
                 else {
                     this.props.history.push('/home')
                 }
             })
             // .catch((error) => {
             //     console.log("Error");
             //     alert('error in adding');
             // });
     }
     onChange = date => this.setState({ date })
     render() {
         return (
             <div className="App body an">
                 <div className="an">
                         <h1 className="Header an">ADD BOOK</h1>

                             <Input
                                 inputSize="inputSmall"
                                 type="text"
                                 placeholder='Title'
                                 value={this.state.Title}
                                 changed={e=>this.setState({Title:e.target.value})}
                             />
                             <Input
                                 inputSize="inputSmall"
                                 type="text"
                                 placeholder='Author'
                                 value={this.state.Author}
                                 changed={e => this.setState({ Author: e.target.value })}
                             />


                         <br/>
                         <br/>
                         <button class="button2 button5"onClick={this.onSubmitHandler}>ADD</button>
                     </div>

                 </div>


         );
     }
 }

 export default Form;
