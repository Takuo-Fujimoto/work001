import React, {Components} from 'react';

function randomCharactor(c) {

    //跳ねさせる要素をすべて取得
    let randomChar = document.getElementsByClassName(c);

    //for で総当たり
    for (let i = 0; i < randomChar.length; i++) {

        //クロージャー
        (function(i) {

            //i 番目の要素、テキスト内容、文字列の長さを取得
            let randomCharI = randomChar[i];
            let randomCharIText = randomCharI.textContent;
            let randomCharLength = randomCharIText.length;

            //何番目の文字を跳ねさせるかをランダムで決める
            let Num = ~~(Math.random() * randomCharLength);
            while ('' === randomCharIText.charAt(Num)) {
                Num = ~~(Math.random() * randomCharLength);
            }

            //跳ねさせる文字を span タグで囲む、それ以外の文字と合わせて再び文字列を作る
            let delayTime = Math.random();
            let newRandomChar = randomCharIText.substring(0, Num) + '<span style="-webkit-animation-delay: ' + delayTime + 's;animation-delay: ' + delayTime + 's;">' + randomCharIText.charAt(Num) + '</span>' + randomCharIText.substring(Num + 1, randomCharLength);
            randomCharI.innerHTML = newRandomChar;

            //アニメーションが終わったら再び関数を発火させる
            document.getElementsByClassName(c)[0].children[0].addEventListener("animationend", function() {
                randomCharactor(c);
            }, false);
        })(i);
    }
}

let LoadingPanel = React.createClass({

    getInitialState: function() {
        const styles = {
            popDiv: {
                display: 'inline-block',
                margin: 'auto',
                fontFamily: '"Gochi Hand", cursive, HGMaruGothicMPRO',
                fontSize: '4.1em',
                top: 'calc(' + (window.innerHeight / 2) + 'px - 1em)',
                textAlign: 'center',
                position: 'absolute',
                width: window.innerWidth + 'px',
                textShadow: '2px 2px 1px #0000ff, -2px 2px 1px #0000ff, 2px -2px 1px #0000ff, -2px -2px 1px #0000ff'
            }
        }
        return {styles: styles}
    },
    componentDidMount: function() {
        //クラス名が pyonpyon のクラスを跳ねさせる
        randomCharactor('pyonpyon');
        randomCharactor('pyonpyon');
    },
    componentWillUnmount: function() {},
    render() {
        let loadingName = this.props.loadingName;
        let animationName = 'animatedLightDelay ' + this.props.animationName;

        return (
            <div style={{
                ...{
                    width: window.innerWidth + 'px',
                    height: window.innerHeight + 'px',
                    backgroundColor: '#029300',
                    zIndex: '999',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    color: '#01e8cd',
                    overflow: 'scroll',
                    opacity: '0.5'
                },
                ...this.props.panelStyle
            }} className={animationName}>
                <div style={this.state.styles.popDiv}>
                    <span style={{
                        WebkitAnimationDelay: '0.7s',
                        animationDelay: '0.7s'
                    }} className="pyonpyon">Now</span>
                    &nbsp;
                    <span style={{
                        WebkitAnimationDelay: '0.1s',
                        animationDelay: '0.1s'
                    }} className="pyonpyon">{this.props.actionName}</span>
                    &nbsp;
                    <span style={{
                        WebkitAnimationDelay: '0.3s',
                        animationDelay: '0.3s'
                    }} className="pyonpyon">{this.props.targetName}</span>
                </div>
            </div>
        );
    }
});
export default LoadingPanel;
