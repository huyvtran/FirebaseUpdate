import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput, TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
} from 'react-native';
import HeaderDetail from '../../components/HeaderDetail';
import { Actions } from 'react-native-router-flux';
import AppStyles from '../../theme/AppStyles';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import Divider from '../form/components/Divider';
import { Icon, CheckBox } from 'react-native-elements'
import FreightConstant from '../freight/FreightConstant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AlertUtils from '../../utils/AlertUtils';


class ShipmentSearchScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            filterList: FreightConstant.FILTER_SHIPMENT_PROPERTIES,
            filterSeLected: FreightConstant.FILTER_SHIPMENT_PROPERTIES[0],
            startDate: null,
            endDate: null,
            feeStatus: FreightConstant.FEE_SHIPMENT_STATUS.APPROVED,
            feeStatus: null,
        }

    }

    onSelectFilter = (filterItem) => {
        this.setState({ filterSeLected: filterItem })
    }

    onStartDateChange = (date) => {



        const { endDate } = this.state
        const startDateMoment = moment(date, 'DD-MM-YYYY')
        const endDateMoment = moment(endDate, 'DD-MM-YYYY')

        if (!this.state.endDate || startDateMoment.isBefore(endDateMoment) || startDateMoment.isSame(endDateMoment)) {
            this.setState({
                startDate: startDateMoment,
            });
        } else {
            Platform.OS === 'android' && AlertUtils.showError(messages.startMustBeforeEnd)
        }

    }

    onEndDateChange = (date) => {
        const { startDate } = this.state
        const endDateMoment = moment(date, 'DD-MM-YYYY')
        const startDateMoment = moment(startDate, 'DD-MM-YYYY')

        if (!this.state.startDate || startDateMoment.isBefore(endDateMoment) || startDateMoment.isSame(endDateMoment)) {
            this.setState({
                endDate: endDateMoment,
            });
        } else {
            Platform.OS === 'android' && AlertUtils.showError(messages.startMustBeforeEnd)

        }

    }

    onChangeTextSerch = (text) => {
        this.textSerch = text
    }

    onClickSearch = () => {
        const { endDate, startDate } = this.state
        if ((endDate && !startDate) || (!endDate && startDate)) {
            AlertUtils.showError(messages.needToFill)
            return
        }
        this.props.callBack(this.textSerch, this.state.filterSeLected, this.state.startDate, this.state.endDate, this.state.feeStatus)
        Actions.pop()
    }

    renderSearchView = () => {
        return <View style={styles.searchContainer}>
            <View style={styles.searchContentContainer}>
                <Text style={{
                    alignContent: 'center',
                    textAlign: 'center',
                    ...AppStyles.regularText,
                    color: AppColors.textContent,
                    paddingTop: AppSizes.paddingTiny,
                    paddingBottom: AppSizes.paddingTiny,
                    height: '100%'
                }}>{Localize(this.state.filterSeLected.value)}</Text>
                <Divider vertical marginLeft={AppSizes.paddingTiny} />
                <TextInput
                    keyboardShouldPersistTaps='always'
                    style={styles.textInput}
                    onChangeText={text => this.onChangeTextSerch(text)}
                    placeholder={Localize(messages.search)}
                    autoCorrect={false}
                    autoCapitalize='none'
                    underlineColorAndroid='rgba(0,0,0,0)'

                />

                <TouchableOpacity onPress={() => this.onClickSearch()} style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Icon
                        name={'search'}
                        size={AppSizes.paddingLarge}
                        color={AppColors.abi_blue}
                    />
                </TouchableOpacity>

            </View>

        </View>
    }

    renderFilterContent = () => {

        return <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                {this.state.filterList.map(filterItem => {
                    const isSelected = filterItem.id === this.state.filterSeLected.id
                    return <TouchableOpacity onPress={() => this.onSelectFilter(filterItem)} style={[styles.locationItemContainer, { backgroundColor: isSelected ? AppColors.abi_blue : AppColors.white }]}>
                        <Text style={{ ...AppStyles.regularText, color: isSelected ? AppColors.white : AppColors.abi_blue }}>{Localize(filterItem.value)}</Text>
                    </TouchableOpacity>
                })}
            </ScrollView>
        </View>
    }

    renderSelectDate(value, onChangeDate) {
        return <View style={styles.selectOrgContainer}>
            <DatePicker
                date={value}
                mode="date"
                placeholder={Localize(messages.select)}
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(date) => onChangeDate(date)}
                customStyles={styles.customStylesDatePicker}
            />
            <Ionicons name='ios-calendar' size={AppSizes.paddingMedium} />

        </View>
    }

    renderChagreFilter = () => {
        const { feeStatus } = this.state
        return <View style={styles.contentFilterContainer}>
            <CheckBox
                left
                title={Localize(messages.approved)}
                checked={feeStatus === FreightConstant.FEE_SHIPMENT_STATUS.APPROVED}
                onPress={() => { this.setState({ feeStatus: FreightConstant.FEE_SHIPMENT_STATUS.APPROVED }) }}
                textStyle={{ ...AppStyles.regularText }}
                containerStyle={styles.containerCheckbox}
                checkedIcon='check-circle'
                uncheckedIcon='circle-o'
            />
            <CheckBox
                left
                title={Localize(messages.notApproved)}
                onPress={() => { this.setState({ feeStatus: FreightConstant.FEE_SHIPMENT_STATUS.NOT_APPROVED }) }}
                checked={feeStatus === FreightConstant.FEE_SHIPMENT_STATUS.NOT_APPROVED}
                textStyle={{ ...AppStyles.regularText }}
                containerStyle={styles.containerCheckbox}
                checkedIcon='check-circle'
                uncheckedIcon='circle-o'
            />
        </View>
    }
    render() {

        return (
            <View style={styles.container}>
                <HeaderDetail
                    contentView={this.renderSearchView()}
                    leftButtonAction={() => { Actions.pop() }}
                />
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>{Localize(messages.search)}</Text>
                    {this.renderFilterContent()}
                    <View style={[styles.contentFilterContainer, { marginTop: AppSizes.paddingXMedium, marginBottom: AppSizes.paddingXMedium }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{Localize(messages.startDate)}</Text>
                            {this.renderSelectDate(this.state.startDate, (date) => this.onStartDateChange(date))}
                        </View>

                        <View style={{ marginLeft: AppSizes.paddingSml, flex: 1 }}>
                            <Text style={styles.title}>{Localize(messages.endDate)}</Text>
                            {this.renderSelectDate(this.state.endDate, (date) => this.onEndDateChange(date))}
                        </View>

                    </View>

                    <Text style={styles.title}>{Localize(messages.chargeStatus)}</Text>
                    {this.renderChagreFilter()}
                </View>

            </View>

        );
    }
}

export default ShipmentSearchScreen

const styles = {
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },
    containerCheckbox: {
        backgroundColor: 'white',
        borderColor: 'white',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1
    },
    selectOrgContainer: {
        paddingBottom: AppSizes.paddingXSml,
        flexDirection: 'row',
        alignItems: 'center',
        height: AppSizes.paddingLarge * 2,
        borderBottomWidth: AppSizes.paddingXXTiny,
        borderBottomColor: AppColors.greySight,
        justifyContent: 'space-between'
    },
    customStylesDatePicker: {
        dateInput: {
            borderWidth: 0,
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: AppSizes.paddingXMedium,
            padding: 0,
            margin: 0
        },
        dateText: {
            fontSize: AppSizes.fontBase,
            color: AppColors.textColor,
        },
        dateTouchBody: {
            height: AppSizes.paddingXMedium
        }
    },
    searchContainer: {

        marginLeft: AppSizes.paddingXMedium * 4.5,
        marginRight: AppSizes.paddingXMedium,
        width: AppSizes.screenWidth - AppSizes.paddingXMedium * 5.5,
        height: '100%',
        paddingVertical: AppSizes.paddingSml,

    },
    searchContentContainer: {
        backgroundColor: 'white',
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.lightgray,
        flexDirection: 'row',
        height: '100%',
        padding: AppSizes.paddingTiny,

    },
    textInput: {
        flex: 12,
        fontSize: AppSizes.fontBase,
        marginLeft: AppSizes.paddingSml,
        height: '100%',
        padding: 0,
        marginLeft: AppSizes.paddingSml,
    },
    mainContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingHorizontal: AppSizes.paddingMedium,
        backgroundColor: 'white'
    },
    title: {
        ...AppStyles.regularText,
        color: AppColors.textTitle,
        marginVertical: AppSizes.paddingSml
    },
    locationItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingTiny,
        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.lightgray,
        backgroundColor: 'white',
        marginRight: AppSizes.paddingXSml
    },
    contentFilterContainer: {
        flexDirection: 'row',
        alignItems: 'space-between',
        width: '100%'
    }


}
