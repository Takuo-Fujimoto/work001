import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlexContainer from './cmp/FlexContainer.jsx';
import LinkImageCard from './cmp/LinkImageCard.jsx';
import LoadingPanel from './cmp/LoadingPanel.js';
import materialImg from './img/material.png';
import vendorImg from './img/js.png';
import customerImg from './img/springmini.png';
import smallHouseImg from './img/01_snowBoard.png';
import largeHouseImg from './img/02_tentou.png';
import forSaleImg from './img/03_shindan.png';
import approveImg from './img/04_kossetu.png';
import izelImg from './img/05_shussha.png';
import hikokiImg from './img/06_hataraku.png';
import {Link, browserHistory} from 'react-router';

import $ from 'jquery';
import dataJson from './data/data_ja.json'

var mastersDefinition = dataJson.masters;
// TODO 画像の動的読込がしたい。画像はWeb上に配置して(どこに？)絶対URL指定なら出来るが、それだと画像のロードが入るので、出来ればコンパイルしてしまいたい。
var imageData = {
    W001: smallHouseImg,
    W002: largeHouseImg,
    W003: forSaleImg,
    W004: approveImg,
    W005: izelImg,
    W006: hikokiImg
}

var WorkMenu = React.createClass({
    getInitialState: function() {
        let master;
        dataJson.masters.forEach(function(item) {
            if (this.props.params.masterId === item.id) {
                master = item;
            }
        }, this);
        return {masterData: master, workData: dataJson.works, images: imageData};
    },
    onClick: function(linkPath) {
        this.setState({isLoading: true});
        this.setState({linkPath: linkPath});
    },
    transition: function() {
        // 画面遷移する
        let masterId = this.props.params.masterId;
        console.info(masterId);
        if (masterId) {
            browserHistory.push(this.state.linkPath + '/' + masterId);
        } else {
            alert('マスターIDの取得に失敗しました。');
        }
    },
    render() {
        console.info('WorksRender');
        // console.info(JSON.stringify(this.props));
        let loadingPanel;
        if (this.state.isLoading) {
            loadingPanel = (<LoadingPanel loadingName={this.state.masterData.name}/>);
            setTimeout(() => this.transition(), 1000);
        }
        return (
            <div>
                <LinkImageCard data={this.state.workData} imageData={this.state.images} masterId={this.props.params.masterId} onClickFunction={this.onClick}/> {loadingPanel}
            </div>
        );
    }
});

export default WorkMenu;
