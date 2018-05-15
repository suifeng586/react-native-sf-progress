
/**
 * Created by Joker on 2017-08-17.
 */
import React, {Component} from 'react'
import {
    Text,
    View,
    Animated,
    ART
} from 'react-native'
import PropTypes from 'prop-types'
var {
    Surface,
    Shape,
    Path
} = ART;
export default class SFProgressBar extends Component {
    static propTypes = {
        tag: PropTypes.number,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        containerStyle: PropTypes.object,
        trackTintColor: PropTypes.string,
        progressTintColor: PropTypes.string,
        progress: PropTypes.number,
        edgeInside: PropTypes.number,
        borderWidth: PropTypes.number,
        borderColor: PropTypes.string,
        textComponent: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object,
            PropTypes.func
        ]),
        textWidth: PropTypes.number,
        textColor: PropTypes.string,
        textLightColor: PropTypes.string,
        textFontSize: PropTypes.number,
        textFontWeight: PropTypes.string
    }
    static defaultProps={
        tag:0,
        trackTintColor:'white',
        progressTintColor:'rgba(64,169,255,1)',
        progress:0,
        edgeInside:0,
        borderWidth:0,
        borderColor:'rgba(230,230,230,1)',
        textComponent:true,
        textWidth:50,
        textColor:'black',
        textFontSize:12,
        textFontWeight:'bold'

    }

    constructor(props) {
        super(props)
        this.state = {
            progressAni : new Animated.Value(0)
        }
        this.animated = true;
        this.progress = 0;
    }
    getProgress = () => {
        return this.progress;
    }
    setProgress = (value,animated = true) => {
        if (value > 1.0){
            value = 1;
        }
        if (animated){
            Animated.timing(this.state.progressAni, {
                toValue: value,
                duration: 300,
            }).start()
        }else{
            this.state.progressAni.setValue(value);
        }
    }
    componentWillMount() {
        this.state.progressAni.addListener((event) => {
            if (this.animated){
                this.progress = event.value;
                this.forceUpdate();
            }
        });
    }
    componentDidMount() {
        this.setProgress(this.props.progress)
        console.log(typeof(this.props.textComponent))
    }
    render_text = (direction) => {
        if (typeof (this.props.textComponent) == 'boolean'){
            if (this.props.textComponent){
                var color = this.props.textColor;
                if (direction == 'left'){
                    if (this.props.textLightColor){
                        color = this.props.textLightColor;
                    }
                }

                return(
                    <Text style={{
                        fontSize:this.props.textFontSize,
                        color:color,
                        fontWeight:this.props.textFontWeight
                    }}>{parseInt(this.progress*100)+'%'}</Text>
                )
            }
        }else {
            return this.props.textComponent(this.progress,direction,this.props.tag);
        }
        return null;
    }
    render() {
        var barHeight = this.props.height-this.props.edgeInside*2;
        var barX = this.props.height/2-this.props.borderWidth;
        var barY = this.props.edgeInside-this.props.borderWidth;
        var pathX = this.progress*(this.props.width-this.props.height);
        var pathY = (this.props.height-this.props.edgeInside*2)/2;

        var textWidth = this.props.textWidth;
        var textLeft = this.props.height+pathX;
        var direction = 'right';
        if (textLeft > this.props.width-textWidth){
            textLeft = this.props.height+pathX-textWidth;
            direction = "left"
        }
        const path = new Path();
        path.moveTo(0,pathY);
        path.lineTo(pathX,pathY);
        var opacity = 1;
        if (this.progress == 0){
            opacity = 0;
        }

        return (
            <View style={[{
                width:this.props.width,
                height:this.props.height,
                backgroundColor:this.props.trackTintColor,
                borderRadius:this.props.height/2,
                overflow:'hidden',
                borderWidth:this.props.borderWidth,
                borderColor:this.props.borderColor
            },this.props.containerStyle]}>
                <Surface style={{
                    opacity:opacity
                }} width={this.props.width} height={this.props.height}>
                    <Shape
                        x={barX}
                        y={barY}
                        d={path}
                        stroke={this.props.progressTintColor}
                        strokeWidth={barHeight}>
                    </Shape>
                </Surface>
                <View style={{
                    width:textWidth,
                    height:barHeight,
                    justifyContent:'center',
                    alignItems:'center',
                    position:'absolute',
                    left:textLeft,
                    top:barY,
                }}>
                    {this.render_text(direction)}
                </View>

            </View>

        )
    }
}