import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import AppSizes from '../theme/AppSizes';
import AppColors from '../theme/AppColors';
import Divider from '../modules/form/components/Divider';
import AppStyles from '../theme/AppStyles';
import { Localize } from '../modules/setting/languages/LanguageManager';
import messages from '../constant/Messages';

const Snackbar = ({ label = " ", title = " ", content = " ", visible = true, onRequestClose }) => {


    if (visible) {
        return <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.textContentContianer}>
                    <Text style={styles.labelText}>{label.toLocaleUpperCase()}</Text>
                    <View style={{ paddingLeft: AppSizes.paddingMedium }} >
                        <Text style={styles.labelText} numberOfLines={1}>{title}</Text>
                        <Text style={styles.contentText} numberOfLines={2}>{content}</Text>

                    </View>
                </View>
                <Divider vertical color={'white'} style={{ marginLeft: AppSizes.paddingMedium, marginRight: AppSizes.paddingMedium }} />
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', }} onPress={() => onRequestClose && onRequestClose()}>
                    <Text style={styles.closeText} >{Localize(messages.close).toLocaleUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    } else {
        return <View />
    }

}


export default Snackbar;

const styles = {
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingBottom: AppSizes.paddingMedium

    },
    contentContainer: {
        flexDirection: 'row',
        backgroundColor: AppColors.abi_blue,
        borderRadius: AppSizes.paddingTiny,
        padding: AppSizes.paddingMedium
    },
    textContentContianer: {
        flexDirection: 'row',
        flex: 8,
        alignItems: 'center'
    },
    labelText: {
        ...AppStyles.semiboldText,
        fontSize: AppSizes.fontXMedium,
        lineHeight: 24,
        letterSpacing: 0.5,
        color: 'white'
    },
    titleText: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXMedium,
        lineHeight: 24,
        letterSpacing: 0.5,
        color: 'white'
    },
    contentText: {
        ...AppStyles.regularText,
        color: 'white'
    },
    closeText: {
        ...AppStyles.regularText,
        color: AppColors.orange,
        fontSize: AppSizes.fontXMedium,
        lineHeight: 24,
        letterSpacing: 0.5,
    }
}

