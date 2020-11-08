import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { TextInput, Text, View, StyleSheet, Image, TouchableOpacity, SectionList, FlatList, Animated, InteractionManager, StatusBar, Alert, Keyboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ButtonIcon from "../ButtonIcon";
import AppColors from "../../theme/AppColors";
import Divider from "../../modules/form/components/Divider";
import AppStyles from "../../theme/AppStyles";
import AwesomeListComponent from 'react-native-awesome-list';
import _ from 'lodash'
import { HeaderSearchComponent } from '../HeaderSearchComponent';
import ErrorAbivinView from '../ErrorAbivinView';
import AppSizes from '../../theme/AppSizes';
const MODE = {
    SEARCH: 'search',
    NORMAL: 'normal'
}

interface Configuration {
    selected: string,
    itemText: string,
    source: string,
    transformer: string,
    title: string
}
interface SelectItemInterface {
    config(): Configuration;
}

class SelectItemsComponent extends Component implements SelectItemInterface {

    static propsType = {
        callback: PropTypes.func,
        selected: PropTypes.any,
    }

    static defaultProps = {
        callback: null,
        selected: null,
    }

    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            mode: MODE.NORMAL
        }
    }

    componentWillMount() {
        if (!this.config) throw 'Component must be implement config() function';
        this.configuration = this.config();
    }

    onChangeText = _.debounce((text) => {
        if (_.isEmpty(text)) {
            this.selectItemList.removeFilter()
            return
        }
        this.selectItemList.applyFilter((item, index) => {
            return this.configuration.itemText(item, index).toLowerCase().includes(text.toLowerCase())
        })

    }, 300);

    onClickItem = _.throttle((item) => {
        Actions.pop();
        if (_.isFunction(this.props.callback)) {
            this.props.callback(item);
        }
    }, 300, { trailing: false })


    renderItem({ item, index }) {
        const textContent = this.configuration.itemText(item, index);
        return <TouchableOpacity keyboardShouldPersistTaps='always' style={{ margin: AppSizes.paddingXSml, justifyContent: 'center' }}

            onPress={_.throttle(() => {
                this.onClickItem(item)
            }, 500, { trailing: false })}>
            <Text style={styles.itemText}>{textContent}</Text>
            <Divider style={{ width: AppSizes.screenWidth - AppSizes.paddingMedium * 2, top: AppSizes.paddingXSml, bottom: AppSizes.paddingXSml, left: AppSizes.paddingMedium, right: AppSizes.paddingMedium, }} />
        </TouchableOpacity>
    }
    renderErrorView() {
        return <View></View>
    }

    renderHeaderBar() {
        switch (this.state.mode) {
            case MODE.NORMAL:
                return <View style={styles.containerNormalHeader}>
                    <ButtonIcon
                        iconName={'arrow-back'}
                        iconSize={AppSizes.paddingXLarge}
                        iconColor={'white'}
                        onPress={() => Actions.pop()}
                    />
                    <Text style={styles.textHeader}>{this.configuration.title}</Text>
                    <ButtonIcon
                        iconName={'search'}
                        iconSize={AppSizes.paddingXLarge}
                        iconColor={'white'}
                        onPress={() => this.setState({ mode: MODE.SEARCH })}
                    />
                </View>
            case MODE.SEARCH:
                return <HeaderSearchComponent
                    onChangeText={(text) => this.onChangeText(text)}
                    onPressCloseSearch={() => {
                        this.setState({ mode: MODE.NORMAL }, () => { this.selectItemList.removeFilter() })

                    }}

                />

        }
    }

    render() {
        return (
            <View style={styles.container} keyboardShouldPersistTaps='always'>
                <View style={styles.containerHeader}>

                    {this.renderHeaderBar()}

                </View>
                <AwesomeListComponent
                    source={() => this.configuration.source()}
                    transformer={(response) => this.configuration.transformer(response)}
                    ref={ref => this.selectItemList = ref}
                    renderItem={(item, index) => this.renderItem(item, index)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.selectItemList.onRetry()} />}

                />
            </View>
        );
    }

}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orgList: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    itemText: {
        marginLeft: AppSizes.paddingMedium,
        marginTop: AppSizes.paddingXSml,
        marginRight: AppSizes.paddingMedium,
        fontSize: AppSizes.fontBase,
        color: AppColors.textContent
    },
    textHeader: {

        fontSize: AppSizes.fontBase,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        // lineHeight: 14,
        alignSelf: 'center'
    },
    containerHeader: {
        backgroundColor: AppColors.abi_blue,
        width: '100%',
        flexDirection: 'row',
        height: AppSizes.paddingXMedium * 4,


    },
    containerNormalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: AppSizes.paddingXMedium * 4,
        alignItems: 'center',
    },
    containerSearch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        height: '100%',
        width: '100%'
    },
    textInput: {
        flex: 1,
        fontSize: AppSizes.fontBase,
        width: '100%',
        backgroundColor: 'white',
        padding: 0,
        color: AppColors.textContent,
        paddingLeft: AppSizes.paddingXSml,
        paddingRight: AppSizes.paddingXSml,
        borderRadius: AppSizes.paddingTiny,
    },

})

export default SelectItemsComponent;