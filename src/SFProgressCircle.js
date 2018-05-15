
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
import Arc from "./Shapes/Arc"
var {
    Surface,
} = ART;
const CIRCLE = Math.PI * 2;
export default class SFProgressCircle extends Component {
    static propTypes = {
        tag: PropTypes.number,
        radius: PropTypes.number.isRequired,
        thickness: PropTypes.number,
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
        textColor: PropTypes.string,
        textFontSize: PropTypes.number,
        textFontWeight: PropTypes.string
    }
    static defaultProps={
        tag:0,
        thickness:1,
        trackTintColor:'white',
        progressTintColor:'rgba(64,169,255,1)',
        progress:0,
        edgeInside:0,
        borderWidth:0,
        borderColor:'rgba(230,230,230,1)',
        textComponent:true,
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
    }
    render_text = () => {
        if (typeof (this.props.textComponent) == 'boolean'){
            if (this.props.textComponent){
                return(
                    <Text style={{
                        fontSize:this.props.textFontSize,
                        color:this.props.textColor,
                        fontWeight:this.props.textFontWeight
                    }}>{parseInt(this.progress*100)+'%'}</Text>
                )
            }
        }else {
            return this.props.textComponent(this.progress,this.props.tag);
        }
        return null;
    }
    render_border = (radius,top,left) => {
        var {
            borderWidth,
            borderColor
        } = this.props;

        if (borderWidth > 0){
            return(
                <Arc
                    radius={radius}
                    offset={{top: top,left: left}}
                    startAngle={0}
                    endAngle={CIRCLE}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                />
            )
        }
    }
    render() {
        var {
            radius,
            thickness,
            progressTintColor,
            trackTintColor,
            edgeInside
        } = this.props;
        var width = radius*2;
        var height = width;
        var endAngle = CIRCLE * this.progress;
        var textWidth = width-thickness*2;

        return (
            <View style={[{
                width:width,
                height:height,
            },this.props.containerStyle]}>
                <Surface width={width} height={height}>
                    <Arc
                        radius={radius}
                        offset={{top: 0,left: 0}}
                        startAngle={0}
                        endAngle={CIRCLE}
                        stroke={trackTintColor}
                        strokeWidth={thickness}
                    />
                    {this.render_border(radius,0,0)}
                    {this.render_border(radius-thickness,thickness,thickness)}
                    <Arc
                        radius={radius-edgeInside}
                        offset={{top: edgeInside,left: edgeInside}}
                        startAngle={0}
                        endAngle={endAngle}
                        stroke={progressTintColor}
                        strokeWidth={thickness-2*edgeInside}
                    />
                </Surface>
                <View style={{
                    width:textWidth,
                    height:textWidth,
                    justifyContent:'center',
                    alignItems:'center',
                    position:'absolute',
                    left:thickness,
                    top:thickness,
                }}>
                    {this.render_text()}
                </View>

            </View>

        )
    }
}