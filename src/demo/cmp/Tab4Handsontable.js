import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// reactが(?)onTouchtopイベントとかに対応していないため、プラグインで補強する
// Material-UIが上記のReact非対応イベントを使っているため、いれないと動かない(version15以降で非対応になったらしい)
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import Handsontable from './Handsontable';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    }
};

function handleActive(tab) {
    alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
}

var Tab4Handsontable = React.createClass({
    getInitialState: function() {
        // console.log('constructor');
        return {screenSettingData: this.props.screenSettingData, flag: true}
    },
    onActive: function(tab) {
        this.setState({
            flag: !this.state.flag
        });
    },
    onChange: function() {
        this.setState({
            flag: !this.state.flag
        });
    },
    render() {
        // console.info('tabRender!!');
        var excelSheets = [];
        Object.keys(this.props.screenSettingData.tabInfo).forEach(function(key) {
            var tabInfo = this.props.screenSettingData.tabInfo[key];
            // Handsontable設定が無い場合があるので判定する
            var settings = tabInfo.settings
                ? tabInfo.settings
                : {};
            excelSheets.push((
                <Tab label={tabInfo.tabName} onActive={this.onActive}><Handsontable tabInfo={tabInfo} settings={settings} containerId={tabInfo.tabId}/></Tab>
            ));
        }, this);
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <Tabs onChange={this.onChange}>
                    {excelSheets}
                </Tabs>
            </MuiThemeProvider>
        );
    }
});

export default Tab4Handsontable;
