import React, {Component} from 'react';
import $ from 'jquery';
import dataJson from '../data/data_ja.json'
import FlexContainer from './FlexContainer.jsx';
import {browserHistory} from 'react-router';

let clickedId = '';
let clickedName = '';

let ImageCardItem = React.createClass({

    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState: function() {
        // 正円にするために、大きい値を指定する（固定値）
        const radiusLength = '10000px';

        const styles = {
            card: {
                margin: '0px 15px 15px',
                opacity: '1'
            },
            radiusImgContainer: {
                borderRadius: radiusLength,
                border: '5px solid #ff3e7c',
                boxShadow: '0px 0px 10px #ccc, inset 0 px 0 px 10 px rgba(0, 0, 0, 0.8)',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
                backgroundSize: 'cover'
            },

            fadeInTextBlock: {},
            fadeInBlock: {},

            fadeInBlockBefore: {
                borderRadius: radiusLength + ' 0px' + ' 0px ' + radiusLength
            },

            fadeInBlockAfter: {
                borderRadius: '0px ' + radiusLength + ' ' + radiusLength + ' 0px'
            },

            fadeInBlockBeforeHover: {
                WebkitTransform: 'translateX(0px) skew(0)',
                transform: 'translateX(0px) skew(0)',
                borderRadius: radiusLength
            },

            fadeInBlockAfterHover: {
                WebkitTransform: 'translateX(0px) skew(0)',
                transform: 'translateX(0px) skew(0)',
                borderRadius: radiusLength
            },
            highJamp: {
                animation: 'highJamp 0.4s linear',
                position: 'relative'
            },
            moveCenter: {
                transition: 'all 2s ease-in-out'
            },
            fadeOut: {
                opacity: '0'
            }
        };
        return {
            hover: false,
            pop: false,
            styles: styles,
            initialRender: true,
            itemCount: this.props.itemCount,
            flag: false
        }
    },
    toggleHover: function() {
        this.setState({initialRender: false});
        this.setState({
            hover: !this.state.hover
        });
        let x = Math.random();
        if (x < 0.05) {
            this.setState({pop: true});
        } else {
            this.setState({pop: false});
        }
    },
    onClick: function(e) {
        this.setState({initialRender: false});
        if (clickedId) {
            return;
        }

        // その他のカードをフェードアウトさせると残ったコンポーネントが画面の中央へ移動する。
        clickedId = this.props.cardData.id;
        clickedName = this.props.cardData.name;

        // 子カードを表示する。埋め込みの別画面を表示する
        browserHistory.push('/works/' + clickedId);
    },
    componentDidMount: function() {
        window.addEventListener("resize", this.resizeCard);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.resizeCard);
    },
    resizeCard: function() {
        this.setState({
            flag: !this.state.flag
        });
    },
    calcLength: function() {

        // カードを1行にいくつ表示するか
        // 1. 3 or 4で割り切れるならその数値（4優先）
        // 2. できるだけ、端数が揃ってる行と近い数にしたいので、割った余りと３，４それぞれの差を比較する。
        //    3で割った余りの差が4で割った余りの差より小さければ3, そうでなければ4
        let itemCount = this.props.itemCount <= 4
            ? this.props.itemCount
            : this.props.itemCount % 4 === 0
                ? 4
                : this.props.itemCount % 3 === 0
                    ? 3
                    : (3 - (this.props.itemCount % 3)) < (4 - (this.props.itemCount % 4))
                        ? 3
                        : 4;

        let windowWidth = window.innerWidth;
        let cardLength = windowWidth / (itemCount + 0.1);
        let windowHeight = window.innerHeight;
        let heightOffset = (windowHeight / 220).toFixed(2);
        let cardHeight = windowHeight / (heightOffset > 2
            ? 2
            : heightOffset);
        console.info(heightOffset + ' / ' + cardHeight);
        // フェードインブロックの画像中心位置からの距離
        let fadeInBlockStartMargin = cardHeight + (cardHeight / 5);
        let cardImageHeight = cardHeight - 20;
        // フェードインテキストの幅(左右25px余白)
        let textWidth = cardHeight - 50;
        this.state.styles.card.height = cardHeight + 'px';
        this.state.styles.card.width = cardHeight + 'px';
        this.state.styles.radiusImgContainer.height = cardImageHeight + 'px';
        this.state.styles.radiusImgContainer.width = cardImageHeight + 'px';
        this.state.styles.fadeInTextBlock.height = textWidth + 'px';
        this.state.styles.fadeInTextBlock.width = textWidth + 'px'
        this.state.styles.fadeInBlock.height = cardHeight + 'px';
        this.state.styles.fadeInBlock.width = cardHeight + 'px'
        this.state.styles.fadeInBlockBefore.WebkitTransform = 'translateX(-' + fadeInBlockStartMargin + 'px) skew(-45deg)';
        this.state.styles.fadeInBlockBefore.transform = 'translateX(-' + fadeInBlockStartMargin + 'px) skew(-45deg)';
        this.state.styles.fadeInBlockAfter.WebkitTransform = 'translateX(' + fadeInBlockStartMargin + 'px) skew(-45deg)';
        this.state.styles.fadeInBlockAfter.transform = 'translateX(' + fadeInBlockStartMargin + 'px) skew(-45deg)';
    },

    render: function() {
        this.calcLength();
        // console.info('CardRender!!!! ' + this.props.cardData.id + ' / clicked: ' + clickedId);

        let bakImageContainer = {};
        // DeepCopy
        Object.assign(bakImageContainer, this.state.styles.radiusImgContainer);
        // backGroundImage Add
        bakImageContainer.backgroundImage = `url(${this.props.imageData[this.props.cardData.id]})`;

        let fadeInBlockBeforeStyle;
        let fadeInBlockAfterStyle;
        if (this.state.hover) {
            fadeInBlockBeforeStyle = this.state.styles.fadeInBlockBeforeHover;
            fadeInBlockAfterStyle = this.state.styles.fadeInBlockAfterHover;
        } else {
            fadeInBlockBeforeStyle = this.state.styles.fadeInBlockBefore;
            fadeInBlockAfterStyle = this.state.styles.fadeInBlockAfter;
        }
        let cardStyle;

        // 非表示処理 クリックIDが存在して、それが自分じゃない場合は、非表示
        // まず、クリックIDのコンテナを判別して、自分のコンテナにクリックがされているか

        let fadeInTextBlockStyle = this.state.styles.fadeInTextBlock;
        let fadeInBlockStyle = this.state.styles.fadeInBlock

        let descriptionText = this.props.cardData.description;

        if (this.state.pop) {
            cardStyle = {
                ...this.state.styles.card,
                ...this.state.styles.highJamp
            };
        } else {
            cardStyle = {
                ...this.state.styles.card
            };
        }
        let cardClass = 'imageContainer type3';
        if (clickedId) {
            console.info('rollOutBack :' + this.props.cardData.id);
            cardClass = cardClass + ' rollOutBack'
        } else {
            if (this.state.initialRender) {
                console.info('initialRender :' + this.props.cardData.id);
                cardClass = cardClass + ' rollInDelay'
                cardStyle.WebkitTransform = 'translate3d(-' + ((this.props.index * 500) + 300) + '%, 0, 0) rotate3d(0, 0, 1, -720deg)';
                cardStyle.transform = 'translate3d(-' + ((this.props.index * 500) + 300) + ', 0, 0) rotate3d(0, 0, 1, -720deg)';
            }
        }

        return (
            <div id={this.props.cardData.id} className={cardClass} style={cardStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.onClick}>
                <div style={bakImageContainer} className='imageImage centerItem'/>
                <div style={{
                    ...fadeInBlockStyle,
                    ...fadeInBlockBeforeStyle
                }} className='fadeInBlock'/>
                <dl style={fadeInTextBlockStyle}>
                    <dt>{this.props.cardData.name}</dt>
                    <dd>{descriptionText}</dd>
                </dl>
                <div style={{
                    ...fadeInBlockStyle,
                    ...fadeInBlockAfterStyle
                }} className='fadeInBlock'/>
            </div>
        );
    }
});

