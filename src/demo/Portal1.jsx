import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlexContainer from './cmp/FlexContainer.jsx';
import ImageCard from './cmp/ImageCard.jsx';
import materialImg from '../../images/material.png';
import vendorImg from '../../images/js.png';
import customerImg from '../../images/springmini.png';
import smallHouseImg from '../../images/akichiSmallHouse3.png';
import largeHouseImg from '../../images/akichiLargeHouse2.png';
import forSaleImg from '../../images/akichiForSale2.png';
import approveImg from '../../images/approve.png';
import izelImg from '../../images/izel.png';

import $ from 'jquery';
import dataJson from './data/data_ja.json'

var mastersDefinition = dataJson.masters;
// TODO 画像の動的読込がしたい。画像はWeb上に配置して絶対URL指定なら出来るが、それだと画像のロードが入るので、出来ればコンパイルしてしまいたい。
var imageData = {
    M001: materialImg,
    M002: vendorImg,
    M003: customerImg,
    W001: smallHouseImg,
    W002: largeHouseImg,
    W003: forSaleImg,
    W004: approveImg,
    W005: izelImg
}

var Portal = React.createClass({
    getInitialState: function() {
        return {masterData: dataJson.masters, workData: dataJson.works, images: imageData};
    },
    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <ImageCard data={this.state.masterData} imageData={this.state.images}/>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <ImageCard data={this.state.workData} imageData={this.state.images}/>
                </MuiThemeProvider>
            </div>
        );
    }
});

export default Portal;
