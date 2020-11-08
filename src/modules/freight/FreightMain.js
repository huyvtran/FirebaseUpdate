import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, Modal, Animated, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import { TabBar, TabView, PagerScroll } from 'react-native-tab-view';

import _ from 'lodash';
import messages from '../../constant/Messages';
import { Localize } from '../setting/languages/LanguageManager';
import AppColors from '../../theme/AppColors';
import HeaderView from '../../components/HeaderView';
import AppStyles from '../../theme/AppStyles';
import TrailerScreen from './TrailerScreen';
import ContainerScreen from './ContainerScreen';
import Divider from '../form/components/Divider';
import { H1 } from '../../theme/styled';
import { CheckBox } from 'react-native-elements'
import ButtonText from '../../components/ButtonText';
import FreightConstant from './FreightConstant';
import { Actions } from 'react-native-router-flux';
import AppSizes from '../../theme/AppSizes';
import OrgHelper from '../../utils/OrgUtils';
import ContainerBargeScreen from './ContainerBargeScreen';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

const initRoute = [
    { key: messages.container, title: messages.container, },
    { key: messages.trailer, title: messages.trailer, },

]

class FreightMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: initRoute,

            isSearchMode: false,
            isModalFilter: false,
            isMapMode: false,

            filterList: FreightConstant.FILTER_LIST,

            applyFilterList: FreightConstant.FILTER_LIST


        };
        typeShipment = OrgHelper.getShipmentType()
        this.isShipmentBarge = typeShipment === FreightConstant.SHIPMENT_TRANSPORT_MODE.BARGE
    }

    _handleIndexChange = index => this.setState({ index });

    onClickApllyFilter() {
        this.setState({ isModalFilter: false, applyFilterList: this.state.filterList })
    }

    onClickFilterCheckbox(filter) {
        const filterTrue = this.state.filterList.filter(filterItem => filterItem.checked);
        if (filterTrue.length === 1 && filterTrue[0].content === filter.content) {
            return
        }
        const filterResult = this.state.filterList.map(filterItem => {
            if (filter.content === filterItem.content) {
                return {
                    ...filter,
                    checked: !filter.checked,
                }
            }
            return filterItem
        })

        this.setState({ filterList: filterResult })
    }


    onChangeTextSearch = _.debounce((textSearch) => {
        if (initRoute[this.state.index].key === messages.container) {
            this.setState({ textContainerSearch: textSearch })

        } else {
            this.setState({ textTrailerSearch: textSearch })
        }
    }, 300);

    onClickBayMap = () => {
        this.containerBarge.getWrappedInstance().onClickBayMap()
    }

    _renderHeader = props => {

        props.navigationState.routes = props.navigationState.routes.map((route, index) => {
            return { ...route, title: Localize(initRoute[index].title) }
        })

        return <TabBar
            {...props}
            style={{ height: AppSizes.paddingMedium * 2, backgroundColor: AppColors.abi_blue, zIndex: 0 }}
            labelStyle={{ ...AppStyles.regularText, fontSize: AppSizes.fontSmall, color: 'white', zIndex: 0 }}
            tabStyle={AppStyles.titleTabBarContainer}
            renderLabel={(scene) => {
                return <Text style={{ ...AppStyles.titleTabBar }}>{scene.route.title.toString().toUpperCase()}</Text>
            }}
            indicatorStyle={AppStyles.indicatorTabBar}
        />

    };

    _renderScene = ({ route }) => {
        const filterList = this.state.applyFilterList.filter(item => item.checked)
        switch (route.key) {
            case messages.container:
                return <ContainerScreen filterList={filterList} textSearch={this.state.textContainerSearch} />
            default:
                return <TrailerScreen filterList={filterList} textSearch={this.state.textTrailerSearch} />

        }

    };

    renderCheckboxFilter(filter) {
        return <CheckBox
            left
            title={filter.content}
            checked={filter.checked}
            onPress={() => { this.onClickFilterCheckbox(filter) }}
            textStyle={{ ...AppStyles.regularText }}
            containerStyle={styles.containerCheckbox}
            checkedIcon='check-circle'
            uncheckedIcon='circle-o'
        />
    }

    renderFilterView() {
        return <View style={styles.containerModalFilter}>

            <View style={styles.modalContainer} >
                <View style={styles.mainModalContainer}>
                    <Text style={[styles.titleFilter, { marginLeft: 16 }]}>{'Filter'}</Text>
                    <Divider />
                    {this.state.filterList.map(filter => {
                        return this.renderCheckboxFilter(filter)
                    })}
                    <Divider />
                    <View style={styles.containerControlModal}>
                        <ButtonText
                            containerStyle={{ flex: 1 }}
                            content={Localize(messages.cancel)}
                            textStyle={styles.textControl}
                            onClick={() => { this.setState({ isModalFilter: false, filterList: this.state.applyFilterList }) }}
                        />
                        <Divider vertical />
                        <ButtonText
                            containerStyle={{ flex: 1 }}
                            content={messages.ok}
                            textStyle={styles.textControl}
                            onClick={() => { this.onClickApllyFilter() }}
                        />
                    </View>
                </View>


            </View>
        </View>
    }

    renderMainContent = () => {
        if (this.isShipmentBarge) {
            return <ContainerBargeScreen
                ref={ref => this.containerBarge = ref}
            />
        }
        return <TabView
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
            renderPager={(props) => <PagerScroll {...props} />}
        />
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    displayBayMap={this.isShipmentBarge}
                    onPressBayMap={() => this.onClickBayMap()}
                    // onBackSearch={() => this.setState({ textContainerSearch: '', textTrailerSearch: '' })}
                    onChangeText={(text) => this.onChangeTextSearch(text)}
                    displayAvatar
                    onPressFilter={() => { this.setState({ isModalFilter: true }) }}
                />
                {this.renderMainContent()}
                <Modal
                    animationType="fade"
                    visible={this.state.isModalFilter}
                    transparent={true}
                >
                    {this.renderFilterView()}
                </Modal>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f4f4',
        flex: 1,
        height: AppSizes.screenHeight
    },
    containerHeader: {
        flexDirection: 'row',
        backgroundColor: AppColors.abi_blue,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
        height: 56,
    },
    navBarText: {
        ...AppStyles.regularText,
        fontSize: 16,
        color: 'white'
    },
    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerSearch: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: 'center',
    },
    textInput: {
        fontSize: 14,
        flex: 8,
        backgroundColor: 'transparent',
        padding: 0,
        height: 30,

    },
    containerModalFilter: {
        backgroundColor: AppColors.lightGrayTrans,
        height: '100%',
        width: '100%'
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        height: '100%',
        flex: 1,
        backgroundColor: AppColors.addMoreButton,

    },
    mainModalContainer: {
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: AppColors.hintText,
        paddingTop: 8,
        // paddingBottom: 8,
        width: AppSizes.screenWidth - 32,
        maxHeight: AppSizes.screenHeight / 2

    },
    containerCloseModal: {
        position: 'absolute',
        backgroundColor: '#8c8c8c',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 24,

    },
    titleFilter: {
        ...H1,
        marginTop: 12,
        marginBottom: 12,
    },
    containerCheckbox: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0
    },
    containerControlModal: {
        width: '100%',
        flexDirection: 'row',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    textControl: {
        ...AppStyles.regularText,
        color: AppColors.textContent,
        fontSize: 14
    }
});
export default connect(state => ({
    locale: state.i18n.locale,
    org: state.org.orgSelect,
}), {
})(FreightMain);
