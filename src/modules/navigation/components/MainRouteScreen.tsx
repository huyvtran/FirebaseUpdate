import React from 'react';
import { Component } from 'react';
import { Keyboard, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import TestID from '../../../../test/constant/TestID';
import IconAssets from '../../../assets/IconAssets';
import TabIcon from '../../../components/TabIcon';
import messages from '../../../constant/Messages';
import AlertUtils from '../../../utils/AlertUtils';
import PermissionUtils from '../../../utils/PermissionUtils';
import CustomerMain from '../../customer/CustomerMain';
import FreightMain from '../../freight/FreightMain';
import OrderMain from '../../orders/OrderMain';
import ProductMain from '../../product/components/ProductMain';
import ShipmentScreen from '../../shipment/ShipmentScreen';
import TaskList from '../../task/components/TaskList';
import TabsCode from '../tabs/TabsCode';


// import StringeeManager from '../../../components/stringee/StringeeManager';

const initRoute = [
    { key: messages.tabs.tasks, title: messages.tabs.tasks, component: <TaskList />, icon: IconAssets.task, tabCode: TabsCode.TASKS },
    // { key: messages.tabs.tasks, title: messages.tabs.tasks, component: <TaskListScreen />, icon: require('../../../assets/img/tabs/task.png'), tabCode: TabsCode.TASKS },
    { key: messages.tabs.shipments, title: messages.tabs.shipments, component: <ShipmentScreen />, icon: IconAssets.shipment, tabCode: TabsCode.SHIPMENT },
    { key: messages.tabs.shipmentHistory, title: messages.tabs.shipmentHistory, component: <ShipmentScreen isHistory />, icon: IconAssets.shipmentHistory, tabCode: TabsCode.SHIPMENT_HISTORY },
    { key: messages.tabs.products, title: messages.tabs.products, component: <ProductMain />, icon: IconAssets.product, tabCode: TabsCode.PRODUCTS },
    { key: messages.tabs.partners, title: messages.tabs.partners, component: <CustomerMain />, icon: IconAssets.customer, tabCode: TabsCode.CUSTOMERS },
    { key: messages.tabs.orders, title: messages.tabs.orders, component: <OrderMain />, icon: IconAssets.order, tabCode: TabsCode.ORDERS },
    { key: messages.tabs.freight, title: messages.tabs.freight, component: <FreightMain />, icon: IconAssets.freight, tabCode: TabsCode.FREIGHT },

]

interface Props{
    locale: any,
    orgSelectedIds: any,
    user: any,
    userData: any
}

interface States{
    index: number,
    routes: any[],
    isShowKeyBoard: boolean,
}

class MainRouteScreen extends Component<Props, States> {
    keyboardDidShowListener: any;
    keyboardDidHideListener: any;

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: this.calculateTabs(this.props.orgSelectedIds[0]),
            isShowKeyBoard: false,

        };
    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        // StringeeManager.clientDisConnect()
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow());
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
        //register stringee + connect client
        // StringeeManager.registerStringeeClient(this.refs.stringeeClient)
        // StringeeManager.registerStringeeCall(this.refs.stringeeCall)
        // StringeeManager.clientConnect(this.props?.userData?.user?._id)
    }

    _keyboardDidShow() {
        this.setState({ isShowKeyBoard: true })

    }

    _keyboardDidHide() {
        this.setState({ isShowKeyBoard: false })

    }

    componentWillReceiveProps(newsProps) {
        if (newsProps.orgSelectedIds && newsProps.orgSelectedIds[0] && this.props.orgSelectedIds && this.props.orgSelectedIds[0] && newsProps.orgSelectedIds[0] !== this.props.orgSelectedIds[0]) {
            this.setState({
                routes: this.calculateTabs(newsProps.orgSelectedIds[0])
            })
        }

    }

    calculateTabs(orgSelectId) {
        return initRoute.filter((route) => {
            return PermissionUtils.isGrantViewPermission(orgSelectId, route.tabCode)
        })

    }

    renderTabs() {

        const isShowTabLabel = this.state.routes.length < 6
        return (<View style={{ flex: 1, flexDirection: 'row', width: '100%', }}>
            {this.state.routes.map((route, index) => {

                return <TabIcon
                    selected={this.state.index === index}
                    tabBarLabel={route.title}
                    isShowTabLabel={isShowTabLabel}
                    iconActive={route.icon}
                    key={index + ""}
                    onPress={() => { this.setState({ index }) }} />
            })}
        </View>)
    }

    renderContent() {
        if (this.state.routes[this.state.index]) {
            return this.state.routes[this.state.index].component;

        }
        Actions.reset('login');
        AlertUtils.showWarning(messages.userHaveNoPermissionForAnyTabs)
        return <View />
    }

    render() {
        return (
            <View testID={TestID.mainScreen} style={{ flex: 1, height: '100%', width: '100%' }}>

                <View style={{ flex: 9 }}>
                    {this.renderContent()}

                </View>

                {!this.state.isShowKeyBoard && <View style={{ flex: 1 }} >
                    {this.renderTabs()}
                </View>}
                {/* <StringeeClient ref="stringeeClient" eventHandlers={StringeeManager.clientEventHandlers} />
                <StringeeCall ref="stringeeCall" eventHandlers={this.callEventHandlers} /> */}
            </View >
        );
    }
}

const styles = {
    container: {
        flex: 1,
    },

};

// Redux
const mapStateToProps = state => ({
    locale: state.i18n.locale,
    orgSelectedIds: state.org.orgSelectIds,
    user: state.user.readUser,
    userData: state.user
})

// Any actions to map to the component?
const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(MainRouteScreen);
