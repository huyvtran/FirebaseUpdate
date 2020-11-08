import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Table, Row, Rows } from '../../../components/table';
import AppSizes from '../../../theme/AppSizes';
import DeviceInfo from 'react-native-device-info';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import { Icon } from 'react-native-elements';
import ButtonIcon from '../../../components/ButtonIcon';
import _ from 'lodash'
import FreightConstant from '../../freight/FreightConstant';
import ShipmentControl from '../ShipmentControl';
const NUMBER_COL_CONS_TYPE = 16
const NUMBER_COL_CONS_DETAIL = 14
const INDEX_NOTE_CELL = 12
class ShipmentBargeContainer extends Component {
    constructor(props) {
        super(props);
        const widthColContainerType = AppSizes.screenWidth / NUMBER_COL_CONS_TYPE;
        const widthColContainerDetail = AppSizes.screenWidth / NUMBER_COL_CONS_DETAIL;

        this.isDummy = props.shipment && props.shipment.bargeShipmentType === FreightConstant.SHIPMENT_BARGE_TYPE.DUMMY
        const stopSelected = props.shipment.shipmentStopIds.find(shipmentStop => shipmentStop.isSelected)
        const groupContainers = this.groupContainerList(stopSelected && stopSelected.countContainers ? stopSelected.countContainers : [])

        this.state = {
            noteContentToShow: null,

            stopSelected: this.calculateContainerNumberInStop(stopSelected, groupContainers),

            headerTotalVolumn: [
                Localize(messages.linedUp),
                Localize(messages.unloading),
                '20" Khô',
                '40" Khô',
                '45" Khô',
                '20" Lạnh',
                '40" Lạnh',
                '20" IMO',
                '40" IMO',
                '20" Quá khổ',
                '40" Quá khổ',
                '20" Rỗng khô',
                '40" Rỗng khô',
                '45" Rỗng khô',
                '20" Rỗng lạnh',
                '40" Rỗng lạnh',],
            widthArrTotalVolumn: [widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType, widthColContainerType],

            headerContainerDetail: [
                Localize(messages.containerNumber),
                Localize(messages.size),
                Localize(messages.emptyPro),
                Localize(messages.VGM),
                Localize(messages.seal),
                Localize(messages.billNo),
                Localize(messages.bookNo),
                Localize(messages.nameNumberShipment),
                'IMO',
                Localize(messages.temperature),
                Localize(messages.linedUp),
                Localize(messages.unloading),
                Localize(messages.note),
            ],
            widthArrContainerDetail: [widthColContainerDetail * 2, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail, widthColContainerDetail]
        }
    }

    componentWillReceiveProps(newsProps) {
        if (newsProps.shipment && this.props.shipment && JSON.stringify(newsProps.shipment) !== JSON.stringify(this.props.shipment)) {
            const stopSelectedParam = _.find(newsProps.shipment.shipmentStopIds, shipmentStop => shipmentStop.isSelected)
            const groupContainers = this.groupContainerList(stopSelectedParam && stopSelectedParam.countContainers ? stopSelectedParam.countContainers : [])

            const stopSelected = this.calculateContainerNumberInStop(stopSelectedParam, groupContainers)

            this.setState({ stopSelected })
        }
    }

    groupContainerList = (containerList) => {
        return _.groupBy(containerList, container => {
            const pickLocation = container && container.pickLocationId && container.pickLocationId.customerCode ? container.pickLocationId.customerCode : ' '
            const dropLocation = container && container.dropLocationId && container.dropLocationId.customerCode ? container.dropLocationId.customerCode : ' '
            return pickLocation + ',' + dropLocation
        })
    }

    calculateContainerNumberInStop = (stopSelected, groupPickContainer) => {
        let containerInfo = []
        for (let key in groupPickContainer) {
            let containerList = groupPickContainer[key]
            let arrayKey = key.split(',')
            containerInfo.push([
                arrayKey[0] ? arrayKey[0] : '',
                arrayKey[1] ? arrayKey[1] : '',
                ...this.calculateContainerNumber(containerList)]
            )
        }
        return {
            ...stopSelected,
            containerInfo,
        }

    }

