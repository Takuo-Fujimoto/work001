import React, {Component} from 'react';

export default function CheckSimple(props) {
    return (

        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" {...props}>
            <g>
                <polygon id={props.id} style={props.color} points="440.469,73.413 218.357,295.525 71.531,148.709 0,220.229 146.826,367.055 218.357,438.587
		289.878,367.055 512,144.945 	"></polygon>
            </g>
        </svg>

    );
}
