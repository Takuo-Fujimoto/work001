import React from 'react';
import HandsontableEditCSS from './cmp/hot.css';
import screenData from './data/mockScreenSettings.json'
import $ from 'jquery';
import grid from './../../images/grid.svg';
import documentIcon from './../../images/document.svg';
import plantIcon from './../../images/plant.svg';
import Handsontable from './cmp/Handsontable';

var icomMap = {
    'T001': grid,
    'T002': plantIcon
}

let columns = [];
let data = '';
var Create = React.createClass({
    getInitialState: function() {
        console.log('constructor');
        const styles = {
            floatingHeaderIcon: {
                right: '25px',
                bottom: '25px',
                zIndex: '2',
                width: '50px',
                height: '50px'
            },
            floatingGridIcon: {
                width: '50px',
                height: '50px',
                marginLeft: '20px',
                opacity: '0',
                zIndex: '0'
            },
            floatingSpan: {
                right: '25px',
                bottom: '25px',
                position: 'fixed',
                display: 'inline-block',
                height: '50px',
                zIndex: '2'
            }
        }
        // シート毎のスタイル。主に、FlipInとOutの設定を切り替えるために使う
        var gridIconStyles = {};
        var gridDivClass = {};
        var hotDatas = {};

        var keyArray = Object.keys(screenData.tabInfo);
        keyArray.sort(function(a, b) {
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
        });
        keyArray.forEach(function(key) {
            var tabInfo = screenData.tabInfo[key];
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
            hotDatas: hotDatas
        }
    },
    getData: function() {
        console.log('getData');
        data = this.state.hotDatas['T001'][0][1];
        console.log(this.state.hotDatas);
        this.setState({
            flag: !this.state.flag
        });
    },
    negativeValueRenderer: function(instance, td, row, col, prop, value, cellProperties) {
        console.log('arguments');
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        //return;
    },
    componentDidMount: function() {
        console.info('componentDidMount Create0');
    },
    flip: function(e) {
        console.info('FLIP' + e.target.id);
        this.setState({prevSelectedId: this.state.selectedId});
        this.setState({selectedId: e.target.id});
        this.setState({isInitial: false});
    },
    render() {
        console.info('panelRender!');
        console.info(this.state.gridIconStyles);
        var headerClass = '';
        var headerIconStyle = this.state.styles.floatingHeaderIcon;
        if (this.state.selectedId === 'icon_Header') {
            // ヘッダーのボタンがクリックされた場合
            // ヘッダーDivをFlipIn
            // ヘッダーアイコンをopacity:0で透明化
            // 表示されているグリッドDivをFlipOut
            // グリッドアイコンをopa:1で表示
            headerClass = 'animated flipInY';
            headerIconStyle.opacity = '0';
            headerIconStyle.zIndex = '0';
            headerIconStyle.width = '0px';
            headerIconStyle.marginLeft = '0px';

            this.state.keyArray.forEach(function(key) {
                this.state.gridIconStyles[key].opacity = '1';
                this.state.gridIconStyles[key].width = '50px';
                this.state.gridIconStyles[key].marginLeft = '20px';
                this.state.gridIconStyles[key].zIndex = '3';
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
                    this.state.gridIconStyles[key].opacity = '0';
                    this.state.gridIconStyles[key].zIndex = '0';
                    this.state.gridIconStyles[key].width = '0px';
                    this.state.gridIconStyles[key].marginLeft = '0px';
                } else {
                    if (this.state.prevSelectedId === 'icon_' + key) {
                        this.state.gridDivClass[key] = 'animated flipOutY';
                    }
                    this.state.gridIconStyles[key].opacity = '1';
                    this.state.gridIconStyles[key].zIndex = '3';
                    this.state.gridIconStyles[key].width = '50px';
                    this.state.gridIconStyles[key].marginLeft = '20px';
                }
            }, this);
            headerClass = 'animated flipOutY';
            headerIconStyle.opacity = '1';
            headerIconStyle.zIndex = '3';
            headerIconStyle.width = '50px';
            headerIconStyle.marginLeft = '20px';
        }
        var excelSheets = [];
        var floatIcon = [];
        floatIcon.push((<img id='icon_Header' src={documentIcon} style={headerIconStyle} onClick={this.flip}/>))
        this.state.keyArray.forEach(function(key) {
            var tabInfo = screenData.tabInfo[key];
            // Handsontable設定が無い場合があるので判定する
            var settings = tabInfo.settings
                ? tabInfo.settings
                : {};
            console.info(this.state.gridDivClass[key]);
            excelSheets.push((
                <div className={this.state.gridDivClass[key]}>
                    <Handsontable tabInfo={tabInfo} settings={settings} containerId={tabInfo.tabId} data={this.state.hotDatas[key]}/></div>
            ));
            floatIcon.push((<img id={'icon_' + tabInfo.tabId} src={icomMap[key]} style={this.state.gridIconStyles[key]} onClick={this.flip}/>));
        }, this);
        return (
            <div>
                {excelSheets}
                <span style={this.state.styles.floatingSpan}>
                    {floatIcon}
                </span>
                <div className={headerClass}>
                    <button onClick={this.getData}>Get Data</button>
                    <button onClick={this.getData}>Get Data</button>
                    <button onClick={this.getData}>Get Data</button>
                    {data}
                </div>
            </div>
        );
    }
});

export default Create;
