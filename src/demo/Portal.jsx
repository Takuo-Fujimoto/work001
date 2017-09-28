import React, { Component } from 'react';
// component
import FlexContainer from './cmp/FlexContainer.jsx';
import LinkCard from './cmp/LinkCard.jsx';
import LoadingPanel from './cmp/LoadingPanel.js';
// detailScreen
import Create from './Create02.js';
import Update from './Update.js';
import Delete from './Delete.js';
import Apply from './Apply.js';
import Approve from './Approve.js';
import Past from './Past.js';
// Image
import materialImg from './img/mLogo.png';
import vendorImg from './img/cLogo.png';
import customerImg from './img/mLogo.png';
import smallHouseImg from './img/01_snowBoard.png';
import largeHouseImg from './img/02_tentou.png';
import forSaleImg from './img/03_shindan.png';
import approveImg from './img/04_kossetu.png';
import izelImg from './img/05_shussha.png';
import hikokiImg from './img/06_hataraku.png';
import { Link, browserHistory } from 'react-router';

// etc
import { callService } from './cmp/HttpRequestUtil';
import dataJson from './data/data_ja.json'

let mastersDefinition = dataJson.masters;
// TODO 画像の動的読込がしたい。画像はWeb上に配置して(どこに？)絶対URL指定なら出来るが、それだと画像のロードが入るので、出来ればコンパイルしてしまいたい。
let imageData = {
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
let detailMap = {
    W001: Create,
    W002: Update,
    W003: Delete,
    W004: Apply,
    W005: Approve,
    W006: Past
}

let Portal = React.createClass({
    getInitialState: function () {

        let masterDataMap = {};
        let workDataMap = {};
        dataJson.masters.forEach(function (cardData) {
            masterDataMap[cardData.id] = cardData;
        }, this);
        dataJson.works.forEach(function (cardData) {
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
            },
            loadingPanelStyle: {
                backgroundColor: '#029300',
                color: '#01e8cd'
            }
        };
        return {
            styles: styles,
            masterData: dataJson.masters,
            workData: dataJson.works,
            masterDataMap: masterDataMap,
            workDataMap: workDataMap,
            images: imageData,
            isDisplayMaster: true,
            isDisplayWork: false,
            isDisplayLoading: false,
            isDisplayDetail: false
        };
    },
    onClickMaster: function (clickedId) {
        this.state['isDisplayDetail'] = false;
        this.state['isDisplayLoading'] = false;
        this.state['isDisplayWork'] = true;
        // for fadeout Anime
        this.state['isDisplayMaster'] = true;
        this.setState({ masterId: clickedId });
    },
    onClickWork: function (clickedId) {
        this.state['isDisplayDetail'] = false;
        this.state['isDisplayLoading'] = true;
        // for backGround display
        this.state['isDisplayWork'] = true;
        this.state['isDisplayMaster'] = false;
        this.setState({ workId: clickedId });
        this.setState({ linkPath: this.state.workDataMap[clickedId].linkPath });
    },
    transition: function () {
        // 画面遷移する
        let masterId = this.state.masterId;
        console.info(masterId);
        if (masterId) {
            // browserHistory.push(this.state.linkPath + '/' + masterId);
            let headerInfo = {
                'masterId': masterId,
                'version': 1,
                'patternId': 'P001',
                'itemControlKey': 'SS',
                'languageCode': 'ja'
            };
            // callService('/mcm/mcmmock/selectInitial', {
            //     async: true,
            //     type: 'POST',
            //     dataType: 'json',
            //     contentType: 'application/json',
            //     data: JSON.stringify(headerInfo),
            //     success: this.displayDetail
            // });
            // this.setState({isOpenDetail: true});
            // this.setState({isLoading: false});
            // this.setState({screenDef: screenDef});
            this.displayDetail();
        } else {
            alert('マスターIDの取得に失敗しました。');
        }
    },
    displayDetail: function (data) {
        console.info('success');
        this.state['isDisplayDetail'] = true;
        this.state['isDisplayLoading'] = true;
        this.state['isDisplayWork'] = false;
        this.state['isDisplayMaster'] = false;
        this.state['screenDef'] = data;
        this.forceUpdate();
    },
    render() {
        let masterInvisible = false;
        let workInvisible = true;
        let cardStyle;
        let masterNodes;
        let workNodes;
        let workStyles = {
            display: 'None'
        };

        if (this.state.isDisplayMaster) {
            masterNodes = this.state.masterData.map(function (cardData, index) {
                cardStyle = {
                    WebkitTransform: 'translate3d(-' + ((index * 500) + 300) + '%, 0, 0) rotate3d(0, 0, 1, -720deg)',
                    transform: 'translate3d(-' + ((index * 500) + 300) + ', 0, 0) rotate3d(0, 0, 1, -720deg)'
                };
                return (
                    <LinkCard cardData={cardData} imageData={imageData}
                        itemCount={this.state.masterData.length}
                        index={this.state.masterData.length - index}
                        onClickFunction={this.onClickMaster}
                        initialClass='rollInDelay'
                        onClickClass='rollOutBack'
                        initialStyle={cardStyle}
                        isClick={this.state.isDisplayWork} />);
            }, this);
        }
        if (this.state.isDisplayWork) {
            workNodes = this.state.workData.map(function (cardData) {
                cardStyle = {
                    ...this.state.styles.workStyle,
                    ...{
                        animation: cardData.fadeInAnime + ' 3s ease',
                        WebkitAnimation: cardData.fadeInAnime + ' 3s ease'
                    }
                }
                return (<LinkCard cardData={cardData} imageData={imageData} itemCount={this.state.workData.length} masterId={this.state.masterId} onClickFunction={this.onClickWork} initialStyle={cardStyle} />);
            }, this);
            workStyles.display = 'flex';
            masterInvisible = true;
        }

        let loadingPanel = (<div />);
        if (this.state.isDisplayLoading) {
            if (this.state.isDisplayDetail) {

                loadingPanel = (<LoadingPanel actionName='Loading' targetName={this.state.masterDataMap[this.state.masterId].name} animationName='slideOutDown' panelStyle={this.state.styles.loadingPanelStyle} />);
            } else {
                loadingPanel = (<LoadingPanel actionName='Loading' targetName={this.state.masterDataMap[this.state.masterId].name} animationName='slideInDown' panelStyle={this.state.styles.loadingPanelStyle} />);
                setTimeout(() => this.transition(), 100);
            }
        }

        let detailPanel;
        if (this.state.isDisplayDetail) {
            const Detail = detailMap[this.state.workId];
            detailPanel = (<Detail screenDef={this.state.screenDef}
                masterName={this.state.masterDataMap[this.state.masterId].name} />);
        }
        return (
            <div>
                <FlexContainer invisible={masterInvisible}>{masterNodes}</FlexContainer>
                <FlexContainer propStyles={workStyles}>{workNodes}</FlexContainer>
                {loadingPanel}
                {detailPanel}
            </div>
        );
    }
});

export default Portal;
