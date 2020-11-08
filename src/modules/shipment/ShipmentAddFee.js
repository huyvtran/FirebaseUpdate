import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput, TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    ScrollView
} from 'react-native';
import HeaderDetail from '../../components/HeaderDetail';
import { Actions } from 'react-native-router-flux';
import AppStyles from '../../theme/AppStyles';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/Ionicons';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import AddPhotoComponent from '../../components/AddPhotoComponent';
import ButtonText from '../../components/ButtonText';
import { connect } from 'react-redux';
import Progress from '../../components/Progress';
import API from '../../network/API';
import FreightConstant from '../freight/FreightConstant';
import { CheckBox } from 'react-native-elements';
import StringUtils from '../../utils/StringUtils';
import AlertUtils from '../../utils/AlertUtils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },
    contentContainer: {
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium
    },
    inputContainer: {
        color: AppColors.textColor,
        fontSize: AppSizes.fontBase,
        height: AppSizes.paddingLarge * 2,
        width: '100%',
    },
    slectFeeContainer: {
        paddingTop: AppSizes.paddingXSml,
        paddingBottom: AppSizes.paddingXSml,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: AppSizes.paddingLarge * 2,
        // width: '100%'
    },
    feeTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleCheckbox: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
    },
    containerCheckbox: {
        backgroundColor: 'white',
        borderColor: 'white',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0,
        paddingLeft: 0
    },

    noteContainer: {
        // paddingTop: AppSizes.paddingXSml,
        // paddingBottom: AppSizes.paddingXSml,
        // paddingBottom: AppSizes.paddingXSml,
        padding: AppSizes.paddingXSml,
        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.separator,
        marginTop: AppSizes.paddingSml
    }
})
class ShipmentAddFee extends Component {

    constructor(props) {
        super(props)

        this.state = {
            feeShipmentInfo: props.feeShipmentInfo,
            note: props.feeShipmentInfo.note
        }
    }

    onClickSave = () => {

        const { feeShipmentInfo } = this.state

        if (feeShipmentInfo.status === FreightConstant.FEE_STATUS.APPROVED) {
            AlertUtils.showWarning(messages.thisFeeIsAccepted)
            return;
        }
        if (!StringUtils.isAllDigit(feeShipmentInfo.costSpent)) {
            AlertUtils.showError(messages.costSpendMustBeNumber)
            return;
        }

        if (!!feeShipmentInfo.note && feeShipmentInfo.note.length > 200) {
            AlertUtils.showError(messages.noteIsTooLong)
            return;
        }
        const { org } = this.props
        const body = {
            organizationId: org[0] ?._id ?? "",
            chargeRequests: [{
                ...feeShipmentInfo,
                shipmentId: feeShipmentInfo.shipmentInfo._id,
                status: FreightConstant.FEE_STATUS.SENT
            }]
        }
        Progress.show(API.addChargeShipment, [body], res => {
            if (res && res.status === 200) {
                //for refresh list charge fee after editing charge fee
                this.props.refresh && this.props.refresh()
                AlertUtils.showSuccess(messages.createChagreSuccess)
                Actions.pop()
            }

        })
    }

    renderInvoiceCode() {
        const { feeShipmentInfo } = this.state
        const invoiceCode = feeShipmentInfo ?.invoiceCode ?? '';
        return <View style={styles.slectFeeContainer}>
            <TextInput
                style={styles.inputContainer}
                autoCapitalize='none'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                placeholder={Localize(messages.enter)}
                placeholderTextColor={AppColors.textSecondary}
                value={invoiceCode}
                onChangeText={(text) => {
                    this.setState({
                        feeShipmentInfo: {
                            ...feeShipmentInfo,
                            invoiceCode: text
                        }
                    })
                }}
            />
        </View>
    }

    renderActualSpent() {
        const { feeShipmentInfo } = this.state
        const costSpent = feeShipmentInfo ?.costSpent ?? '';
        return <View style={styles.slectFeeContainer}>
            <TextInput
                keyboardType='numeric'
                style={styles.inputContainer}
                autoCapitalize='none'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                placeholder={Localize(messages.enterFee)}
                placeholderTextColor={AppColors.textSecondary}
                value={costSpent + ''}
                // defaultValue={(feeShipmentInfo.status === FreightConstant.FEE_STATUS.SENT ? costSpent : feeShipmentInfo.costNorms) + ''}
                onChangeText={(text) => {
                    this.setState({
                        feeShipmentInfo: {
                            ...feeShipmentInfo,
                            costSpent: text
                        }
                    })
                }}
            />
        </View>
    }

