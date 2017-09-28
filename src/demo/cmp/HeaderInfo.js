import React, { Component } from 'react';
import TextInputEffectsCSS from './../../lib/css/TextInputEffects.css';
import JuroInput from './JuroInput';
import contentDefinitionData from './../data/headerData.json';

let contentDefinition = contentDefinitionData;

var HeaderInfo = React.createClass({

    getInitialState: function () {
        return ({ flag: true });
    },
    onClick: function () {
        this.setState({
            flag: !this.state.flag
        });
    },
    onChangeForChild(id, value) {
        // var stateObject = function(id, value) {
        //     let returnObj = {};
        //     returnObj[id] = value;
        //     return returnObj;
        // }(id, value);
        // this.setState(stateObject);
        if (this.props.onChange) {
            this.props.onChange(id, value);
        }
    },

    render: function () {

        var inputNodes = contentDefinition.inputs.map(function (inputData) {
            return (<JuroInput label={inputData.label} type={inputData.type} id={inputData.id}
                value={inputData.value} disabled={inputData.disabled} onChange={this.onChangeForChild} />);
        }, this);

        return (
            <div>
                {inputNodes}
            </div>
        );
    }
});

export default HeaderInfo;
