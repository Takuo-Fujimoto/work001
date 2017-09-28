import React, {Components} from 'react';
import tooltipCSS from './../../lib/css/tooltip-curved.css';
import $ from 'jquery';
import Gridimg from './../svg/GridImg';
import Headerimg from './../svg/HeaderImg';
import Plantimg from './../svg/PlantImg';
import KamiHikoukiimg from './../svg/KamiHikouki';
import KamiHikoukiBlackimg from './../svg/KamiHikoukiBlack';
import SearchShadowimg from './../svg/SearchShadow';
import CheckSquareimg from './../svg/CheckSquare';
import Pikoonimg from './../svg/Pikoon';
import CatHandimg from './../svg/CatHand';

let iconMap = {
    'Header': Headerimg,
    'T001': Gridimg,
    'T002': Plantimg,
    'applyButton': KamiHikoukiimg,
    'saveButton': KamiHikoukiBlackimg,
    'searchButton': SearchShadowimg,
    'checkButton': CheckSquareimg,
    'fillButton': Pikoonimg,
    'helpButton': CatHandimg
}

// アイコンの色 上から 選択中、ホバー状態、それ以外のなんもしてないとき
const selectedSVGColor = 'tomato';
const hoverSVGColor = 'lavender';
// const defaultSVGColor = 'slategray';
const defaultSVGColor = '#65ace4';

let FixedIconButton = React.createClass({
    getInitialState: function() {
        const styles = {
            floatingIcon: {
                zIndex: '3',
                width: '50px',
                height: '50px'
            },
            floatingDiv: {
            }
        }
        return {styles: styles, isHover: false}
    },
    onHoverStateChange: function(e) {
        console.info(e.target.id);
        this.setState({
            isHover: !this.state.isHover
        });
    },
    onClick: function(e) {
        if (this.props.clickFunction) {
            this.props.clickFunction(e);
        }
    },
    render() {
        if (this.props.top) {
            this.state.styles.floatingDiv.position = 'fixed';
            this.state.styles.floatingDiv.top = this.props.top + 'px';
        }
        if (this.props.left) {
            this.state.styles.floatingDiv.position = 'fixed';
            this.state.styles.floatingDiv.left = this.props.left + 'px';
        }
        let iconStyle = this.state.styles.floatingIcon;
        if (this.props.selectedId === this.props.id) {
            iconStyle.fill = selectedSVGColor;
        } else {
            if (this.state.isHover) {
                iconStyle.fill = hoverSVGColor;
            } else {
                if (this.props.defaultColor) {
                    iconStyle.fill = this.props.defaultColor;
                } else {
                    iconStyle.fill = defaultSVGColor;
                }
            }
        }
        const SvgImg = iconMap[this.props.id];
        return (
            <div onClick={this.onClick} id={this.props.id} className='tooltip tooltip-east' style={{...this.state.styles.floatingDiv, ...this.props.divStyle}}>
                <div style={{zIndex: '1000', width:'2.2em', height: '2.2em'}} onMouseEnter={this.onHoverStateChange} onMouseLeave={this.onHoverStateChange}>
                <SvgImg id={this.props.id} style={iconStyle} color={{
                    fill: iconStyle.fill
                }}></SvgImg>
                </div>
                <span className="tooltip-content" onClick={this.onClick} id={this.props.id}>{this.props.tooltip}</span>
            </div>
        );
    }
});
export default FixedIconButton;
