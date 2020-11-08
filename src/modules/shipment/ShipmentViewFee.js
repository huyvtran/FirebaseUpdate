import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput, TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import HeaderDetail from '../../components/HeaderDetail';
import { Actions } from 'react-native-router-flux';
import AppStyles from '../../theme/AppStyles';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import { connect } from 'react-redux';
import API from '../../network/API';
import AwesomeListComponent from 'react-native-awesome-list';
import ErrorAbivinView from '../../components/ErrorAbivinView';
import { H1, H2 } from '../../theme/styled';
import { dateWithFormat } from '../../utils/TimeUtils';
import StringUtils from '../../utils/StringUtils';
import Divider from '../form/components/Divider';
import FreightConstant from '../freight/FreightConstant';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonIcon from '../../components/ButtonIcon';
import Progress from '../../components/Progress';
import _ from 'lodash'
import AlertUtils from '../../utils/AlertUtils';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },


    itemContainer: {
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml
    },
    itemTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleText: {
        ...H1,
        fontWeight: '100',
        flex: 7
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: AppColors.abi_blue_light,
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statusContainer: {
        backgroundColor: 'rgba(3,154,227, 0.2)',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingVertical: AppSizes.paddingTiny,
        paddingHorizontal: AppSizes.paddingMedium,
        width: '100%',
        flexDirection: 'row'
    },
    statusBarText: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontSmall,
        color: AppColors.abi_blue,
        marginLeft: AppSizes.paddingSml
    },

})
class ShipmentViewFee extends Component {

    constructor(props) {
        super(props)
        this.state = {
            actualSpentTotal: 0,
            costNormTotal: 0,
            feeList: []

        }

    }

    source = () => {
        return API.addChargeListShipment(this.props.org[0]._id, this.props.shipment._id, false)
    }

    transformer = (res) => {
        const feeList = res ?.data ?.chargeRequests ?? [];
        let actualSpentTotal = 0
        let costNormTotal = 0
        feeList.forEach(fee => {
            actualSpentTotal += fee.costSpent
            costNormTotal += fee.costNorms
        })
        this.setState({ actualSpentTotal, costNormTotal, feeList })

        return feeList
    }

    refreshList = () => {
        this.chagreFeeList.refresh()
    }

    onClickItemFee = (item) => {
        Actions.shipmentAddFee({ feeShipmentInfo: item, refresh: this.refreshList.bind(this) })
    }

    /**
     * refresh data but send params isOtmRefresing = true, to server refresh from OTM
     */
    onClickRefreshOTM = () => {
        Progress.show(API.addChargeListShipment, [this.props.org[0]._id, this.props.shipment._id, true], (res) => {
            if (res && res.data) {
                this.chagreFeeList.refresh()
            }
        })
    }

    isAllFeeIsApproval = (feeList) => {
        return _.every(feeList, fee => fee.status === FreightConstant.FEE_STATUS.APPROVED)
    }

    /**
     * chargeRequestIds : fee id list
     * status: 2
     * 
     */
    onClickSendAll = () => {
        const { feeList } = this.state;
        if (!feeList || feeList.length === 0) {
            AlertUtils.showError(messages.haveNoFeeInList)
            return
        }


        const chargeRequests = feeList.map(fee => {
            return {
                ...fee,
                shipmentId: fee.shipmentInfo._id,
                status: FreightConstant.FEE_STATUS.SENT
            }
        })

        const { org } = this.props

        const body = {
            organizationId: org[0] ?._id ?? "",
            chargeRequests,
            isSendingToOTM: true,
            shipmentId: feeList ?.[0] ?.shipmentInfo ?._id
        }

        Progress.show(API.addChargeShipment, [body], res => {
            if (res && res.status === 200) {
                //for refresh list charge fee after editing charge fee
                this.chagreFeeList.refresh()
                AlertUtils.showSuccess(messages.submitAllChargFeeSuccess)
            }

        })

    }

    isShowControlButton = () => {
        const { feeList } = this.state;
        if (!feeList || feeList.length === 0) {
            return false
        }
        return !_.every(feeList, fee => {
            return fee.status === FreightConstant.FEE_STATUS.APPROVED
        })
    }
    renderIconStatus = (feeItem) => {
        switch (feeItem.status) {
            case FreightConstant.FEE_STATUS.SENT:
                return <Icon
                    name={'check-circle-o'}
                    color={AppColors.greenLight}
                    size={AppSizes.paddingXLarge}
                />
            case FreightConstant.FEE_STATUS.APPROVED:
                return <Icon
                    name={'check-circle'}
                    color={AppColors.greenLight}
                    size={AppSizes.paddingXLarge}
                />
            default:
                return <View />
        }

    }

