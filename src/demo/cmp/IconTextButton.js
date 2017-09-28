import React, {Components} from 'react';
import buttonCSS from './../../lib/css/iconTextButtons.css';
import iconFontCSS from './../../lib/css/vicons-font.css';

let IconTextButton = React.createClass({
    getInitialState: function() {
        return ({});
    },

    onClick: function() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    },
    render: function() {
        let iconClass = 'button__icon icon icon-' + this.props.icon;
        return (
            <button className='button button--shikoba button--round-s button--border-thin' onClick={this.onClick}>
                <i className={iconClass}></i>
                <span>{this.props.text}</span>
            </button>
        );
    }
});

export default IconTextButton;
