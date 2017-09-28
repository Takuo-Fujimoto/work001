import React, {Components} from 'react';
import MenuSideSlideCSS from './../../lib/css/menu_sideslide.css';
import $ from 'jquery';

let DrawerMenu = React.createClass({
    getInitialState: function() {
        return {isOpen: false}
    },
    componentWillMount: function() {},
    componentDidMount: function() {},
    componentWillUnmount: function() {},
    toggleMenu: function() {
        let menuElement = $('.drawerMenu-wrap');
        this.setState({menuWidth: menuElement.outerWidth(true)});
        this.setState({
            isOpen: !this.state.isOpen
        });
    },
    render() {

        let containerClass = 'drawerContainer';
        let drawerMenuStyle = {
            transform: 'translate3d(' + (window.innerWidth) + 'px ,0,0)'
        };
        if (this.state.isOpen) {
            containerClass = containerClass + ' show-drawerMenu';
            drawerMenuStyle.transform = 'translate3d(' + (window.innerWidth - this.state.menuWidth) + 'px ,0,0)';
        }
        let openButtonStyle = {
            left: this.props.left + 'px'
        };

        return (
            <div className={containerClass}>
                <div className='drawerMenu-wrap' style={drawerMenuStyle} >
                    <nav className='drawerMenu'>
                        <div className='drawerMenuIcon-list'>
                            {this.props.children}
                        </div>
                    </nav>
                    <button className='drawerMenuClose-button' id='close-button' onClick={this.toggleMenu}>Close Menu</button>
                </div>
                <button className='drawerMenuOpen-button' id='open-button' style={openButtonStyle} onClick={this.toggleMenu}>Open Menu</button>
            </div>
        );
    }
});
export default DrawerMenu;
