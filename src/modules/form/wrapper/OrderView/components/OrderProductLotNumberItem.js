import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalPicker from '../../../../../components/modalnumberpicker';

import { TableContent, H2 } from '../../../../../theme/styled';

import { moneyFormat } from "../../../../../utils/moneyFormat";
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import AppColors from '../../../../../theme/AppColors';
import AppStyles from '../../../../../theme/AppStyles';
import messages from '../../../../../constant/Messages';
import { Localize } from '../../../../../modules/setting/languages/LanguageManager';
import Divider from '../../../components/Divider';
import AppSizes from '../../../../../theme/AppSizes';
import OrderInfo from '../../../../../constant/OrderInfo';
import { Icon } from 'react-native-elements';


const styles = StyleSheet.create({
    container: {
        // paddingLeft: AppSizes.paddingMedium,
        paddingRight: AppSizes.paddingMedium,
        backgroundColor: 'white',
        marginTop: AppSizes.paddingXSml,
        marginBottom: AppSizes.paddingXSml,
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    icon: {
        height: AppSizes.paddingMedium,
        width: AppSizes.paddingMedium
    },
    lotNumberContainer: {
        width: '100%',
        paddingLeft: AppSizes.paddingXXLarge,
        paddingRight: AppSizes.paddingSml,
        paddingTop: AppSizes.paddingSml
    },
    lotNumberInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})
class OrderProductLotNumberItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: null,
            isModalVisible: true,
            option: this.intiOption(props?.lotNumber?.skuList ?? []),
            isShowLotNumber: false
        };
    }

    intiOption = (skuList) => {
        return skuList.map(sku => {
            return [sku.numberOfCaseDelivered, sku.numberOfItemDelivered]
        })
    }

    async onChange(option, orderListId, SKU_ID) {
        await this.setState({
            option,
        });
        await this.props.onChange(option, orderListId, SKU_ID);
    }


    getActualQuantity(sku) {
        const { statusSelected } = this.props
        const { numberOfCaseActual, numberOfItemActual, numberOfCaseDelivered, numberOfItemDelivered, } = sku
        let numberOfCaseDisplay = 0
        let numberOfItemDisplay = 0
        switch (statusSelected) {
            case OrderInfo.ORDER_STATUS.PARTLY_DELIVERY:
                numberOfCaseDelivered && (numberOfCaseDisplay = numberOfCaseDelivered)
                numberOfItemDelivered && (numberOfItemDisplay = numberOfItemDelivered)
                break;
            case OrderInfo.ORDER_STATUS.COMPLETED:
                numberOfCaseActual && (numberOfCaseDisplay = numberOfCaseActual)
                numberOfItemActual && (numberOfItemDisplay = numberOfItemActual)
                break;
            case OrderInfo.ORDER_STATUS.NOT_COMPLETE:
                numberOfCaseDisplay = 0
                numberOfItemDisplay = 0
                break;
        }

        return numberOfCaseDisplay + ' | ' + numberOfItemDisplay
    }

    getSkuPrice(sku) {
        const { numberOfCase, casePrice, numberOfItem, itemPrice } = sku
        const planPrice = numberOfCase * casePrice + numberOfItem * itemPrice
        return this.props.statusSelected === OrderInfo.ORDER_STATUS.PARTLY_DELIVERY ? moneyFormat(sku.SKUPrice) : moneyFormat(planPrice)
    }

    onShowLotNumber = () => {
        this.setState({ isShowLotNumber: !this.state.isShowLotNumber })
    }
    renderLotNumberItem = (sku) => {
        const { statusSelected, orderListId } = this.props
        const { numberOfCaseActual, numberOfItemActual } = sku
        const data = [numberOfCaseActual, numberOfItemActual];
        const label = [Localize(messages.numberOfCase), Localize(messages.numberOfItems)];
        const disablePicker = statusSelected !== OrderInfo.ORDER_STATUS.PARTLY_DELIVERY
        return <View style={styles.lotNumberContainer}>
            <View style={styles.lotNumberInfoContainer}>
                <Text style={{ ...AppStyles.h5, color: AppColors.textSubContent, flex: 1 }}>{"Lot: " + sku.lotNumber}</Text>
                <ModalPicker
                    style={[{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', width: '100%' }, !disablePicker && { backgroundColor: '#FFF9C4' }]}
                    disabled={disablePicker}
                    data={data}
                    onChange={(option) => this.onChange(option, orderListId, sku.sku + sku.lotNumber)}
                    numberPerCase={sku.numberPerCase}
                    label={label}
                    initValue={[sku.numberOfCaseDelivered, sku.numberOfItemDelivered]}
                >
                    <Text style={{ ...AppStyles.h5, color: AppColors.textSubContent }} >{this.getActualQuantity(sku)}</Text>

                </ModalPicker>
            </View>
            <Text style={{ ...AppStyles.h5, color: AppColors.textSubContent }}>{"QC: " + sku.qcNumber}</Text>

        </View>
    }
    renderLotNumberView = () => {
        const { lotSku } = this.props
        return lotSku.skuList.map(sku => this.renderLotNumberItem(sku))
    }

    render() {
        const { lotSku } = this.props
        const { numberOfCaseActual, numberOfItemActual, productDetail, numberOfCase, numberOfItem } = lotSku

        const { isShowLotNumber } = this.state
        return (
            <View style={[styles.container, { borderLeftWidth: isShowLotNumber ? AppSizes.paddingXTiny : 0, borderLeftColor: AppColors.orange }]}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.onShowLotNumber()}>
                    <Icon
                        name={'arrow-drop-down'}
                        color={AppColors.abi_blue}
                        size={AppSizes.paddingXXLarge}
                    />
                    <View style={{ flex: 1, }}>

                        <View style={[styles.containerHeader, { width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7 - AppSizes.paddingXXLarge, }]}>
                            <Text numberOfLines={3} ellipsizeMode='tail' style={[H2, { width: '60%' }]}>{productDetail}</Text>
                            <Text style={H2}>{this.getSkuPrice(lotSku)}</Text>

                        </View>

                        <View style={[styles.containerHeader, { marginTop: AppSizes.paddingXMedium, width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7 - AppSizes.paddingXXLarge, }]}>
                            <Text style={[TableContent, { flex: 1, width: '100%', justifyContent: 'flex-start', marginLeft: 0 }]} >{Localize(messages.plan) + ': ' + numberOfCase + ' | ' + numberOfItem}</Text>
                            <Text style={[TableContent, { flex: 1, width: '100%', justifyContent: 'flex-end', marginRight: 0, textAlign: 'right' }]} >{Localize(messages.actual) + ': ' + numberOfCaseActual + ' | ' + numberOfItemActual}</Text>
                        </View>

                    </View>
                </TouchableOpacity>


                <Divider style={{ width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7, marginTop: AppSizes.paddingXXSml }} />
                {isShowLotNumber && <View>
                    {this.renderLotNumberView()}
                    <Divider style={{ width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7, marginTop: AppSizes.paddingXXSml }} />

                </View>}

            </View>
        )
    }

}

export default OrderProductLotNumberItem;