    renderNote = () => {
        const { feeShipmentInfo } = this.state

        return <View style={styles.noteContainer}>
            <TextInput
                style={[styles.inputContainer, { height: AppSizes.paddingLarge * 4, textAlignVertical: 'top' }]}
                autoCapitalize='none'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                placeholder={Localize(messages.enter)}
                placeholderTextColor={AppColors.textSecondary}
                value={feeShipmentInfo ?.note ?? "" }
                multiline={true}
                onChangeText={(text) => {
                    this.setState({
                        feeShipmentInfo: {
                            ...feeShipmentInfo,
                            note: text
                        }
                    })
                }}
            />
        </View>
    }

    renderContent = (content) => {
        return <View style={styles.slectFeeContainer}>
            <Text style={[styles.inputContainer, { width: '100%', paddingBottom: AppSizes.paddingSml, paddingTop: AppSizes.paddingSml, }]}>{content}</Text>
        </View>
    }

    renderRightView = () => {
        return <View style={{ flexDirection: 'row' }}>
            <ButtonText
                content={Localize(messages.save)}
                onClick={() => this.onClickSave()}
            />
        </View>
    }

    renderFeeType = () => {
        const { feeShipmentInfo } = this.state
        return <View style={styles.feeTypeContainer}>
            {/* <CheckBox
                left
                title={Localize(messages.payOnBehalf)}
                checked={feeShipmentInfo.payOnBehalf}
                textStyle={styles.titleCheckbox}
                containerStyle={styles.containerCheckbox}
                checkedIcon='check-circle'
                uncheckedIcon='circle-o'
                checkedColor={AppColors.greenLight}
            /> */}

            <CheckBox
                left
                title={Localize(messages.inDebt)}
                checked={feeShipmentInfo.debtRegistered}
                onPress={() => {
                    this.setState({
                        feeShipmentInfo: {
                            ...feeShipmentInfo,
                            debtRegistered: !feeShipmentInfo.debtRegistered
                        }
                    })
                }}
                textStyle={styles.titleCheckbox}
                containerStyle={styles.containerCheckbox}
                checkedIcon='check-circle'
                uncheckedIcon='circle-o'
            />
        </View>
    }


    render() {
        const { feeShipmentInfo } = this.state
        const feeName = feeShipmentInfo ?.chargeTypeInfo ?.chargeTypeName ?? "";
        const feeCode = feeShipmentInfo ?.chargeTypeInfo ?.chargeTypeCode ?? "";
        const { invoiceCode, shipmentInfo } = feeShipmentInfo;
        return (
            <View style={styles.container}>
                <HeaderDetail
                    title={feeName}
                    subTitle={shipmentInfo.shipmentCode}
                    rightView={this.renderRightView()}

                />
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <InputField
                            containerStyle={{ width: '100%' }}
                            title={messages.expenses}
                            renderContent={this.renderContent(feeName)}
                            isHideDivider
                        />
                        <InputField
                            containerStyle={{ width: '100%' }}
                            title={messages.invoiceCode}
                            renderContent={this.renderInvoiceCode()} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <InputField
                                containerStyle={{ width: '40%' }}
                                title={messages.actualSpent}
                                renderContent={this.renderActualSpent()} />
                            <InputField
                                containerStyle={{ width: '40%' }}
                                isHideDivider
                                title={messages.costNorms}
                                renderContent={this.renderContent(`${feeShipmentInfo.costNorms}  ${Localize(messages.currencyLocal)}`)} />
                        </View>

                        <InputField
                            title={messages.feeType}
                            renderContent={this.renderFeeType()} />

                        <InputField
                            title={messages.note}
                            renderContent={this.renderNote()} />
                    </View>

                    <View style={{ height: 300 }} />
                </ScrollView>


            </View>

        );
    }
}

export default connect(state => ({
    org: state.org.orgSelect,

}), {})(ShipmentAddFee);

