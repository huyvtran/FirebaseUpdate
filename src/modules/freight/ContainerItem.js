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
import { Icon } from 'react-native-elements';
import AppSizes from '../../theme/AppSizes';

class ContainerItem extends Component {
    renderIconText = (iconName, content) => {
        return <View style={{ flexDirection: 'row', flex: 1, paddingRight: AppSizes.paddingXXSml, alignItems: 'center' }}>
            <Icon
                style={{ marginTop: AppSizes.paddingXSml }}
                size={AppSizes.paddingMedium}
                name={iconName}
                color={AppColors.textSubContent}
            />
            <Text style={[styles.containerSeal, { marginLeft: AppSizes.paddingXXSml, }]} numberOfLines={1} >{content}</Text>
        </View>
    }
    getInfoContainer = (container) => {
        const containerType = container.containerType ? container.containerType.containerTypeCode : 'Tunnel container';
        return containerType + ' | ' + container.grossWeight + ' ' + Localize(messages.tons)
    }

    renderLocationInfo = (departure, arrival) => {
        return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            {this.renderIconText('near-me', departure)}
            {this.renderIconText('swap-horiz', arrival)}
        </View>
    }

    render() {
        const { container, onPress, shipment, isBargeMode } = this.props
        if (!container) {
            return <View />
        }

        return (
            <TouchableOpacity style={styles.container} onPress={onPress && onPress}>
                <View style={{ flexDirection: 'row', marginBottom: AppSizes.paddingXSml, alignItems: 'center' }}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.containerImage}
                            source={require('../../assets/icon/iconContainer.png')}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerCode}>{container.containerNumber}</Text>
                        <Text style={styles.containerSeal} numberOfLines={1}>{Localize(messages.seal) + ': ' + container.sealNo}</Text>
                        {this.renderIconText('info', this.getInfoContainer(container))}
                        {this.renderLocationInfo(isBargeMode ? (container && container.pickLocationId ? container.pickLocationId.customerCode : '') : shipment.departure.departureFullName,
                            isBargeMode ? (container && container.dropLocationId ? container.dropLocationId.customerCode : '') : shipment.arrival.arrivalFullName)}


                    </View>
                </View>

                <Divider width={AppSizes.screenWidth - 32} />
            </TouchableOpacity>

        );
    }
}
export default ContainerItem

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
    },
    imageContainer: {

        backgroundColor: 'rgb(241,241,241)',
        borderRadius: AppSizes.paddingTiny,
        width: AppSizes.paddingSml * 7,
        height: AppSizes.paddingSml * 7,
        justifyContent: 'center',
        alignItems: 'center',
        padding: AppSizes.paddingXXMedium
    },
    containerImage: {
        height: AppSizes.paddingXXSml * 8,
        width: AppSizes.paddingXXSml * 8,
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
        marginVertical: AppSizes.paddingXXTiny
    },
    containerSeal: {
        ...AppStyles.regularText,
        marginVertical: AppSizes.paddingXXTiny,

    },
}