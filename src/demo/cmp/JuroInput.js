import React, {Component} from 'react';
import TextInputEffectsCSS from './../../lib/css/TextInputEffects.css';

var JuroInput = React.createClass({
    getInitialState: function() {
        return ({focus: false});
    },

    componentWillMount: function() {
        let stateObj = {};
        if (this.props.value) {
            stateObj[this.props.id] = this.props.value;
            this.setState(stateObj);
            if (this.props.onChange) {
                this.props.onChange(this.props.id, this.props.value);
            }
        }
    },

    onBlurInput: function(e) {
        this.setState({focus: false});
    },
    changeText(e) {
        var stateObject = function() {
            let returnObj = {};
            returnObj[this.target.id] = this.target.value;
            return returnObj;
        }.bind(e)();
        this.setState(stateObject);
        if (this.props.onChange) {
            this.props.onChange(e.target.id, e.target.value);
        }
    },
    onFocusInput: function() {
        this.setState({focus: true});
    },

    render: function() {
        let containerClassName = 'containerJuro';
        let contentStyle = {};
        // 文字を入力するときに、枠になる（ラベルの背景）領域のスタイル
        let fillTextWakuStyle = {};
        if (this.state.isFilled || (this.state[this.props.id] && this.state[this.props.id].trim() !== '') || (document.getElementById(this.props.id) && document.getElementById(this.props.id).value !== '')) {
            containerClassName = containerClassName + ' inputJurofilled';
            contentStyle.paddingTop = '1.5em';
            fillTextWakuStyle.borderColor = this.props.labelBackColor
                ? this.props.labelBackColor
                : '#f6ae54';
        } else {
            if (this.state.focus) {
                contentStyle.paddingTop = '1.5em';
                fillTextWakuStyle.borderColor = this.props.labelBackColor
                    ? this.props.labelBackColor
                    : '#f6ae54';
            } else {
                contentStyle.paddingTop = '1em';
            }
        }
        let labelStyle = this.props.disabled === 'disabled'
            ? {
                backgroundColor: '#f7b977'
            }
            : {
                backgroundColor: '#fff'
            };
        let inputStyle = this.props.disabled === 'disabled'
            ? {
                color: '#667c00'
            }
            : {
                color: '#1784cd'
            };

        let inputComponent;
        if (this.props.type === 'select') {
            let options = this.props.options.map(function(optionData) {
                return (
                    <option value={optionData.value}>{optionData.label}</option>
                );
            });
            inputComponent = (
                <select className='inputJuro' id={this.props.id} value={this.state[this.props.id]} disabled={this.props.disabled} onChange={this.changeText} style={inputStyle} onFocus={this.onFocusInput} onBlur={this.onBlurInput}>
                    {options}
                </select>
            )
        } else {
            inputComponent = (<input className='inputJuro' type={this.props.type} id={this.props.id} value={this.state[this.props.id]} disabled={this.props.disabled} onChange={this.changeText} style={inputStyle} onFocus={this.onFocusInput} onBlur={this.onBlurInput}/>)
        }
        return (
            <span className={containerClassName}>
                {inputComponent}
                <label className='labelJuro' htmlFor={this.props.id} style={labelStyle}>
                    <div className='labelBefore' style={fillTextWakuStyle}/>
                    <span className='contentJuro' style={contentStyle}>{this.props.label}</span>
                </label>
            </span>
        );
    }
});

export default JuroInput;
