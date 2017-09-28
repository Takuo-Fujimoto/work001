import React, {Components} from 'react';
import MenuSideSlideCSS from './../../lib/css/menu_sideslide.css';

let DrawerMenu = React.createClass({
    getInitialState: function() {
        return {isOpen: false}
    },
    componentWillMount: function() {},
    componentDidMount: function() {},
    componentWillUnmount: function() {},
    toggleMenu: function() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    },
    render() {
        let containerClass = 'drawerContainer';
        if (this.state.isOpen) {
            containerClass = containerClass + ' show-drawerMenu';
        }
        let openButtonStyle = {
            left: this.props.left + 'px'
        };

        return (
            <div className={containerClass}>
                <div className='drawerMenu-wrap'>
                    <nav className='drawerMenu'>
                        <div className='drawerMenuIcon-list'>
                            <a href='#'>
                                <i className='fa fa-fw fa-star-o'></i>
                                <span>Favorites</span>
                            </a>
                            <a href='#'>
                                <i className='fa fa-fw fa-bell-o'></i>
                                <span>Alerts</span>
                            </a>
                            <a href='#'>
                                <i className='fa fa-fw fa-envelope-o'></i>
                                <span>Messages</span>
                            </a>
                            <a href='#'>
                                <i className='fa fa-fw fa-comment-o'></i>
                                <span>Comments</span>
                            </a>
                            <a href='#'>
                                <i className='fa fa-fw fa-bar-chart-o'></i>
                                <span>Analytics</span>
                            </a>
                            <a href='#'>
                                <i className='fa fa-fw fa-newspaper-o'></i>
                                <span>Reading List</span>
                            </a>
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