    calculateContainerNumber = (containerList) => {
        let dry20 = 0;
        let dry40 = 0;
        let dry45 = 0;
        let cold20 = 0;
        let cold40 = 0;
        let IMO20 = 0;
        let IMO40 = 0;
        let tooLarge20 = 0;
        let tooLarge40 = 0;
        let emptyDry20 = 0;
        let emptyDry40 = 0;
        let emptyDry45 = 0;
        let emptyCold20 = 0;
        let emptyCold40 = 0;

        containerList && containerList.forEach(container => {
            const shipUnitCount = container && container.shipUnitCount ? parseInt(container.shipUnitCount) : 0

            if (container && container.isFull && container.containerId && container.containerId.containerType) {
                const { containerId } = container

                const { containerLength, containerTypeCode } = containerId.containerType;
                if (ShipmentControl.isDry20Container(containerId)) {
                    dry20 += shipUnitCount;
                }
                if (ShipmentControl.isDry40Container(containerId)) {
                    dry40 += shipUnitCount;
                }
                if (ShipmentControl.isDry45Container(containerId)) {
                    dry45 += shipUnitCount;
                }
                if (ShipmentControl.isCold20Container(containerId)) {
                    cold20 += shipUnitCount;
                }
                if (ShipmentControl.isCold40Container(containerId)) {
                    cold40 += shipUnitCount;
                }

                if (ShipmentControl.is20Container(containerLength) && container.IMOClass === 'FXIX') {
                    IMO20 += shipUnitCount;
                }
                if (ShipmentControl.is40Container(containerLength) && container.IMOClass === 'FXIX') {
                    IMO40 += shipUnitCount;
                }

                if (ShipmentControl.is20Container(containerLength) && (container.IMOClass === 'FXXO' || ShipmentControl.isTooLargeContainer(containerTypeCode))) {
                    tooLarge20 += shipUnitCount;
                }
                if (ShipmentControl.is40Container(containerLength) && (container.IMOClass === 'FXXO' || ShipmentControl.isTooLargeContainer(containerTypeCode))) {
                    tooLarge40 += shipUnitCount;
                }
            } else if (container && !container.isFull && container.containerId && container.containerId.containerType) {
                const { containerId } = container

                if (ShipmentControl.isDry20Container(containerId)) {
                    emptyDry20 += shipUnitCount;
                }
                if (ShipmentControl.isDry40Container(containerId)) {
                    emptyDry40 += shipUnitCount;
                }
                if (ShipmentControl.isDry45Container(containerId)) {
                    emptyDry45 += shipUnitCount;
                }
                if (ShipmentControl.isCold20Container(containerId)) {
                    emptyCold20 += shipUnitCount;
                }
                if (ShipmentControl.isCold40Container(containerId)) {
                    emptyCold40 += shipUnitCount;
                }
            }
        })

        return [
            dry20,
            dry40,
            dry45,
            cold20,
            cold40,
            IMO20,
            IMO40,
            tooLarge20,
            tooLarge40,
            emptyDry20,
            emptyDry40,
            emptyDry45,
            emptyCold20,
            emptyCold40,
        ]
    }

    transformShipmentStop = (shipmentStops) => {
        if (!shipmentStops) {
            return []
        }
        return shipmentStops.map(stop => {
            return {
                ...stop,
                value: stop.customerId ? stop.customerId.fullName : '',
                selected: false
            }
        })

    }

    getTotalVolumnData = () => {
        const { stopSelected } = this.state
        return stopSelected.containerInfo;

    }
    getContainerInfoData = (containerList) => {
        let tableData = []

        tableData = _.map(containerList, container => {
            const { containerId } = container
            let rowData = []
            rowData.push(containerId.containerNumber)
            rowData.push(containerId.containerType ? containerId.containerType.containerTypeCode : '')
            rowData.push(container.isFull ? 'F' : 'E')

            rowData.push(containerId.netWeight)
            rowData.push(containerId.sealNo)
            rowData.push(containerId.containerBookingOrBOL)

            rowData.push(containerId.containerBookingOrBOL)
            // rowData.push(containerId.orderReleaseCode)
            rowData.push((containerId.vesselName ? containerId.vesselName : "") + "/" + containerId.voyageCode)
            rowData.push(containerId.IMOClass)
            rowData.push(containerId.temperature)
            rowData.push(container.pickLocationId ? container.pickLocationId.customerCode : '')
            rowData.push(container.dropLocationId ? container.dropLocationId.customerCode : '')
            rowData.push(containerId?.containerNote ?? '')
            return rowData
        })
        return tableData
    }

