import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom'
import Portal from './demo/Portal.jsx';
import './index.css';
import './lib/css/animate.css';
import {
    Router,
    Route,
    IndexRoute,
    Link,
    IndexLink,
    browserHistory
} from 'react-router';

import test from './demo/cmp/test.jsx';

var Routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Portal}></Route>
    </Router>
);
render(Routes, document.getElementById('root'));

//
// // import React from 'react/addons';
// import React from 'react'
// import {render} from 'react-dom'
// import RouterSample from './RouterSample.jsx';
// import {Router, Route, browserHistory, IndexRoute} from 'react-router'
// // insert into index.js
// import About from './About'
// import Repos from './Repos'
// import Repo from './Repo'
// // and the Home component
// import Home from './Home'
// import './index.css';
//
// render((
//     <Router history={browserHistory}>
//         <Route path="/" component={RouterSample}>
//             <IndexRoute component={Home}/>
//             <Route path="/repos" component={Repos}>
//                 <Route path="/repos/:userName/:repoName" component={Repo}/>
//             </Route>
//             <Route path="/about/:masterId" component={About}/>
//         </Route>
//     </Router>
// ), document.getElementById('root'))
