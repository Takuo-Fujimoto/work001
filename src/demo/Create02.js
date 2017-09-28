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
import {isEmpty, formatDate, createRandomStr, is} from './cmp/Util';
import LoadingPanel from './cmp/LoadingPanel.js';
import MessageDialog from './cmp/MessageDialog.js';
let Create = React.createClass({

    getInitialState: function() {
        console.info('Create getInitialState');
        // let screenDef = this.props.screenDef;
        let screenDef = screenData;

        // let headerInfo = {
        //     'masterId': 'M001',
        //     'version': 1,
        //     'patternId': 'P001',
        //     'itemControlKey': 'SS',
        //     'languageCode': 'ja'
        // };
        // screenDef = callService('/mcm/mcmmock/selectInitial', {
        //     async: false,
        //     type: 'POST',
        //     dataType: 'json',
        //     contentType: 'application/json',
        //     data: JSON.stringify(headerInfo)
        // });
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
            isSearch: false,
            isDisplayLoading: false
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
    displayLoading: function(e, callBackFunction, actionName) {
        this.setState({isDisplayLoading: true});
        this.setState({isEndLoading: false});
        this.setState({actionName: actionName});
        this.setState({callback: callBackFunction});
        this.setState({isExecuteCallback: true});
        this.setState({isDisplayMessage: false});
        this.setState({isHideMessage: true});
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
        // this.setState({isInitial: false});
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
        // this.setState({isInitial: false});
    },
    apply: function() {
        let requestData = {};
        console.log('apply');
        console.log('masterId:' + this.state.screenSettingData.masterId);
        let errorMessages = [];
        headerData.inputs.forEach(function(item) {
            let element = document.getElementById(item.id);
            if (element) {
                if (isEmpty(element.value)) {
                    errorMessages.push('HeaderTab : ' + item.label + ' is Required!!!');
                }

                if (item.id.includes('Date') && is('Date', element.value)) {
                    requestData[item.id] = formatDate(element.value);
                } else {
                    requestData[item.id] = element.value;
                }
            }
        });
        requestData.masterId = this.state.screenSettingData.masterId;
        requestData.version = 1;
        requestData.applyDate = formatDate(new Date());
        requestData.applicant = 'P000000';

        requestData.tabData = {};
        Object.keys(this.state.hotDatas).forEach(function(tabKey) {
            let detailDatas = {}
            let tabData = {
                tabId: tabKey,
                detailData: detailDatas
            };
            requestData.tabData[tabKey] = tabData;
            let columnLength = this.state.hotDatas[tabKey][0].length;
            let rowLength = this.state.hotDatas[tabKey].length;
            // index0の隠し行にItemIdがはいってるから、index1から
            for (let columnIndex = 1; columnIndex < columnLength; columnIndex++) {
                let isHeaderItemInput = true;
                let itemDatas = {}
                let detailData = {
                    detailNo: columnIndex,
                    itemData: itemDatas
                };
                let columnErrorMessages = [];
                for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
                    // index0の隠し行にItemIdがはいってるから、固定で指定する
                    let itemId = this.state.hotDatas[tabKey][rowIndex][0];
                    let itemValue = this.state.hotDatas[tabKey][rowIndex][columnIndex];
                    if ('1' === this.state.screenSettingData.tabInfo[tabKey].itemInfo[itemId].mandatory && isEmpty(itemValue)) {
                        columnErrorMessages.push('Tab : ' + this.state.screenSettingData.tabInfo[tabKey].tabName + ' - Column : ' + columnIndex + ' -> ' + this.state.screenSettingData.tabInfo[tabKey].itemInfo[itemId].itemName + ' is Required!!!');
                    }
                    // ヘッダー項目が1つでもブランクの場合、明細を落とす
                    if ('1' === this.state.screenSettingData.tabInfo[tabKey].itemInfo[itemId].headerDivision && isEmpty(itemValue)) {
                        isHeaderItemInput = false;
                        break;
                    }
                    let itemData = {
                        itemId: itemId,
                        itemValue: itemValue
                    };

                    itemDatas[itemId] = itemData
                }
                if (isHeaderItemInput) {
                    if (columnErrorMessages.length === 0) {
                        detailDatas[columnIndex] = detailData
                    } else {
                        Array.prototype.push.apply(errorMessages, columnErrorMessages);
                    }
                }
            }

            // this.state.hotDatas[tabKey].forEach(function(rowData, rowIndex) {
            //
            //     requestData.tabData[tabKey] = {}
            //     rowData.forEach(function(cellData, columnIndex) {
            //         console.info(rowIndex + ':' + columnIndex + ' = ' + cellData);
            //     }, this);
            // }, this);
        }, this);

        if (errorMessages.length > 0) {
            this.setState({message: errorMessages});
            this.setState({isDisplayMessage: true});
            this.setState({isHideMessage: false});
            this.setState({isDisplayLoading: true});
            this.setState({isEndLoading: true});
            return;
        }
        console.info(requestData);
        console.info(JSON.stringify(requestData));
        callService('/mcm/mcmmock/apply', {
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: this.successApply
        });
    },
    successApply: function(response) {
        this.state['isDisplayLoading'] = true;
        this.state['isEndLoading'] = true;
        this.forceUpdate();
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
        document.getElementById('applyNumber').value = 'AP_' + createRandomStr(9);
        document.getElementById('applyTitle').value = 'AP_' + createRandomStr(30);
        document.getElementById('approvalLimitDate').value = formatDate(new Date());
        document.getElementById('activateDate').value = formatDate(new Date());
        this.state['isDisplayLoading'] = true;
        this.state['isEndLoading'] = true;
        this.forceUpdate();
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
                // console.info('tab: ' + key + ' / itemId: ' + rowItem[0]);
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
    hideFunction: function() {
        this.setState({isHideMessage: true});
    },
    render() {
        console.info('create render  ' + this.state['isDisplayLoading'] + ' / ' + this.state['isEndLoading']);
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
            this.setState({isInitial: false});
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
            return (<FixedIconButton id={iconData.id} tooltip={iconData.label} defaultColor='#65ace4' selectedColor={iconData.selectedColor} clickFunction={iconData.noLoading
                ? this.state.functionMap[iconData.id]
                : this.displayLoading} callBackFunction={this.state.functionMap[iconData.id]} actionName={iconData.actionName} selectedId={this.state.drawerSelectedId} divStyle={{
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

        let loadingPanel = (<div/>);
        if (this.state.isDisplayLoading) {
            if (this.state.isEndLoading) {
                loadingPanel = (<LoadingPanel actionName={this.state.actionName} targetName={this.props.masterName} animationName='slideOutDown'/>);
            } else {
                loadingPanel = (<LoadingPanel actionName={this.state.actionName} targetName={this.props.masterName} animationName='slideInDown'/>);
                if (this.state.isExecuteCallback) {
                    console.info('exe Callback');
                    setTimeout(() => this.state.callback(), 100);
                    this.setState({isExecuteCallback: false});
                }
            }
        }

        let messageDialog;
        if (this.state.isDisplayMessage) {
            if (this.state.isHideMessage) {
                messageDialog = (
                    <MessageDialog onClickHideFunction={this.hideFunction} animationName='slideOutRight'>{this.state.message}</MessageDialog>
                );
            } else {
                messageDialog = (
                    <MessageDialog onClickHideFunction={this.hideFunction} animationName='slideInLeft'>{this.state.message}</MessageDialog>
                );
            }
        }

        return (
            <div>
                <DrawerMenu left={lastBottomIconLeft}>{drawerMenuIcons}</DrawerMenu>
                {flipPanel}
                {bottomFloatIcons}
                <SearchPanel masterName={this.props.masterName} panelStyle={searchPanelStyle} screenData={this.state.screenSettingData} selectFunction={this.selectFunction}/> {loadingPanel}
                {messageDialog}
            </div>
        );
    }
});
export default Create;
