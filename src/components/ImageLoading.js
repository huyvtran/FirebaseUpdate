import React, { Component } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import AppSizes from '../theme/AppSizes';

const styles = StyleSheet.create({
    containerItem: {
        height: '100%',
        width: '100%',
        resizeMode: 'stretch'
    }
})
class ImageLoading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isReady: false
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.source && this.props.source && nextProps.source.uri !== this.props.source.uri) {
            this.setState({ isReady: false })
        }
    }

    render() {
        const { source, height, width, resizeMode, style, onPress, onDelete } = this.props
        return (
            < TouchableOpacity disabled={!onPress} style={[{ height: height, width: width, }, style]} onPress={onPress && onPress}>
                <Image
                    style={[style, styles.containerItem]}
                    source={source}
                    resizeMode={resizeMode ? resizeMode : 'contain'}
                    resizeMethod={'resize'}
                    onLoadEnd={() => {
                        this.setState({ isReady: true })
                    }} />
                {!this.state.isReady && <ActivityIndicator style={{ position: 'absolute', top: '50%', left: '50%' }} />}
                {onDelete && <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: AppSizes.paddingSml * 3,
                        height: AppSizes.paddingSml * 3,
                        padding: AppSizes.paddingTiny,
                    }}
                    onPress={onDelete && onDelete}>
                    <Icon
                        name={'highlight-off'}
                        size={AppSizes.paddingXXLarge}
                        color={'white'}
                    />
                </TouchableOpacity>}
            </TouchableOpacity >
        );
    }
}

export default ImageLoading;