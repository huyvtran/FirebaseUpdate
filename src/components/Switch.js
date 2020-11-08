import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableWithoutFeedback,
    ViewPropTypes, 
    
} from "react-native";
import PropTypes from "prop-types";
import AppColors from "../theme/AppColors";
import AppSizes from "../theme/AppSizes";

class Switch extends Component {
    static propTypes = {
        onValueChange: PropTypes.func,
        disabled: PropTypes.bool,
        activeText: PropTypes.string,
        inActiveText: PropTypes.string,
        backgroundActive: PropTypes.string,
        backgroundInactive: PropTypes.string,
        value: PropTypes.bool,
        circleActiveColor: PropTypes.string,
        circleInActiveColor: PropTypes.string,
        circleSize: PropTypes.number,
        circleBorderActiveColor: PropTypes.string,
        circleBorderInactiveColor: PropTypes.string,
        activeTextStyle: PropTypes.object,
        inactiveTextStyle: PropTypes.object,
        containerStyle: PropTypes.object,
        barHeight: PropTypes.number,
        circleBorderWidth: PropTypes.number,
        innerCircleStyle: PropTypes.object,
        renderInsideCircle: PropTypes.func,
        changeValueImmediately: PropTypes.bool,
        innerCircleStyle: PropTypes.object,
        outerCircleStyle: PropTypes.object,
        renderActiveText: PropTypes.bool,
        renderInActiveText: PropTypes.bool,
        switchLeftPx: PropTypes.number,
        switchRightPx: PropTypes.number,
        switchWidthMultiplier: PropTypes.number,
        switchBorderRadius: PropTypes.number
    };

