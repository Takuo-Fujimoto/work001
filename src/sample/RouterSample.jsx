import React from 'react'
import {Link} from 'react-router'
import NavLink from './NavLink'
import Home from './Home'
import { IndexLink } from 'react-router'


export default React.createClass({
    render() {
        return (
            <div>
                <h1>React Router Tutorial</h1>
                <ul role="nav">
                    <li><NavLink to="/" activeClassName="active" onlyActiveOnIndex={true}>Home</NavLink></li>
                    <li><IndexLink to="/" activeClassName="active">Home IndexLink</IndexLink></li>
                    <li>
                        <Link to="/about" activeStyle={{
                            color: 'red'
                        }}>About</Link>
                    </li>
                    <li>
                        <Link to="/repos" activeStyle={{
                            color: 'red'
                        }}>Repos</Link>
                    </li>
                    <li>
                        <NavLink to="/about/M001">About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/repos">Repos</NavLink>
                    </li>
                </ul>

                {/* add this */}
                {this.props.children || <Home/>}
            </div>
        )
    }
})
