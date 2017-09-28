
// import React from 'react/addons';
import React from 'react'
import {render} from 'react-dom'
import RouterSample from './RouterSample.jsx';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
// insert into index.js
import About from './About'
import Repos from './Repos'
import Repo from './Repo'
// and the Home component
import Home from './Home'
import './index.css';

render((
    <Router history={browserHistory}>
        <Route path="/" component={RouterSample}>
            <IndexRoute component={Home}/>
            <Route path="/repos" component={Repos}>
                <Route path="/repos/:userName/:repoName" component={Repo}/>
            </Route>
            <Route path="/about" component={About}/>
        </Route>
    </Router>
), document.getElementById('root'))
