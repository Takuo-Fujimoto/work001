import React, {Component} from 'react';

export default function plantImg(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" {...props}>
            <g>
                <path id={props.id} style={props.color} d="M328.594,42.031v95.844L164.297,42.031v95.844L0,42.031v427.938h164.297h19.109h145.188h19.109H512V149.016
		L328.594,42.031z M205.813,324.25h-68.266V256h68.266V324.25z M374.453,324.25h-68.266V256h68.266V324.25z"></path>
            </g>
        </svg>
    )
};
