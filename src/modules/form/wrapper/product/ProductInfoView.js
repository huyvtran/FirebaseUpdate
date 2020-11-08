import React, { PureComponent, Component } from 'react';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import OrderHelper from '../../../orders/helpers/OrderHelper';
import API from '../../../../network/API';
import ProductInfoItem from './ProductInfoItem';
import AppStyles from '../../../../theme/AppStyles';
import AwesomeListComponent from 'react-native-awesome-list';
import AppSizes from '../../../../theme/AppSizes';

class ProductInfoView extends Component {

    constructor(props) {
        super(props)
        this.orderList = [];
        this.products = []
        this.taskAction = {}
    }


    source = () => {
        const { dataTask, orgConfig } = this.props
        const orderIds = OrderHelper.getOrderIdFromTask(dataTask?.data ?? []);
        return API.orderListFromOrderIds(orderIds, orgConfig?.configurations?.longhaul ?? false)
    }

    transform = (res) => {
        const { dataTask } = this.props
        const orderList = res?.data?.data ?? []
        this.orders = OrderHelper.calculateTripOrder(orderList, dataTask.data, dataTask.taskDetail)
        this.products = OrderHelper.getProductListFromOrders(this.orders)
        this.taskAction = dataTask.taskDetail.task.taskAction;
        return this.products
    }

    listRowRender = ({ item }) => (
        <ProductInfoItem
            product={item}
            orderList={this.orders}
            taskAction={this.taskAction}
        />
    )

    keyExtractor = (item) => item._id

    render() {

        return (
            <AwesomeListComponent
                ref={ref => this.productInfoList = ref}
                source={() => this.source()}
                transformer={this.transform}
                renderItem={(item) => this.listRowRender(item)}
                keyExtractor={(item) => this.keyExtractor(item)}
                renderEmptyView={() => <View />}
            />
        );
    }
}

export default connect(state => ({
    dataTask: state.task,
    orgConfig: state.user.orgConfig,

}), {})(ProductInfoView);