let ImageCard = React.createClass({

    getInitialState: function() {
        return {flag: true};
    },
    onClick: function(e) {
        // console.info('containerClick!');
        this.setState({
            flag: !this.state.flag
        });
    },

    render: function() {
        // console.info('containerRender!');

        let namePainStyle = {
            width: '100%',
            background: 'rgba(205, 92, 92, .9)',
            display: 'none',
            textAlign: 'center',
            color: 'white',
            fontSize: '20px'
        };
        let invisible = false;
        if (clickedId) {
            namePainStyle.display = 'block';
            namePainStyle.animation = 'fadeIn 2s ease';
            namePainStyle.WebkitAnimation = 'fadeIn 2s ease';
            invisible = true;
        }

        let masterNodes = this.props.data.map(function(cardData, index) {
            return (<ImageCardItem cardData={cardData} imageData={this.props.imageData} itemCount={this.props.data.length} index={this.props.data.length - index}/>);
        }, this);
        return (
            <div onClick={this.onClick}>
                <div style={namePainStyle}>{clickedName}</div>
                <FlexContainer invisible={invisible}>{masterNodes}</FlexContainer>
            </div>
        );
    }
});

export default ImageCard;

/* 「...」はオブジェクトの展開演算子 二つのオブジェクトを、オブジェクトの中でそれぞれ展開することでマージされたオブジェクトが生成される。*/
