import React, {Components} from 'react';
import MenuSideSlideCSS from './../lib/css/menu_sideslide.css';
import screenData from './data/mockScreenSettings.json'
import drawerIconData from './data/DrawerMenuIcon.json'
import headerData from './data/headerData.json';
import Handsontable from './cmp/Handsontable';
import HeaderInfo from './cmp/HeaderInfo';
import FixedIconButton from './cmp/FixedIconButton';
import DrawerMenu from './cmp/DrawerMenu';
import SearchPanel from './cmp/SearchPanel';
import {callService} from './cmp/HttpRequestUtil';
import $ from 'jquery';
import superagent from 'superagent';
// $.ajax({
//     async: false,
//     url: 'https://springtestceadc641b.ap1.hana.ondemand.com/SpringTest/mcm/mcmmock/selectInitial',
//     xhrFields: {
//         withCredentials: true
//     },
//     type: 'POST',
//     dataType: 'json',
//     cache: 'false',
//     contentType: 'application/json',
//     data: JSON.stringify(headerInfo),
//     success: function(data, textStatus, jqXHR) { // callback called when data is received
//         screenDef = data;
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.error('Service Call error');
//     }
// });
// $.ajax({
//     async: false,
//     url: 'http://localhost:8080/SpringTest/mcm/mcmmock/selectInitial',
//     type: 'POST',
//     dataType: 'json',
//     contentType: 'application/json',
//     data: JSON.stringify(headerInfo),
//     success: function(data, textStatus, jqXHR) { // callback called when data is received
//         screenDef = data;
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.error('Service Call error');
//     }
// });

