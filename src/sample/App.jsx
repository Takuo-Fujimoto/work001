import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup' // ES6
import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from './logo.svg';
import dino from '../images/dino.png';
import PC from '../images/PC.jpg';
import activiti from '../images/activiti.png';
import handsontable from '../images/handsontable.png';
import html5css3 from '../images/html5css3.jpg';
import java8_logo from '../images/java8_logo.png';
import js from '../images/js.png';
import materialUi from '../images/material-ui-logo.svg';
import saphana from '../images/saphana.png';
import spring from '../images/spring.png';
import './App.css';

var windowWidth = window.innerWidth;
var cardWidth = windowWidth / 4.1;
var windowHeight = window.innerHeight;

const styles = {
    normal: {},
    san: {
        fontSize: '40px'
    },
    appCard: {
        height: '300px',
        animation: 'App-logo-spin infinite 20s linear'
    },
    cardImage: {
        height: '200px'
    },
    smallCard: {
        width: cardWidth + 'px'
    },
    flexContainer: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
        alignItems: "center"
    }
};

var Container = React.createClass({
    render() {
        return <div style={styles.flexContainer}>{this.props.children}</div>;
    }
});
var CardExampleWithAvatar = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <Card style={styles.smallCard}>
                    <CardHeader title="URL Avatar" subtitle="Subtitle" avatar={dino}/>
                    <CardMedia overlay= {<CardTitle title = "Overlay title" subtitle = "Overlay subtitle" />}>
                        <img src={this.props.image} style={styles.cardImage}/>
                    </CardMedia>
                    <CardTitle title="Card title" subtitle="Card subtitle"/>
                    <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec mattis pretium massa.Aliquam erat volutpat.Nulla facilisi.Donec vulputate interdum sollicitudin.Nunc lacinia auctor quam sed pellentesque.Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions>
                        <FlatButton label="Action1"/>
                        <FlatButton label="Action2"/>
                    </CardActions>
                </Card >
            </MuiThemeProvider>
        );
    }
});
// class App extends Component {
var App = React.createClass ({

    // stateのデフォルト値を設定する場合はgetInitialStateを定義
    getInitialState() {
        console.log("Initilize");
        return {num: 0};
    },

    // 画面遷移のためのコンテキスト
    contextTypes: {
        router: React.PropTypes.object
    },
    render() {
        return (
            <Container>
                <CardExampleWithAvatar image={PC}/>
                <CardExampleWithAvatar image={activiti}/>
                <CardExampleWithAvatar image={handsontable}/>
                <CardExampleWithAvatar image={html5css3}/>
                <CardExampleWithAvatar image={java8_logo}/>
                <CardExampleWithAvatar image={js}/>
                <CardExampleWithAvatar image={materialUi}/>
                <CardExampleWithAvatar image={saphana}/>
                <CardExampleWithAvatar image={spring}/>
                <CardExampleWithAvatar image={logo}/>
            </Container>
        );
    }
});

export default App;
