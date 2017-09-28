import React, {Component} from 'react';

export default function CheckSquare(props) {
    return (

        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" {...props}>
<g>
	<polygon id={props.id} style={props.color}  points="335.644,414.285 53.466,414.285 53.466,132.107 291.098,132.107 344.564,78.64 0,78.64 0,467.751
		389.106,467.751 389.106,441.018 389.106,323.746 335.644,377.213 	" ></polygon>
	<polygon id={props.id} style={props.color}  points="158.903,163.312 103.914,218.311 193.434,307.822 248.423,362.82 303.412,307.822 512,99.247
		457.002,44.249 248.431,252.823 	" ></polygon>
</g>
</svg>

    );
}
