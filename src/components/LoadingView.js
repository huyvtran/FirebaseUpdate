import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
class LoadingView extends Component {
    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1, height: '100%', width: '100%' }}>
                <ActivityIndicator />
            </View>
        )
    }
}
export default LoadingView;
