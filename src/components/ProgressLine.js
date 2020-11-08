import React, { Component } from 'react';
import {
    View,
    Animated,
    Easing
} from 'react-native';
import AppColors from '../theme/AppColors';
import AppStyles from '../theme/AppStyles';
import AppSizes from '../theme/AppSizes';


class ProgressLine extends Component {

    constructor(props) {
        super(props)
        this.state = {
            widthProgress: 0,

            progress: props.progress,
            withAll: 100

        }
        this.loadingValue = new Animated.Value(0)
    }
    componentDidUpdate() {
        this.widthPro = (this.state.progress / 100) * this.state.withAll
        if (this.widthPro !== this.state.widthProgress) {
            this.setState({
                widthProgress: this.widthPro
            }, () => this.loadingOn())

        }

    }
    loadingOn() {
        Animated.timing(
            this.loadingValue,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.linear
            }
        ).start();

    }
    componentWillReceiveProps(newProps) {
        if (newProps.progress !== this.props.progress) {
            this.setState({ widthProgress: 0, progress: newProps.progress })
        }
    }
    render() {
        const width = this.loadingValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.widthProgress]
        })
        return (
            <View
                onLayout={(event) => {
                    var { x, y, width, height } = event.nativeEvent.layout;
                    this.setState({ withAll: width })

                }}
                style={{ height: AppSizes.paddingXXSml, width: '100%', backgroundColor: AppColors.textSecondary, borderRadius: AppSizes.paddingXXSml / 2 }}>
                <Animated.View style={{ height: AppSizes.paddingXXSml, width, backgroundColor: AppColors.green, borderRadius: AppSizes.paddingXXSml / 2 }} />
            </View>
        );
    }
}


export default ProgressLine