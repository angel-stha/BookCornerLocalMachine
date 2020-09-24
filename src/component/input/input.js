import React from 'react';
import './input.css';


function Input(props){

    return(
        <input
            className={props.inputSize}
            placeholder={props.placeholder}
            type={props.type}
            onChange={props.changed}
        />
    )

}


export default Input;
