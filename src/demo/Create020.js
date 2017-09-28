/* 色変える */
import React, {Components} from 'react';
import HandsontableEditCSS from './cmp/hot.css';
import tooltipCSS from './../lib/css/tooltip-curved.css';
import screenData from './data/mockScreenSettings.json'
import $ from 'jquery';
import Gridimg from './svg/GridImg';
import HeaderImg from './svg/HeaderImg';
import Plantimg from './svg/PlantImg';
import Handsontable from './cmp/Handsontable';
import HeaderInfo from './cmp/HeaderInfo';

let icomMap = {
    'T001': Gridimg,
    'T002': Plantimg
}
/*
const defaultSVGColor = 'rgb(75, 75, 75)';*/
const defaultSVGColor = 'slategray';
const selectedSVGColor = 'tomato';
const hoverSVGColor = 'lavender';

let columns = [];
let data = '';
let Create = React.createClass({
    getInitialState: function() {
        // console.log('constructor');

        let keyArray = Object.keys(screenData.tabInfo);
        keyArray.sort(function(a, b) {
            return (a < b)
                ? -1
                : (a > b)
                    ? 1
                    : 0;
        });

        const styles = {
            floatingHeaderIcon: {
                zIndex: '3',
                marginLeft: '20px',
                width: '50px',
                height: '50px'
            },
            floatingGridIcon: {
                width: '50px',
                height: '50px',
                marginLeft: '20px',
                zIndex: '3'
            },
            floatingSpan: {
                position: 'fixed',
                display: 'inline-block',
                height: '50px',
                zIndex: '2'
            },
            floatingDiv: {
                position: 'fixed'
            }
        }
        // シート毎のスタイル。主に、FlipInとOutの設定を切り替えるために使う
        let gridIconStyles = {};
        let gridDivClass = {};
        let hotDatas = {};
        // {タブID: [ItemId, ItemId...], ...} itemIfはitemDisplayOrderで並べる
        let itemInfoKeyArrayMap = {}
        keyArray.forEach(function(key) {
            let tabInfo = screenData.tabInfo[key];
            gridIconStyles[tabInfo.tabId] = {
                ...styles.floatingGridIcon
            }
            gridDivClass[tabInfo.tabId] = '';
            hotDatas[tabInfo.tabId] = [];
        }, this);
        return {
            screenSettingData: screenData,
            selectedId: 'icon_Header',
            prevSelectedId: '',
            styles: styles,
            gridIconStyles: gridIconStyles,
            gridDivClass: gridDivClass,
            flag: true,
            isInitial: true,
            keyArray: keyArray,
            hotDatas: hotDatas,
            hoverId: ''
        }
    },
    componentWillMount: function() {
        document.body.style.backgroundColor = "#7affbc";
        this.updateIconPosition();
    },
    componentDidMount: function() {
        window.addEventListener("resize", this.updateIconPosition);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateIconPosition);
    },
    calcLeftPosition: function(i) {
        let windowWidth = window.innerWidth;
        let rightDispLength = windowWidth - ((i + 1) * 70);
        return rightDispLength;
    },
    getData: function() {
        // console.log('getData');
        data = this.state.hotDatas['T001'][0][0];
        // console.log(this.state.hotDatas);
        this.setState({
            flag: !this.state.flag
        });
    },
    negativeValueRenderer: function(instance, td, row, col, prop, value, cellProperties) {
        // console.log('arguments');
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        //return;
    },
    onEnter: function(e) {
        this.setState({hoverId: e.target.id});
    },
    onLeave: function(e) {
        if (this.state.hoverId === e.target.id) {
            this.setState({hoverId: ''});
        }
    },
    flip: function(e) {
        // console.info('FLIP' + e.target.id);
        this.setState({prevSelectedId: this.state.selectedId});
        this.setState({selectedId: e.target.id});
        this.setState({isInitial: false});
    },
    updateIconPosition: function() {
        // console.info('updateIconPosition!');
        this.setState({
            flag: !this.state.flag
        });
    },
    render() {
        // アイコンの表示位置は右下だが、左と上からの距離で決める
        // rightとbottomで指定すると、スクロールバーの有無で表示位置が変わり、画面のフリップ時に、がたつくため。
        let windowHeight = window.innerHeight;
        let bottomDispLength = windowHeight - 100;
        this.state.styles.floatingDiv.top = bottomDispLength + 'px';
        // console.info('Create02 Render! ' + this.state.styles.floatingDiv.top + ' / ' + this.calcLeftPosition(this.state.keyArray.length + 1) + 'px');
        // console.info(this.state.gridIconStyles);
        let headerClass = '';
        let headerIconStyle = this.state.styles.floatingHeaderIcon;
        if (this.state.selectedId === 'icon_Header') {
            // ヘッダーのボタンがクリックされた場合
            // ヘッダーDivをFlipIn
            // ヘッダーアイコンをopacity:0で透明化
            // 表示されているグリッドDivをFlipOut
            // グリッドアイコンをopa:1で表示
            headerClass = 'animated flipInY';
            // headerIconStyle.opacity = '0';
            // headerIconStyle.zIndex = '0';
            // headerIconStyle.width = '0px';
            // headerIconStyle.marginLeft = '0px';
            headerIconStyle.fill = selectedSVGColor;

            this.state.keyArray.forEach(function(key) {
                // this.state.gridIconStyles[key].opacity = '1';
                // this.state.gridIconStyles[key].width = '50px';
                // this.state.gridIconStyles[key].marginLeft = '20px';
                // this.state.gridIconStyles[key].zIndex = '3';
                if (this.state.hoverId === 'icon_' + key) {
                    this.state.gridIconStyles[key].fill = hoverSVGColor;
                } else {
                    this.state.gridIconStyles[key].fill = defaultSVGColor;
                }
                if (this.state.prevSelectedId === 'icon_' + key) {
                    this.state.gridDivClass[key] = 'animated flipOutY';
                }
                if (this.state.isInitial) {
                    this.state.gridDivClass[key] = 'hiddenAndNoHeight';
                }
            }, this);
        } else {
            this.state.keyArray.forEach(function(key) {
                // 3パターンのシートがある
                //  1. 今選択された　this.state.selectedId === 'icon_' + key -> flipIn opa:0
                //  2. さっきまで選択されてた　this.state.prevSelectedId === 'icon_' + key
                //  3. 前回も今回も選択されてない　else
                if (this.state.selectedId === 'icon_' + key) {
                    this.state.gridDivClass[key] = 'animated flipInY';
                    // this.state.gridIconStyles[key].opacity = '0';
                    // this.state.gridIconStyles[key].zIndex = '0';
                    // this.state.gridIconStyles[key].width = '0px';
                    // this.state.gridIconStyles[key].marginLeft = '0px';
                    this.state.gridIconStyles[key].fill = selectedSVGColor;
                } else {
                    if (this.state.prevSelectedId === 'icon_' + key) {
                        this.state.gridDivClass[key] = 'animated flipOutY';
                    }
                    // this.state.gridIconStyles[key].opacity = '1';
                    // this.state.gridIconStyles[key].zIndex = '3';
                    // this.state.gridIconStyles[key].width = '50px';
                    // this.state.gridIconStyles[key].marginLeft = '20px';
                    if (this.state.hoverId === 'icon_' + key) {
                        this.state.gridIconStyles[key].fill = hoverSVGColor;
                    } else {
                        this.state.gridIconStyles[key].fill = defaultSVGColor;
                    }
                }
            }, this);
            headerClass = 'animated flipOutY';
            // headerIconStyle.opacity = '1';
            // headerIconStyle.zIndex = '3';
            // headerIconStyle.width = '50px';
            // headerIconStyle.marginLeft = '20px';
            if (this.state.hoverId === 'icon_Header') {
                headerIconStyle.fill = hoverSVGColor;
            } else {
                headerIconStyle.fill = defaultSVGColor;
            }
        }
        let excelSheets = [];
        let floatIcon = [];
        floatIcon.push((
            <div onClick={this.flip} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave} id='icon_Header' className='tooltip tooltip-east' style={{
                ...this.state.styles.floatingDiv,
                ...{
                    left: this.calcLeftPosition(this.state.keyArray.length + 1) + 'px'
                }
            }}>
                <HeaderImg style={headerIconStyle} id='icon_Header' color={{
                    fill: headerIconStyle.fill
                }}/>
                <span className="tooltip-content" onClick={this.flip} id='icon_Header'>Header</span>
            </div>
        ));
        this.state.keyArray.forEach(function(key, i) {
            let tabInfo = screenData.tabInfo[key];
            // Handsontable設定が無い場合があるので判定する
            let settings = tabInfo.settings
                ? tabInfo.settings
                : {};
            // console.info(key + ' : ' + i);
            excelSheets.push((
                <div className={this.state.gridDivClass[key]}>
                    <Handsontable tabInfo={tabInfo} settings={settings} containerId={tabInfo.tabId} data={this.state.hotDatas[key]}/></div>
            ));
            const SvgImg = icomMap[key];
            floatIcon.push((
                <div onClick={this.flip} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave} id={'icon_' + tabInfo.tabId} className='tooltip tooltip-east' style={{
                    ...this.state.styles.floatingDiv,
                    ...{
                        left: this.calcLeftPosition(this.state.keyArray.length - i) + 'px'
                    }
                }}>
                    <SvgImg id={'icon_' + tabInfo.tabId} style={this.state.gridIconStyles[key]} color={{
                        fill: this.state.gridIconStyles[key].fill
                    }}></SvgImg>
                    <span className="tooltip-content" onClick={this.flip} id={'icon_' + tabInfo.tabId}>{tabInfo.tabNameEn}</span>
                </div>
            ));
        }, this);
        return (
            <div>
                {excelSheets}
                {floatIcon}
                <div className={headerClass}>
                    <HeaderInfo/>
                </div>
            </div>
        );
    }
});
export default Create;
