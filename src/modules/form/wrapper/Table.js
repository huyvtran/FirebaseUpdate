import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Table, Row, Rows } from '../components/Table';
import { moneyFormat } from "../../../utils/moneyFormat";
import TranslateText from '../../setting/languages/components/TranslateText';
import AppColors from '../../../theme/AppColors';
import OrderHelper from '../../orders/helpers/OrderHelper';
import _ from 'lodash';
import TaskCode from '../../../constant/TaskCode';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import API from '../../../network/API';


class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portrait: true,
            loadingData: true,
            tableHead: [],
            tableHeadValue: [],
            tableData: [],
            sumTotalPrice: 0
        };
        this.onLayout = this.onLayout.bind(this);
    }
    componentDidMount() {
        try {
            this.onLoadData()
        } catch (error) {
            this.setState({ loadingData: false })

        }
    }

    loadOrderListData = async () => {
        const { dataTask, orgConfig } = this.props
        const orderIds = OrderHelper.getOrderIdFromTask(dataTask?.data ?? []);
        const orderRes = await API.orderListFromOrderIds(orderIds, orgConfig?.configurations?.longhaul ?? false)
        return orderRes?.data?.data ?? []
    }

    onLoadData = async () => {
        let tableHead = [];
        let tableData = [];
        let sumTotalPrice = 0;

        let tableHeadValue = [];
        const rowHeaders = this.props?.rows?.[0] ?? [];

        rowHeaders.forEach(rowItem => {
            const rowHeaderItem = rowItem?.components?.[0] ?? null
            if (rowHeaderItem) {
                tableHead.push(rowHeaderItem.label)
                tableHeadValue.push(rowHeaderItem.key);
            }
        })
        const dataTask = this.props.dataTask
        const orders = await this.loadOrderListData()
        const orderList = OrderHelper.calculateTripOrder(orders, dataTask.data, dataTask.taskDetail);
        sumTotalPrice = this.sumTotalPrice(orderList)

        orderList && orderList.forEach(order => {
            let rowData = [];
            tableHeadValue.forEach(h => {
                if (h.indexOf('.') > -1) {
                    const hSplit = h.split('.');
                    rowData = [...rowData, order[hSplit[0]][hSplit[1]]];
                } else {
                    rowData = [...rowData, order[h]];
                }
            });
            tableData = [...tableData, rowData];
        });

        this.setState({ tableData, tableHead, loadingData: false, sumTotalPrice })
    }

    onLayout() {
        const { width, height } = Dimensions.get('window');
        width < height ? this.setState({ portrait: true }) : this.setState({ portrait: false });
    }

    sumTotalPrice = (dataRes) => {
        const taskActionCode = this.props.dataTask.taskDetail.task.taskAction.taskActionCode;
        const isLoadingTask = taskActionCode === TaskCode.SOAN_HANG;
        if (!dataRes || dataRes.length == 0) {
            return 0;
        }
        let sum = 0;
        dataRes.forEach(x => {
            if (isLoadingTask) {
                sum += x.totalPrice;
            } else {
                sum += x.receivedTotalPrice;

            }
        });
        return sum;
    };

    isHideFooter = () => {
        return this.props && this.props.properties && this.props.properties.isHideFooter && this.props.properties.isHideFooter === 'true';
    };

    renderFooterItem = (title, content) => {
        if (this.isHideFooter()) {
            return <View />;
        }
        return <View
            style={styles.footerContainer}
        >
            <TranslateText
                style={{ fontWeight: '500' }}
                value={title}
            />
            <Text style={{ fontWeight: '500' }}>{content}</Text>
        </View>;
    };

    renderFooter = () => {
        const { tableData, sumTotalPrice } = this.state
        return <View style={{ width: '100%' }}>
            {this.renderFooterItem('totalOrder', tableData.length)}
            {this.renderFooterItem('totalPrice', moneyFormat(sumTotalPrice))}
        </View>;
    };

    render() {
        const { loadingData, tableData, tableHead } = this.state;
        if (loadingData) {
            return <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        }
        const rowProps = {
            flexArr: [0.5, 0.5, 1, 0.5],
            alignItemsArr: ['flex-start', 'flex-start', 'flex-start', 'flex-end'],
            displayArr: this.state.portrait && ['flex', 'flex', 'flex', 'flex'],
        };
        return (
            <View
                onLayout={this.onLayout}
                style={{ marginTop: AppSizes.paddingSml }}
            >

                <Table>
                    <Row
                        data={tableHead}
                        style={styles.head}
                        textStyle={styles.textHead}
                        {...rowProps}

                    />
                    <Rows
                        data={tableData}
                        style={styles.row}
                        textStyle={styles.textData}
                        {...rowProps}
                    />
                    {this.renderFooter()}
                </Table>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    head: {
        height: AppSizes.paddingXSml * 7,
        borderColor: AppColors.separator,
        borderBottomWidth: AppSizes.paddingXXTiny,
        // paddingHorizontal: AppSizes.paddingMedium
    },
    row: {
        height: AppSizes.paddingXXLarge * 2,
        borderColor: AppColors.separator,
        borderBottomWidth: AppSizes.paddingXXTiny,
        // paddingHorizontal: AppSizes.paddingMedium
    },
    textHead: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontSmall,
        fontWeight: '400',
        opacity: 0.54,
        textAlignVertical: 'top',
        height: '100%',
        paddingHorizontal: AppSizes.paddingTiny,

        width: '100%'
    },
    textData: {
        ...AppStyles.regularText,
        fontWeight: '400',
        opacity: 0.87,
        textAlignVertical: 'top',
        height: '100%',
        paddingHorizontal: AppSizes.paddingTiny,
        width: '100%',
        borderColor: AppColors.separator,
        marginTop: AppSizes.paddingSml
    },
    loadingContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: AppSizes.paddingMedium
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: AppSizes.paddingMedium,
        height: AppSizes.paddingXXLarge * 2,
    }
});

export default connect(state => ({
    dataTask: state.task,
    orgConfig: state.user.orgConfig,
}))(TableView);

