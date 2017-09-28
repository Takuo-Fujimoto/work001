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
import materialImg from '../../images/material.png';
import vendorImg from '../../images/js.png';
import customerImg from '../../images/spring.png';

import $ from 'jquery';
import dataJson from './data/data_ja.json'

console.info(dataJson);
var mastersDefinition = dataJson.masters;
// TODO 画像の動的読込がしたい。画像はWeb上に配置して絶対URL指定なら出来るが、それだと画像のロードが入るので、出来ればコンパイルしてしまいたい。
var imageData = {
    M001: materialImg,
    M002: vendorImg,
    M003: customerImg
}

var windowWidth = window.innerWidth;
var cardLength = windowWidth / (mastersDefinition.length + 0.0);
var windowHeight = window.innerHeight;
var cardImageHeight = cardLength - 100;
var cardImageRadiusLength = cardImageHeight / 2;

const styles = {
    card: {
        height: windowHeight + 'px',
        width: cardLength + 'px',
        borderRadius: '20px'
    },
    cardTitle: {
        backgroundColor: '#66CCFF',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        height: '70px'
    },
    cardImage: {
        margin: '20px',
        height: cardImageHeight + 'px',
        width: cardImageHeight + 'px',
        borderRadius: cardImageRadiusLength + 'px'
    },
    cardText: {
        height: '100px',
        backgroundColor: '#66CCFF'
    },
    flexContainer: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
        height: windowHeight + 'px'
    }
};

var Container = React.createClass({
    render() {
        return <div style={styles.flexContainer}>{this.props.children}</div>;
    }
});
var MasterDefinitionCard = React.createClass({
    render: function() {
        console.info(this.props.data);

        var masterNodes = this.props.data.map(function(masterDef) {
            return (
                <Card style={styles.card}>
                    <CardTitle title={masterDef.id + ' : ' + masterDef.name} subtitle={masterDef.description} style={styles.cardTitle}/>
                    <CardMedia>
                        <img src={imageData[masterDef.id]} style={styles.cardImage}/>
                    </CardMedia>
                </Card >
            );
        });
        console.info(masterNodes);
        return (
            <Container>{masterNodes}</Container>
        );
    }
});

var Portal = React.createClass({
    getInitialState: function() {
        return {data: dataJson.masters, images: imageData};
    },
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <MasterDefinitionCard data={this.state.data} image={this.state.images}/>
            </MuiThemeProvider>
        );
    }
});

export default Portal;
