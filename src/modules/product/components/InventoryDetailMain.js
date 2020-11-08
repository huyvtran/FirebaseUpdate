import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { TabBar, SceneMap, TabView, PagerScroll } from 'react-native-tab-view';

import ProductList from './ProductList';
import InventoryList from './InventoryList';
import AppColors from '../../../theme/AppColors';
import messages from '../../../constant/Messages';
import HeaderDetail from '../../../components/HeaderDetail';
import InventoryDetail from './InventoryDetail';
import InventoryHistory from './InventoryHistory';
import { Actions } from 'react-native-router-flux';
import ProductDetail from './ProductDetail';
import { Localize } from '../../setting/languages/LanguageManager';
import AppStyles from '../../../theme/AppStyles';


const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};


let inventory = null;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        flex: 1
    }
})

const initRoute = [
    { key: messages.details, title: messages.details, component: <InventoryDetail inventory={inventory} /> },
    { key: messages.history, title: messages.history, component: <InventoryHistory inventory={inventory} /> },

]


class InventoryDetailMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: initRoute,
        };

        inventory = props.inventory;
    }

    componentDidMount() {

    }

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => {
        props.navigationState.routes = props.navigationState.routes.map((route, index) => {
            return { ...route, title: Localize(initRoute[index].title) }
        })
        return <TabBar
            {...props}
            style={{ height: 32, backgroundColor: AppColors.abi_blue, zIndex: 0 }}
            tabStyle={AppStyles.titleTabBarContainer}
            renderLabel={(scene) => {
                return <Text style={{ ...AppStyles.titleTabBar }}>{scene.route.title.toString().toUpperCase()}</Text>
            }}
            indicatorStyle={AppStyles.indicatorTabBar}
        />
    };

    _renderScene = ({ route }) => {

        console.log("_renderScene route>>", route);
        return React.cloneElement(
            route.component,
            { inventory: this.props.inventory }
        )

    };

    render() {
        return (
            <View style={styles.mainContainer}>

                <HeaderDetail
                    title={Localize(messages.productDetail)}
                />
                <TabView
                    style={styles.container}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={initialLayout}
                    renderPager={(props) => <PagerScroll {...props} />}
                />
            </View >
        );
    }
}


export default connect(
    state => ({

    }), {})(InventoryDetailMain);