    /**
     * 
     * @param {shipmentId. costNorms, costSpent, costCustomer, invoiceNumber, debtRegisterd, payOnBehalf, taxNumber, , invoiceName, chargeTypeCode, chargeTypeName} param0 
     */
    renderItem({ item, index }) {
        const chargeName = item ?.chargeTypeInfo ?.chargeTypeName ?? '';
        return <TouchableOpacity style={styles.itemContainer} onPress={() => { this.onClickItemFee(item) }}>
            <Text style={styles.titleText} numberOfLines={1}>{chargeName}</Text>

            <View style={styles.itemTitleContainer}>
                <Text style={{ ...H2, marginTop: AppSizes.paddingXXSml }}>{Localize(messages.costNorms) + ": " + StringUtils.moneyFormat(item.costNorms) + " " + Localize(messages.currencyLocal)}</Text>

                {this.renderIconStatus(item)}
            </View>
            <View style={[styles.itemTitleContainer,]}>
                <Text style={{ ...H2, marginTop: AppSizes.paddingXXSml }}>{Localize(messages.actualSpent) + ": " + StringUtils.moneyFormat(item.costSpent) + " " + Localize(messages.currencyLocal)}</Text>

                {item.debtRegistered && <View style={{ paddingHorizontal: AppSizes.paddingTiny, paddingVertical: AppSizes.paddingTiny, borderRadius: AppSizes.paddingTiny, backgroundColor: AppColors.abi_blue_light }}>
                    <Text style={{ ...AppStyles.regularText, fontSize: AppSizes.fontXSmall, color: 'white' }}>{Localize(messages.inDebt)}</Text>
                </View>}
            </View>
            <Divider style={{ marginTop: AppSizes.paddingXSml }} />
        </TouchableOpacity>
    }

    keyExtractor(item) {
        return item._id
    }

    renderFooterContent = (title, content) => {
        return <View>
            <Text style={{ ...AppStyles.regularText, color: AppColors.white, }}>{title}</Text>
            <Text style={{ ...AppStyles.regularText, color: AppColors.white, fontSize: AppSizes.fontXXMedium, marginTop: AppSizes.paddingXXSml, fontWeight: '300' }}>{content}</Text>
        </View>
    }

    renderRightViewHeader() {
        return <View style={{ flexDirection: 'row' }}>
            {this.isShowControlButton() && <ButtonIcon
                iconName={"cloud-upload"}
                iconColor={AppColors.white}
                iconSize={AppSizes.paddingXXLarge}
                onPress={() => this.onClickSendAll()}
            />}
            {this.isShowControlButton() && <ButtonIcon
                iconName={"autorenew"}
                iconColor={AppColors.white}
                iconSize={AppSizes.paddingXXLarge}
                onPress={() => this.onClickRefreshOTM()}
            />}

        </View>
    }

    renderApprovalStatus = () => {
        const { feeList } = this.state
        if (feeList && feeList.length > 0 && this.isAllFeeIsApproval(feeList)) {
            return <View style={styles.statusContainer}>
                <Icon
                    name={'check-circle'}
                    color={AppColors.abi_blue}
                    size={AppSizes.paddingXLarge}
                />
                <Text style={styles.statusBarText} numberOfLines={1}>{Localize(messages.allChargeHasBeenConfirm)}</Text>
            </View>
        }

        return <View />

    }

    render() {
        const { shipment } = this.props
        const { costNormTotal, actualSpentTotal } = this.state
        return (
            <View style={styles.container}>
                <HeaderDetail
                    title={shipment.shipmentCode}
                    leftButtonAction={() => { Actions.pop() }}
                    rightView={this.renderRightViewHeader()}
                />
                {this.renderApprovalStatus()}
                <AwesomeListComponent
                    ref={ref => this.chagreFeeList = ref}
                    isPaging
                    source={() => this.source()}
                    transformer={(response) => this.transformer(response)}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item) => this.keyExtractor(item)}
                    emptyText={Localize(messages.noResult)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.chagreFeeList.onRetry()} />}
                />
                <View style={{ height: AppSizes.paddingMedium * 3 }} />

                <View style={styles.footerContainer}>
                    {this.renderFooterContent(Localize(messages.costNormsTotal), StringUtils.moneyFormatCurrency(costNormTotal))}
                    {this.renderFooterContent(Localize(messages.actualSpentTotal), StringUtils.moneyFormatCurrency(actualSpentTotal))}
                </View>

            </View>

        );
    }
}

export default connect(state => ({
    org: state.org.orgSelect,

}), {})(ShipmentViewFee);