    onClickCell = (rowData, cellData, index) => {
        if (index === INDEX_NOTE_CELL) {
            this.props.openNoteView(rowData?.[0] ?? "", cellData)
        }
    }

    renderTableContainerInfo = (title, tableHead, widthArr, tableData = []) => {

        return <View style={styles.tableInfoContainer}>
            <Text style={styles.tableInfoTitle}>{title}</Text>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{ borderColor: 'transparent', }}>
                        <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
                    </Table>
                    <View style={styles.dataWrapper}>
                        <Table borderStyle={{ borderColor: 'transparent', }}>
                            {
                                tableData.map((rowData, index) => (
                                    <Row
                                        onPressCell={(cellData, cellIndex) => this.onClickCell(rowData, cellData, cellIndex)}
                                        key={index}
                                        data={rowData}
                                        widthArr={widthArr}
                                        style={styles.row}
                                        textStyle={{ ...AppStyles.regularText, ...styles.text, color: 'rgba(33, 33, 33, 0.87)', textAlign: 'center' }}
                                    />
                                ))
                            }
                        </Table>
                    </View>
                </View>
            </ScrollView>
        </View>
    }

    render() {
        const { stopSelected, noteContentToShow } = this.state

        const totalVolumnData = this.getTotalVolumnData()
        const containerInfoData = !this.isDummy && this.getContainerInfoData(stopSelected.countContainers)

        return (
            <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'white' }}>

                <View style={styles.dashboardContainer}>
                    {this.renderTableContainerInfo(Localize(messages.totalTransportVolumn) + ': ', this.state.headerTotalVolumn, this.state.widthArrTotalVolumn, totalVolumnData)}
                    {!this.isDummy && this.renderTableContainerInfo(Localize(messages.containerDetail) + ': ', this.state.headerContainerDetail, this.state.widthArrContainerDetail, containerInfoData)}
                </View>

            </View >
        );
    }
}

const styles = {
    header: { height: AppSizes.paddingXSml * 5, backgroundColor: '#F4F7FA' },
    text: { ...AppStyles.regularText, textAlign: 'center', fontWeight: '300', color: 'rgba(0,0,0,0.54)', numberOfLines: 2 },
    dataWrapper: {},
    row: { height: AppSizes.paddingLarge * 2, backgroundColor: 'white', borderBottomColor: AppColors.lightgray, borderBottomWidth: AppSizes.paddingXXTiny, },


    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: AppSizes.paddingMedium,
        backgroundColor: 'white',
        marginTop: AppSizes.paddingMedium,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    filterMainContainer: {
        borderWidth: AppSizes.paddingMicro,
        borderColor: AppColors.grayLight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: AppColors.lightGrayTrans,
        paddingHorizontal: AppSizes.paddingSml,
        flex: 1,
        marginLeft: AppSizes.paddingSml

    },
    dashboardContainer: {
        marginTop: AppSizes.paddingMedium,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tableInfoTitle: {
        ...AppStyles.regularText,
        padding: AppSizes.paddingMedium,
        color: AppColors.textContent,
        fontSize: AppSizes.fontXXMedium
    },
    tableInfoContainer: {
        width: '100%',
        borderBottomColor: AppColors.lightgray,
        borderBottomWidth: AppSizes.paddingXXTiny,
        // paddingBottom: AppSizes.paddingMedium
    },

    filterLocationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: AppSizes.paddingMedium,
        height: '100%',
        flex: 1,
        backgroundColor: AppColors.addMoreButton,

    },
    filterLocationMainContainer: {
        width: '100%',
        borderRadius: AppSizes.paddingXXSml,
        borderColor: AppColors.lightgray,
        borderWidth: AppSizes.paddingMicro,
        paddingBottom: AppSizes.paddingSml,
        backgroundColor: 'white'
    },
    filterHeaderContainer: {
        paddingHorizontal: AppSizes.paddingMedium,
        backgroundColor: AppColors.abi_blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderTopLeftRadius: AppSizes.paddingXXSml,
        borderTopRightRadius: AppSizes.paddingXXSml,
    }
}
export default connect(state => ({
}), {})(ShipmentBargeContainer);
