import React, {Components} from 'react';
import JuroInput from './JuroInput';
import IconTextButton from './IconTextButton';
import {callService} from './HttpRequestUtil';
import SimpleTable from './SimpleTable';
import LoadingPanel from './LoadingPanel.js';

let SearchPanel = React.createClass({

    getInitialState: function() {
    const styles = {
        loadingPanelStyle: {
            backgroundColor: '#6b80bc',
            color: '#e8b001'
        }
    };
        return {styles: styles, isDisplayLoading: false, isDisplayResult: false}
    },
    displayLoading: function() {
        this.setState({isDisplayLoading: true});
        this.setState({isDisplayResult: false});
    },
    search: function() {
        // console.log('search');
        let requestData = {
            masterId: this.props.screenData.masterId,
            searchConditions: []
        };
        let tabArray = Object.keys(this.props.screenData.searchItems).forEach(function(key) {
            this.props.screenData.searchItems[key].forEach(function(itemId) {
                let searchItemInfo = this.props.screenData.tabInfo[key].itemInfo[itemId];
                let searchParam = {};
                searchParam[searchItemInfo.sapColumnName] = this.state[itemId];
                requestData.searchConditions.push(searchParam);
            }, this);
        }, this);
        let searchResult = callService('/mcm/mcmmock/searchMasterData', {
            async: true,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: this.displayResult
        });

    },
    displayResult: function(data) {
        console.info('success');
        this.state['searchResult'] = data.searchResult;
        this.state['displayResult'] = data.displayResult;
        this.state['isDisplayResult'] = true;
        this.forceUpdate();
    },
    onChangeForChild(id, value) {
        var stateObject = function(id, value) {
            let returnObj = {};
            returnObj[id] = value;
            return returnObj;
        }(id, value);
        this.setState(stateObject);
    },

    select: function() {
        // console.log('select');
        let selectedData = {};
        let selectCount = 0;
        Object.keys(this.state.displayResult).forEach(function(key) {
            if (this.state.displayResult[key].isSelect) {
                selectCount++;
                Object.keys(this.state.searchResult[key]).forEach(function(itemId) {
                    if (selectedData[itemId]) {
                        selectedData[itemId].push(this.state.searchResult[key][itemId]);
                    } else {
                        let valueArray = [];
                        valueArray.push(this.state.searchResult[key][itemId]);
                        selectedData[itemId] = valueArray
                    }
                }, this)
            }
        }, this);
        if (selectCount === 0) {
            return;
        }
        this.setState({selectedData: selectedData});
        this.props.selectFunction(selectedData, selectCount);
        this.setState({searchResult: undefined});
        this.setState({displayResult: undefined});
    },
    render() {
        let searchItems = this.props.screenData.searchItems;
        let searchInputs = [];
        let tabArray = Object.keys(searchItems);
        tabArray.sort(function(a, b) {
            return (a < b)
                ? -1
                : (a > b)
                    ? 1
                    : 0;
        });
        tabArray.forEach(function(key) {
            searchItems[key].forEach(function(itemId) {
                let searchItemInfo = this.props.screenData.tabInfo[key].itemInfo[itemId];
                searchInputs.push((<JuroInput label={searchItemInfo.itemName} type={searchItemInfo.type} options={searchItemInfo.options} id={searchItemInfo.itemId} onChange={this.onChangeForChild} labelBackColor='#288ffe'/>));
            }, this);
        }, this);
        let resultPanel;
        if (this.state.isDisplayResult && this.state.searchResult) {
            if (Object.keys(this.state.searchResult).length > 0) {
                // console.info(this.state.displayResult);
                resultPanel = (
                    <div>
                        <SimpleTable tableData={this.state.displayResult}></SimpleTable>
                        <IconTextButton text='Select!!' icon='download' onClick={this.select}/>
                    </div>
                );
            } else {
                resultPanel = (
                    <div style={{
                        display: 'inline-block',
                        margin: '10px 0px 0px 20px',
                        fontFamily: '"Gochi Hand", cursive',
                        fontSize: '2.1em'
                    }}>No Result...</div>
                )
            }
        }
        let loadingPanel = (<div/>);
        if (this.state.isDisplayLoading) {
            if (this.state.isDisplayResult) {
                loadingPanel = (<LoadingPanel actionName='Searching' targetName={this.props.masterName} animationName='slideOutDown' panelStyle={this.state.styles.loadingPanelStyle}/>);
            } else {
                loadingPanel = (<LoadingPanel actionName='Searching' targetName={this.props.masterName} animationName='slideInDown' panelStyle={this.state.styles.loadingPanelStyle}/>);
                setTimeout(() => this.search(), 100);
            }
        }

        return (
            <div style={{
                ...this.props.panelStyle,
                ...{
                    width: window.innerWidth + 'px',
                    height: window.innerHeight + 'px',
                    backgroundColor: '#ffa500',
                    zIndex: '4',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    color: 'blue',
                    overflow: 'scroll'
                }
            }}>
                <span style={{
                    display: 'inline-block',
                    margin: '10px 0px 0px 20px',
                    fontFamily: '"Gochi Hand", cursive, HGMaruGothicMPRO',
                    fontSize: '2.1em'
                }}>Search {this.props.masterName}</span>
                <div>
                    {searchInputs}
                </div>
                <div>
                    <IconTextButton text='Search!!' icon='search' onClick={this.displayLoading}></IconTextButton>
                </div>
                <div>
                    {resultPanel}
                </div>
                {loadingPanel}
            </div>
        );
    }
});
export default SearchPanel;