    static defaultProps = {
        value: false,
        onValueChange: () => null,
        renderInsideCircle: () => null,
        innerCircleStyle: {},
        disabled: false,
        activeText: "On",
        inActiveText: "Off",
        backgroundActive: AppColors.abi_blue,
        backgroundInactive: AppColors.abi_blue,
        circleActiveColor: AppColors.white,
        circleInActiveColor: AppColors.white,
        circleActiveBorderColor: AppColors.abi_blue,
        circleInactiveBorderColor: AppColors.abi_blue,
        circleSize: 30,
        barHeight: null,
        circleBorderWidth: AppSizes.paddingMicro * 2,
        changeValueImmediately: true,
        innerCircleStyle: { alignItems: "center", justifyContent: "center" },
        outerCircleStyle: {},
        renderActiveText: true,
        renderInActiveText: true,
        switchLeftPx: 2.5,
        switchRightPx: 2.5,
        switchWidthMultiplier: 6,
        switchBorderRadius: null
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: props.value,
            transformSwitch: new Animated.Value(
                // props.value
                //     ? props.circleSize / props.switchLeftPx
                //     : -props.circleSize / props.switchRightPx
                props.value
                    ? AppSizes.paddingXXMedium
                    : -AppSizes.paddingLarge
            ),
            backgroundColor: new Animated.Value(props.value ? AppSizes.paddingSml * 5 : -AppSizes.paddingSml * 5),
            circleColor: new Animated.Value(props.value ? AppSizes.paddingSml * 5 : -AppSizes.paddingSml * 5),
            circleBorderColor: new Animated.Value(props.value ? AppSizes.paddingSml * 5 : -AppSizes.paddingSml * 5)
        };
    }

    componentDidUpdate(prevProps) {
        const { value, disabled } = this.props;
        if (prevProps.value === value) {
            return;
        }
        if (prevProps.disabled && disabled === prevProps.disabled) {
            return;
        }

        this.animateSwitch(value, () => this.setState({ value }));
    }

    handleSwitch = () => {
        const { value } = this.state;
        const {
            onValueChange,
            disabled,
            changeValueImmediately,
            value: propValue
        } = this.props;
        if (disabled) {
            return;
        }

        if (changeValueImmediately) {
            this.animateSwitch(!propValue);
            onValueChange(!propValue);
        } else {
            this.animateSwitch(!value, () =>
                this.setState({ value: !value }, () => onValueChange(this.state.value))
            );
        }
    };

    animateSwitch = (value, cb = () => { }) => {
        Animated.parallel([
            Animated.spring(this.state.transformSwitch, {
                toValue:
                    value
                        ? AppSizes.paddingXXMedium
                        : -AppSizes.paddingLarge
            }),
            Animated.timing(this.state.backgroundColor, {
                toValue: value ? AppSizes.paddingSml * 5 : -AppSizes.paddingSml * 5,
                duration: 200
            }),
            Animated.timing(this.state.circleColor, {
                toValue: value ? AppSizes.paddingSml * 5 : -AppSizes.paddingSml * 5,
                duration: 200
            }),
            Animated.timing(this.state.circleBorderColor, {
                toValue: value ? AppSizes.paddingSml * 5 : -AppSizes.paddingSml * 5,
                duration: 200
            })
        ]).start(cb);
    };

    render() {
        const {
            transformSwitch,
            backgroundColor,
            circleColor,
            circleBorderColor
        } = this.state;

        const {
            backgroundActive,
            backgroundInactive,
            circleActiveColor,
            circleInActiveColor,
            activeText,
            inActiveText,
            circleSize,
            containerStyle,
            activeTextStyle,
            inactiveTextStyle,
            barHeight,
            circleInactiveBorderColor,
            circleActiveBorderColor,
            circleBorderWidth,
            innerCircleStyle,
            outerCircleStyle,
            renderActiveText,
            renderInActiveText,
            renderInsideCircle,
            switchWidthMultiplier,
            switchBorderRadius,
            value
        } = this.props;

        const interpolatedColorAnimation = backgroundColor.interpolate({
            inputRange: [-AppSizes.paddingSml * 5, AppSizes.paddingSml * 5],
            outputRange: [backgroundInactive, backgroundActive]
        });

        const interpolatedCircleColor = circleColor.interpolate({
            inputRange: [-AppSizes.paddingSml * 5, AppSizes.paddingSml * 5],
            outputRange: [circleInActiveColor, circleActiveColor]
        });

        const interpolatedCircleBorderColor = circleBorderColor.interpolate({
            inputRange: [-AppSizes.paddingSml * 5, AppSizes.paddingSml * 5],
            outputRange: [circleInactiveBorderColor, circleActiveBorderColor]
        });

        return (
            <TouchableWithoutFeedback onPress={this.handleSwitch}>
                <Animated.View
                    style={[
                        styles.container,
                        containerStyle,
                        {
                            backgroundColor: interpolatedColorAnimation,
                            // width: circleSize * switchWidthMultiplier,
                            height: barHeight || circleSize,
                            borderRadius: switchBorderRadius || circleSize
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            {
                                left: transformSwitch,
                                // width: circleSize * switchWidthMultiplier
                            },
                            outerCircleStyle
                        ]}
                    >
                        {value && renderActiveText && (
                            <Text style={[styles.text, styles.paddingRight, activeTextStyle && activeTextStyle]}>
                                {activeText}
                            </Text>
                        )}

                        <Animated.View
                            style={[
                                styles.circle,
                                {
                                    borderWidth: circleBorderWidth,
                                    borderColor: interpolatedCircleBorderColor,
                                    backgroundColor: interpolatedCircleColor,
                                    width: circleSize,
                                    height: circleSize,
                                    borderRadius: circleSize / 2
                                },
                                innerCircleStyle
                            ]}
                        >
                            {renderInsideCircle()}
                        </Animated.View>
                        {!value && renderInActiveText && (
                            <Text
                                style={[styles.text, styles.paddingLeft, inactiveTextStyle]}
                            >
                                {inActiveText}
                            </Text>
                        )}
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: AppSizes.paddingSml * 10,
        height: AppSizes.paddingSml * 3,
        borderRadius: AppSizes.paddingSml * 3,
        backgroundColor: "black",
        borderWidth: AppSizes.paddingMicro,
        borderColor: AppColors.lightgray,
        elevation: 1,
        shadowColor: AppColors.border,
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: { height: 1, width: 0 },
        justifyContent: "center",
        alignItems: "center"
    },
    animatedContainer: {
        flex: 1,
        width: AppSizes.paddingSml * 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: AppSizes.paddingXSml
    },
    circle: {
        width: AppSizes.paddingSml * 3,
        height: AppSizes.paddingSml * 3,
        borderRadius: AppSizes.paddingSml * 3 / 2,
        backgroundColor: "white"
    },
    text: {
        color: AppColors.white,
        backgroundColor: "transparent"
    },
    paddingRight: {
        paddingRight: AppSizes.paddingSml / 2
    },
    paddingLeft: {
        paddingLeft: AppSizes.paddingSml / 2
    }
});

export default Switch