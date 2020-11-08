import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import AppColors from '../../theme/AppColors';
import Divider from '../form/components/Divider';
import AppStyles from '../../theme/AppStyles';
import { Actions } from 'react-native-router-flux';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import AppSizes from '../../theme/AppSizes';


class TrailerItem extends Component {
    render() {
        const { trailer, onPressItem } = this.props
        return (
            <TouchableOpacity style={styles.container} onPress={onPressItem && onPressItem}>
                <View style={{ flexDirection: 'row', marginBottom: AppSizes.paddingXSml }}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.containerImage}
                            source={require('../../assets/icon/iconTrailer.png')}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerCode}>{trailer.trailerCode}</Text>
                        <Text style={styles.containerSeal}>{Localize(messages.licensePlate) + ': ' + trailer.licensePlate}</Text>
                    </View>
                </View>

                <Divider width={AppSizes.screenWidth - 32} />
            </TouchableOpacity>

        );
    }
}
export default TrailerItem

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
    },
    imageContainer: {
        alignItems: 'center',
        backgroundColor: 'rgb(241,241,241)',
        borderRadius: AppSizes.paddingTiny,
        width: AppSizes.paddingSml * 7,
        height: AppSizes.paddingSml * 7,
        justifyContent: 'center',
        alignItems: 'center',
        padding: AppSizes.paddingXXMedium
    },
    containerImage: {
        height: AppSizes.paddingXXXLarge * 2,
        width: AppSizes.paddingXXXLarge * 2,
        resizeMode: 'contain',

    },
    contentContainer: {
        flex: 8,
        justifyContent: 'center',
        paddingHorizontal: AppSizes.paddingXSml
    },
    containerCode: {
        ...AppStyles.h4,
        color: AppColors.abi_blue,
        marginVertical: AppSizes.paddingXTiny
    },
    containerSeal: {
        ...AppStyles.regularText,
        marginVertical: AppSizes.paddingXTiny,

    },
}