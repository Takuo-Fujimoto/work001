import React, {Components} from 'react';
import dialogCSS from './../../lib/css/dialog.css';
import dialogWilmaCSS from './../../lib/css/dialog-wilma.css';
import $ from 'jquery';

let MessageDialog = React.createClass({
    getInitialState: function() {
        let styles = {
            popHeader: {
                fontFamily: '"Gochi Hand", cursive, HGMaruGothicMPRO',
                fontSize: '2.1em'
            },
            popMessage: {
                fontFamily: '"Gochi Hand", cursive, HGMaruGothicMPRO',
                whiteSpace: 'nowrap'
            }
        }
        return ({styles: styles});
    },
    componentDidMount: function() {},
    componentWillUnmount: function() {},
    startDialogClick: function(e) {
        $('#somedialog').data('clickPointX', e.pageX - $('#somedialog').offset().left).data('clickPointY', e.pageY - $('#somedialog').offset().top);
        $(document).mousemove(function(e){
            $("#somedialog").css({
                top:e.pageY  - $("#somedialog").data("clickPointY")+"px",
                left:e.pageX - $("#somedialog").data("clickPointX")+"px"
            });
        });
    },
    endDialogClick: function(e) {
        $(document).unbind("mousemove");
    },
    onClickHideButton: function(e) {
        if (this.props.onClickHideFunction) {
            this.props.onClickHideFunction();
        }
    },
    render() {
        let animationName = 'dialog dialog--open animatedDelay ' + this.props.animationName;
        let messages = this.props.children.map(function(message, index) {
            return (
                <div>
                    <span style={this.state.styles.popMessage}>Error{index + 1}
                        : {message}</span>
                </div>
            );
        }, this);
        // メッセージ1行30px メッセージが多くてメッセージ領域がページの80%よりもデカくなるようなら制限
        let dialogHeight = window.innerHeight * 0.8 < this.props.children.length * 30 ? window.innerHeight * 0.8 : this.props.children.length * 39;
        let messageAreaHeight = dialogHeight * 0.8;
        return (
            <div id='somedialog' className={animationName} style={{height: dialogHeight + 'px'}}>
                <div className='dialog__content'>
                    <div className='morph-shape'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 560 280' preserveAspectRatio='none'>
                            <rect x='3' y='3' fill='none' width='556' height='276' rx='5' ry='5'/>
                        </svg>
                    </div>
                    <div className='dialogHeader' onMouseDown={this.startDialogClick} onMouseUp={this.endDialogClick}>
                        <span style={this.state.styles.popHeader}>Error!!!</span>
                    </div>
                    <div className='dialog-inner'>
                        <div id='messageArea' style={{height: messageAreaHeight + 'px'}}>
                            {messages}
                        </div>
                        <div>
                            <button className='action' data-dialog-close onClick={this.onClickHideButton}>Hide</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
export default MessageDialog;
