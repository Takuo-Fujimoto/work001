import React, {Component} from 'react';
import $ from 'jquery';

let LinkCard = React.createClass({

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
        if (this.props.isClick) {
            return;
        }

        // その他のカードをフェードアウトさせると残ったコンポーネントが画面の中央へ移動する。
        let clickedId = this.props.cardData.id;
        let clickedName = this.props.cardData.name;
        if (this.props.onClickFunction) {
            this.props.onClickFunction(clickedId, clickedName);
        }
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
        // console.info(heightOffset + ' / ' + cardHeight);
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
        if (this.props.isClick) {
            // console.info('rollOutBack :' + this.props.cardData.id);
            cardClass = cardClass + ' '  + this.props.onClickClass;
        } else {
            if (this.state.initialRender) {
                // console.info('initialRender :' + this.props.cardData.id);
                cardClass = cardClass + ' '  + this.props.initialClass;
                if (this.props.initialStyle) {
                    cardStyle = {...cardStyle, ...this.props.initialStyle};
                }
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

export default LinkCard;
