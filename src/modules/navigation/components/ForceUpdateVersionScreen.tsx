import React from 'react';
import { Component } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppInfo from '../../../utils/AppInfoUtils';
import { Localize } from '../../setting/languages/LanguageManager';

class ForceUpdateVersionScreen extends Component {

    componentDidMount() {

    }
    //UI CONTROL ---------------------------------------------------------------------------------

    //Open to play store with android and app store with ios 
    openLinkStore() {
        Linking.openURL(AppInfo.getUrlStore());
    }
    //UI RENDER ----------------------------------------------------------------------------------
    render() {
        const oldVersion = Localize(messages.oldVersion)
        const pleaseUpdateVersion = Localize(messages.pleaseUpdateVersion)
        return <View style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.header}>
                    <Text style={{ color: 'white', marginTop: 16, marginBottom: 16 }}>{oldVersion}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={{ color: 'grey' }}>{pleaseUpdateVersion}</Text>
                </View>
                <TouchableOpacity style={styles.containerUpdate} onPress={() => { this.openLinkStore() }}>
                    <Text style={{ color: 'white' }}>{Localize(messages.update)}</Text>
                </TouchableOpacity>

            </View>
        </View>
    }
};

// Redux
const mapStateToProps = state => ({

})

// Any actions to map to the component?
const mapDispatchToProps = {

}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ForceUpdateVersionScreen);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: AppSizes.screenHeight,
        backgroundColor: AppColors.lightgray,
    },
    mainContent: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: AppColors.abi_blue,
        alignItems: 'center',
        width: AppSizes.screenWidth - 40
    },
    content: {
        padding: 30,
        backgroundColor: 'white',
    },
    containerUpdate: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: AppColors.abi_blue,
        marginBottom: 16,
        borderWidth: 0.5,
        borderRadius: 5

    }
})
