import React, {Component} from 'react';

export default function ExcelImg(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" {...props}>

            <g>
                <polygon id={props.id} style={props.color} points="388.032,45.654 388.032,83.077 474.573,83.077 474.573,428.961 388.032,428.961 388.032,466.388
		512,466.388 512,45.654 	"></polygon>
                <rect id={props.id} style={props.color} x="388.032" y="120.5" width="49.118" height="65.398"></rect>
                <rect id={props.id} style={props.color} x="388.032" y="223.321" width="49.118" height="65.397"></rect>
                <rect id={props.id} style={props.color} x="388.032" y="326.141" width="49.118" height="65.397"></rect>
                <path id={props.id} style={props.color} d="M365.768,6.654V6.502L0,47.382V464.61l365.768,40.887v-39.11v-37.427v-37.423v-65.397v-37.423v-65.397v-37.423
		V120.5V83.077V45.654V10.511l0.015-3.857H365.768z M166.588,213.232l0.042-0.069l0.092,0.149l30.311-51.083l0.982-1.637
		l36.441-1.686l12.022-0.575l6.45-0.225l-16.835,27.792l-39.06,64.369l-3.742,6.175l3.742,6.13l38.733,63.57l10.914,17.938
		l5.917,9.891l-18.141-0.838l-19.598-0.906l-17.771-0.967l-0.054-0.091l-30.311-51.593l-7.112,11.646l-22.781,37.374l-33.647-1.526
		l-15.707-0.788l53.846-89.838l-36.913-61.571l-17.41-29.185l49.084-2.242l23.527,38.314l4.809,7.812L166.588,213.232z"></path>
            </g>
        </svg>
    )
};
