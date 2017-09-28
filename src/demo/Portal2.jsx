import React, {Component} from 'react';
import FlexContainer from './cmp/FlexContainer.jsx';
import LinkCard from './cmp/LinkCard.jsx';
import LoadingPanel from './cmp/LoadingPanel.js';
import materialImg from './img/mLogo.png';
import vendorImg from './img/cLogo.png';
import customerImg from './img/mLogo.png';
import smallHouseImg from './img/01_snowBoard.png';
import largeHouseImg from './img/02_tentou.png';
import forSaleImg from './img/03_shindan.png';
import approveImg from './img/04_kossetu.png';
import izelImg from './img/05_shussha.png';
import hikokiImg from './img/06_hataraku.png';
import {Link, browserHistory} from 'react-router';

import dataJson from './data/data_ja.json'

var mastersDefinition = dataJson.masters;
// TODO 画像の動的読込がしたい。画像はWeb上に配置して(どこに？)絶対URL指定なら出来るが、それだと画像のロードが入るので、出来ればコンパイルしてしまいたい。
var imageData = {
    M001: materialImg,
    M002: vendorImg,
    M003: customerImg,
    W001: smallHouseImg,
    W002: largeHouseImg,
    W003: forSaleImg,
    W004: approveImg,
    W005: izelImg,
    W006: hikokiImg
}

var Portal = React.createClass({
    getInitialState: function() {

        let masterDataMap = {};
        let workDataMap = {};
        dataJson.masters.forEach(function(cardData) {
            masterDataMap[cardData.id] = cardData;
        }, this);
        dataJson.works.forEach(function(cardData) {
            workDataMap[cardData.id] = cardData;
        }, this);
        const styles = {
            workStyle: {
                margin: 'auto',
                WebkitTransition: 'all 2s',
                MozTransition: 'all 2s',
                MsTransition: 'all 2s',
                OTransition: 'all 2s',
                transition: 'all 2s',
                opacity: '1',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                display: 'block'
            }
        };
        return {
            styles: styles,
            masterData: dataJson.masters,
            workData: dataJson.works,
            masterDataMap: masterDataMap,
            workDataMap: workDataMap,
            images: imageData,
            isClickMaster: false
        };
    },
    onClickMaster: function(clickedId) {
        this.setState({isClickMaster: true});
        this.setState({masterId: clickedId});
    },
    onClickWork: function(clickedId) {
        this.setState({isLoading: true});
        this.setState({linkPath: this.state.workDataMap[clickedId].linkPath});
    },
    transition: function() {
        // 画面遷移する
        let masterId = this.state.masterId;
        console.info(masterId);
        if (masterId) {
            browserHistory.push(this.state.linkPath + '/' + masterId);
        } else {
            alert('マスターIDの取得に失敗しました。');
        }
    },
    render() {
        let masterInvisible = false;
        let workInvisible = true;
        let cardStyle;
        let workNodes;
        let workStyles = {
            display: 'None'
        };
        let masterNodes = this.state.masterData.map(function(cardData, index) {
            cardStyle = {
                WebkitTransform: 'translate3d(-' + ((index * 500) + 300) + '%, 0, 0) rotate3d(0, 0, 1, -720deg)',
                transform: 'translate3d(-' + ((index * 500) + 300) + ', 0, 0) rotate3d(0, 0, 1, -720deg)'
            };
            return (<LinkCard cardData={cardData} imageData={imageData} itemCount={this.state.masterData.length} index={this.state.masterData.length - index} onClickFunction={this.onClickMaster} initialClass='rollInDelay' onClickClass='rollOutBack' initialStyle={cardStyle} isClick={this.state.isClickMaster}/>);
        }, this);
        if (this.state.isClickMaster) {
            workNodes = this.state.workData.map(function(cardData) {
                cardStyle = {
                    ...this.state.styles.workStyle,
                    ...{
                        animation: cardData.fadeInAnime + ' 3s ease',
                        WebkitAnimation: cardData.fadeInAnime + ' 3s ease'
                    }
                }
                return (<LinkCard cardData={cardData} imageData={imageData} itemCount={this.state.workData.length} masterId={this.state.masterId} onClickFunction={this.onClickWork} initialStyle={cardStyle}/>);
            }, this);
            workStyles.display = 'flex';
            masterInvisible = true;
        }
        console.info('leng : ' + masterNodes.length);

        let loadingPanel;
        if (this.state.isLoading) {
            loadingPanel = (<LoadingPanel loadingName={this.state.masterDataMap[this.state.masterId].name}/>);
            setTimeout(() => this.transition(), 1000);
        }
        return (
            <div>
                <FlexContainer invisible={masterInvisible}>{masterNodes}</FlexContainer>
                <FlexContainer propStyles={workStyles}>{workNodes}</FlexContainer>
                {loadingPanel}
            </div>
        );
    }
});

export default Portal;
