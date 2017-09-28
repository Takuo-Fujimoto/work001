import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom'
import CountContainer from './Counter.jsx';
import App from './App.jsx';
import './index.css';
import {
    Router,
    Route,
    IndexRoute,
    Link,
    IndexLink,
    browserHistory
} from 'react-router';

var IndexObj = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

var Top = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    handleSubmit: function(e) {
        e.preventDefault();
        /* ログイン処理 */

        //ポータルページへ
        // this.history.pushState(null, '/portal');
        const userName = e.target.elements[0].value
        const repo = e.target.elements[1].value
        this.context.router.push('/portal')
    },
    render: function() {
        return (
            <div>
                <div className="main">
                    <h1>ログイン</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input placeholder="userid"/>
                        <input placeholder="password"/>
                        <div style={{
                            textAlign: "center"
                        }}>
                            <button type="submit">ログイン</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

var Main = React.createClass({
    render: function() {
        return (
            <div>
                <div className="main">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

var Routes = (
    <Router history={browserHistory}>
        <Route path="/" component={IndexObj}>
            <IndexRoute component={Top}/>
            <Route path="/top" component={Top}/>
            <Route path="/portal" component={Main}>
                <IndexRoute component={CountContainer}/>
                <Route path="/userbox" component={App}/>
            </Route>
        </Route>
    </Router>
);
render(Routes, document.getElementById('root'));

// sample03 -----------------------------------------------------------------------

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Home</h1>
                <ul>
                    <li>
                        <Link to="/foo/">Foo</Link>
                    </li>
                    <li>
                        <Link to="/bar/">Bar</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

class Foo extends React.Component {
    render() {
        return (
            <div>
                <h2>Foo!</h2>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/bar/">Bar</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

class Bar extends React.Component {
    render() {
        return (
            <div>
                <h2>Bar!</h2>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/foo/">Foo</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

var router = (
    <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/foo/" component={Foo}/>
        <Route path="/bar/" component={Bar}/>
    </Router>
);
//
// render(router, document.getElementById('root'));

// sample02--------------------------------------------

const ACTIVE = {
    color: 'red'
}

const AppXX = ({children}) => (
    <div>
        <h1>APP!</h1>
        <ul>
            <li>
                <Link to="/" activeStyle={ACTIVE}>/</Link>
            </li>
            <li>
                <IndexLink to="/" activeStyle={ACTIVE}>/ IndexLink</IndexLink>
            </li>

            <li>
                <Link to="/users" activeStyle={ACTIVE}>/users</Link>
            </li>
            <li>
                <IndexLink to="/users" activeStyle={ACTIVE}>/users IndexLink</IndexLink>
            </li>

            <li>
                <Link to="/users/ryan" activeStyle={ACTIVE}>/users/ryan</Link>
            </li>
            <li>
                <Link to={{
                    pathname: '/users/ryan',
                    query: {
                        foo: 'bar'
                    }
                }} activeStyle={ACTIVE}>/users/ryan?foo=bar</Link>
            </li>

            <li>
                <Link to="/about" activeStyle={ACTIVE}>/about</Link>
            </li>
        </ul>

        {children}
    </div>
)

const IndexConst = () => (
    <div>
        <h2>Index!</h2>
    </div>
)

const Users = ({children}) => (
    <div>
        <h2>Users</h2>
        {children}
    </div>
)

const UsersIndex = () => (
    <div>
        <h3>UsersIndex</h3>
    </div>
)

const User = ({params: {
        id
    }}) => (
    <div>
        <h3>User {id}</h3>
    </div>
)

const About = () => (
    <div>
        <h2>About</h2>
    </div>
)

// render(
// <Router history={browserHistory}>
//     <Route path="/" component={AppXX}>
//         <IndexRoute component={IndexConst}/>
//         <Route path="/about" component={About}/>
//         <Route path="users" component={Users}>
//             <IndexRoute component={UsersIndex}/>
//             <Route path=":id" component={User}/>
//         </Route>
//     </Route>
// </Router>, document.getElementById('root'));