let Create = React.createClass({

    getInitialState: function() {
        console.info('Create getInitialState');
        let screenDef;

        let headerInfo = {
            'masterId': 'M001',
            'version': 1,
            'patternId': 'P001',
            'itemControlKey': 'SS',
            'languageCode': 'ja'
        };
        // superagent.post("http://localhost:8080/SpringTest/mcm/mcmmock/selectInitial").send(headerInfo).end(function(err, res) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(res.status);
        //         console.info(JSON.stringify(res.body));
        //         screenDef = res.body;
        //     }
        // });
        // });
        screenDef = callService('/mcm/mcmmock/selectInitial', {
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(headerInfo)
        });
        // console.log('constructor');
        let keyArray = Object.keys(screenDef.tabInfo);
        keyArray.sort(function(a, b) {
            return (a < b)
                ? -1
                : (a > b)
                    ? 1
                    : 0;
        });
        // シート毎のスタイル。主に、FlipInとOutの設定を切り替えるために使う
        let flipPanelClass = {
            Header: ''
        };
        let hotDatas = {};
        // {タブID: [ItemId, ItemId...], ...} itemIfはitemDisplayOrderで並べる
        let itemInfoKeyArrayMap = {}
        keyArray.forEach(function(key) {
            let tabInfo = screenDef.tabInfo[key];
            flipPanelClass[tabInfo.tabId] = 'hiddenAndNoHeight';
            hotDatas[tabInfo.tabId] = [];
        }, this);

        let functionMap = {
            applyButton: this.apply,
            saveButton: this.save,
            searchButton: this.search,
            checkButton: this.check,
            fillButton: this.fill,
            helpButton: this.help
        };
        return {
            screenSettingData: screenDef,
            selectedId: 'Header',
            drawerSelectedId: '',
            prevSelectedId: '',
            flipPanelClass: flipPanelClass,
            flag: true,
            isInitial: true,
            keyArray: keyArray,
            hotDatas: hotDatas,
            hoverId: '',
            functionMap: functionMap,
            isSearch: false
        }
    },
    componentWillMount: function() {
        console.info('componentWillMount');
        document.body.style.backgroundColor = '#7affbc';
        this.updateIconPosition();
    },
    componentDidMount: function() {
        window.addEventListener('resize', this.updateIconPosition);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.updateIconPosition);
    },
    calcLeftPosition: function(i) {
        let windowWidth = window.innerWidth;
        let rightDispLength = windowWidth - ((i) * 70);
        return rightDispLength;
    },
    getData: function() {
        // console.log('getData');
        let data = this.state.hotDatas['T001'][0][0];
        // console.log(this.state.hotDatas);
        this.setState({
            flag: !this.state.flag
        });
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
        if (this.state.selectedId !== e.target.id) {
            this.setState({selectedId: e.target.id});
            this.setState({prevSelectedId: this.state.selectedId});
        }
        this.setState({isInitial: false});
    },
    updateIconPosition: function() {
        // console.info('updateIconPosition!');
        this.setState({
            flag: !this.state.flag
        });
    },
    onChangeForChild(id, value) {
        var stateObject = function(id, value) {
            let returnObj = {};
            returnObj[id] = value;
            return returnObj;
        }(id, value);
        this.setState(stateObject);
        this.setState({isInitial: false});
    },
    apply: function() {
        console.log('apply');
        console.log('masterId:' + this.props.params.masterId);
        headerData.inputs.forEach(function(item) {
            if (document.getElementById(item.id)) {
                console.info(item.id + ' : ' + document.getElementById(item.id).value);
            }
        });

        Object.keys(this.state.hotDatas).forEach(function(tabKey) {
            this.state.hotDatas[tabKey].forEach(function(rowData, rowIndex) {
                rowData.forEach(function(cellData, columnIndex) {
                    console.info(rowIndex + ':' + columnIndex + ' = ' + cellData);
                }, this);
            }, this);
        }, this);
    },
    save: function() {
        console.log('save');
    },
    search: function(e) {
        let isSearchValue = !this.state.isSearch;
        this.setState({isSearch: isSearchValue});
        if (isSearchValue) {
            this.setState({drawerSelectedId: e.target.id});
        } else {
            this.setState({drawerSelectedId: ''});
        }
    },
    check: function() {
        console.log('check');
    },
    fill: function() {
        console.log('fill');
    },
    help: function() {
        console.log('help');
    },
    selectFunction: function(selectedData, selectCount) {
        console.log('selectFunction');
        if (selectCount === 0) {
            return;
        }
        Object.keys(this.state.hotDatas).forEach(function(key) {
            let tabData = this.state.hotDatas[key];
            // for columnLength no change('-1' is itemId column offset)
            let currentLenghth = tabData[0].length - 1;
            let appendCount = currentLenghth - selectCount > 0
                ? currentLenghth - selectCount
                : 0;
            let appendColumn = [];
            for (let i = 0; i < appendCount; i++) {
                appendColumn.push('');
            }
            tabData.forEach(function(rowItem) {
                console.info('tab: ' + key + ' / itemId: ' + rowItem[0]);
                // remove only data(itemid does not removed)
                let currentLenght = rowItem.length;
                rowItem.splice(1, rowItem.length);
                Array.prototype.push.apply(rowItem, selectedData[rowItem[0]]);
                Array.prototype.push.apply(rowItem, appendColumn);
            })
        }, this);
        this.setState({isSearch: false});
        this.setState({drawerSelectedId: ''});
    },
    render() {
        // アイコンの表示位置は右下だが、左と上からの距離で決める
        // rightとbottomで指定すると、スクロールバーの有無で表示位置が変わり、画面のフリップ時に、がたつくため。
        let windowHeight = window.innerHeight;
        let bottomDispLength = windowHeight - 80;
        if (this.state.isInitial) {
            var x = Math.random();
            // console.info('x : ' + x);
            if (x < 0.1) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated flash';
            } else if (x < 0.2) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated tada';
            } else if (x < 0.3) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated jello';
            } else if (x < 0.4) {
                this.state.flipPanelClass[this.state.selectedId] = 'animatedDelay wobble';
            } else if (x < 0.5) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated fadeInLeftBig';
            } else if (x < 0.6) {
                this.state.flipPanelClass[this.state.selectedId] = 'animatedDelay rotateIn';
            } else if (x < 0.7) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated rubberBand';
            } else if (x < 0.8) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated zoomIn';
            } else if (x < 0.9) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated zoomInUp';
            } else if (x < 0.99) {
                this.state.flipPanelClass[this.state.selectedId] = 'animated bounceInUp';
            } else {
                this.state.flipPanelClass[this.state.selectedId] = 'animatedDelay hinge';
            }
        } else {
            this.state.flipPanelClass[this.state.prevSelectedId] = 'animated flipOutY';
            this.state.flipPanelClass[this.state.selectedId] = 'animated flipInY';
        }
        let flipPanel = [];
        flipPanel.push((
            <div className={this.state.flipPanelClass['Header']} id='Header'>
                <HeaderInfo/>
            </div>
        ));
        let drawerMenuIcons = drawerIconData.iconCreate.map(function(iconData) {
            return (<FixedIconButton id={iconData.id} tooltip={iconData.label} defaultColor='#65ace4' selectedColor={iconData.selectedColor} clickFunction={this.state.functionMap[iconData.id]} selectedId={this.state.drawerSelectedId} divStyle={{
                marginBottom: '15px'
            }}/>);
        }, this);

        let bottomFloatIcons = [];
        bottomFloatIcons.push((<FixedIconButton id='Header' tooltip='Header' top={bottomDispLength} left={this.calcLeftPosition(this.state.keyArray.length + 1)} clickFunction={this.flip} selectedId={this.state.selectedId}/>));

        // ドロワーメニューのボタン位置を、下部の入力シート切替ボタンの一番右のボタンと合わせたいので、変数で持っておく
        let lastBottomIconLeft = 0;

        //  行が少ないとフロート用のヘッダーが中空に出る問題対応　いくつ行が入るか計算して、それ以下だったらHeightとOverflow:Hiddenを設定する
        let dispRowwCount = (windowHeight - 30) / 30;

        this.state.keyArray.forEach(function(key, i) {
            let tabInfo = this.state.screenSettingData.tabInfo[key];
            // Handsontable設定が無い場合があるので判定する
            let settings = tabInfo.settings
                ? tabInfo.settings
                : {};
            lastBottomIconLeft = this.calcLeftPosition(this.state.keyArray.length - i);

            let flipPanelStyle = {};
            if ('animated flipInY' === this.state.flipPanelClass[key] && tabInfo.itemNameList.length < dispRowwCount) {
                // flipPanelStyle.height = tabInfo.itemNameList.length * 30 + 30 + 'px';
                // flipPanelStyle.height = windowHeight + 'px';
                // flipPanelStyle.overflowY = 'hidden';
            }

            flipPanel.push((
                <div className={this.state.flipPanelClass[key]} style={flipPanelStyle}>
                    <Handsontable tabInfo={tabInfo} settings={settings} containerId={tabInfo.tabId} data={this.state.hotDatas[key]}/></div>
            ));
            bottomFloatIcons.push((<FixedIconButton id={tabInfo.tabId} tooltip={tabInfo.tabName} top={bottomDispLength} left={lastBottomIconLeft} clickFunction={this.flip} selectedId={this.state.selectedId}/>));
        }, this);

        let searchPanelStyle = {};
        if (this.state.isSearch) {
            searchPanelStyle.transform = 'translate3d(0,0,0)';
            searchPanelStyle.transition = 'transform 0.4s';
        } else {
            searchPanelStyle.transform = 'translate3d(' + window.innerWidth + 'px,0,0)';
            searchPanelStyle.transition = 'transform 0.4s';
        }

        return (
            <div>
                <DrawerMenu left={lastBottomIconLeft}>{drawerMenuIcons}</DrawerMenu>
                {flipPanel}
                {bottomFloatIcons}
                <SearchPanel panelStyle={searchPanelStyle} screenData={this.state.screenSettingData} selectFunction={this.selectFunction}/>
            </div>
        );
    }
});
export default Create;
