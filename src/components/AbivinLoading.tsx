import React from "react";
import { Component } from "react";
import { Animated, Easing, Image, View } from 'react-native';
import IconAssets from "../assets/IconAssets";
import { AbstractProps, AbstractStates } from "../base/AbstractProperty";
import AppColors from '../theme/AppColors';

interface Props extends AbstractProps {
    /** Chiều rông, cao của ảnh*/
    size:number;
}

interface States extends AbstractStates {}

class AbivinLoading extends Component<Props, States> {
    loadingValue: Animated.Value;
    constructor(props) {
        super(props)
        this.loadingValue = new Animated.Value(0)
    }
    componentDidMount() {
        this.loadingOn()
    }
    loadingOn() {
        this.loadingValue.setValue(0)
        Animated.timing(
            this.loadingValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.loadingOff())
    }
    loadingOff() {
        this.loadingValue.setValue(1)
        Animated.timing(
            this.loadingValue,
            {
                toValue: 0,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.loadingOn())
    }
    componentWillUnmount() {
        this.stopAnimated()
    }

    stopAnimated() {
        this.loadingValue.stopAnimation((value) => console.log("Final Value: " + value))
    }
    render() {
        const { size } = this.props
        const height = this.loadingValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, size]
        })
        return (<View style={{ width: size, height: size, }}>

            <Animated.View
                style={{
                    width: size,
                    height: height,
                    backgroundColor: AppColors.abi_blue,

                }}
            />
            <Image source={IconAssets.iconAbivinWhite} style={{ position: 'absolute', height: size, width: size, resizeMode: 'stretch' }} />

        </View>


        );
    }
};


export default AbivinLoading;
