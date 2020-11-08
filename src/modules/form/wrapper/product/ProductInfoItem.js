import React, { Component } from 'react';
import {
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
    TouchableHighlight,
    Alert,
    StyleSheet,
    Modal,
    Image
} from 'react-native';
import { H1 } from '../../../../theme/styled';
import AppColors from '../../../../theme/AppColors';
import Divider from '../../components/Divider';
import OrderHelper from '../../../orders/helpers/OrderHelper';
import AppStyles from '../../../../theme/AppStyles';
import ButtonIcon from '../../../../components/ButtonIcon';
import { Localize } from '../../../setting/languages/LanguageManager';
import messages from '../../../../constant/Messages';
import TaskCode from '../../../../constant/TaskCode';
import AppSizes from '../../../../theme/AppSizes';
class ProductInfoItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false
        }
    }
    renderProductInfoItem(title, content, onPress) {
        return <TouchableOpacity disabled={!onPress} style={{ flexDirection: 'row', marginBottom: AppSizes.paddingXXMedium, alignItems: 'center' }} onPress={onPress && onPress}>
            <Text style={styles.titleText}>{title}</Text>
            {typeof content === 'string' ? <Text style={styles.contentText}>{content}</Text> : content}
        </TouchableOpacity>
    }

    renderOrderInfoList = (product) => {
        const orderProduct = OrderHelper.findOrderContainProduct(this.props.orderList, product)
        let orderView = []
        for (index = 0; index < orderProduct.length; index++) {
            if (index === 2) {
                orderView.push(this.renderOrderInfoItem({ orderCode: '...' }))
                break;
            }
            orderView.push(this.renderOrderInfoItem(orderProduct[index]))
        }
        return orderView;
    }

    renderOrderInfoItem(order) {
        return (<View style={styles.orderInfoItem}>
            <Text style={styles.contentText}>{order.orderCode}</Text>
        </View>)

    }

    renderOrderInfoDetail(product) {
        const orderProduct = OrderHelper.findOrderContainProduct(this.props.orderList, product)
        return orderProduct.map(order => {
            return <View style={{ marginLeft: AppSizes.paddingMedium, marginRight: AppSizes.paddingMedium }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: AppSizes.paddingXXMedium, marginBottom: AppSizes.paddingXXMedium }}>
                    <Text style={styles.contentText}>{order.orderCode}</Text>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ width: AppSizes.paddingXMedium, height: AppSizes.paddingXMedium, marginRight: AppSizes.paddingXSml }} source={require('../../../../assets/icon/iconCase.png')} />
                        <Text style={styles.contentText}>{order.skuList.length}</Text>

                    </View>

                </View>
                <View style={{ width: '100%', backgroundColor: '#d3dfe4', height: AppSizes.paddingXXTiny, alignSelf: 'flex-end', marginBottom: AppSizes.paddingMedium, }} />
            </View>
        })

    }

    onClickInfoOrder(product) {
        this.setState({ modalVisible: true })
    }
    renderbillDelivery() {
        const { product } = this.props
        return (
            <View style={styles.container} >
                <Text style={styles.productName}>{product.productDetail}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {this.renderProductInfoItem(`${Localize(messages.totalCases)} | ${Localize(messages.totalItems)}:  `, product.numberOfCase + ' | ' + product.numberOfItem)}
                    {/* {this.renderProductInfoItem(`${Localize(messages.totalItems)}:  `, product.numberOfItem + ' ')} */}
                    {this.renderProductInfoItem(`${Localize(messages.code)}: `, product.sku)}

                </View>
                <View style={{ width: '100%', backgroundColor: '#d3dfe4', height: 1, alignSelf: 'flex-end', marginBottom: 16, }} />
                {/* {this.renderProductInfoItem(`${Localize(messages.inOrder)}: `, this.renderOrderInfoList(product), () => this.onClickInfoOrder(product))}

       
        <Modal
            animationType="fade"
            visible={this.state.modalVisible}
            transparent={true}
        >

            <View style={styles.modalContainer} >
                <View style={styles.mainModalContainer}>
                    <Text style={[styles.productName, { marginLeft: 16 }]}>{product.productDetail}</Text>
                    <Divider />
                    {this.renderOrderInfoDetail(product)}
                </View>

                <View style={styles.containerCloseModal}>
                    <ButtonIcon
                        iconName={'clear'}
                        iconSize={18}
                        iconColor={'white'}
                        onPress={() => this.setState({ modalVisible: false })}
                    />
                </View>
            </View>

        </Modal> */}
            </View>
        )
    }


    renderbillReceipt() {
        const { product } = this.props
        const numberTotal = product.numberOfCase * product.numberPerCase + product.numberOfItem
        const numberDelivery = product.numberOfCaseDelivered * product.numberPerCase + product.numberOfItemDelivered
        const numberRest = numberTotal - numberDelivery
        const numberOfCase = Math.floor(numberRest / product.numberPerCase)
        const numberOfItem = numberRest % product.numberPerCase
        if (numberRest !== 0) {
            return (
                <View style={styles.container} >
                    <Text style={styles.productName}>{product.productDetail}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {this.renderProductInfoItem(`${Localize(messages.totalCases)} | ${Localize(messages.totalItems)}:  `, numberOfCase + ' | ' + numberOfItem)}
                        {this.renderProductInfoItem(`${Localize(messages.code)}: `, product.sku)}
                    </View>
                </View>
            )
        }

    }
    render() {
        const taskActionCode = this.props.taskAction.taskActionCode;
        return (
            <View>
                {taskActionCode === TaskCode.SOAN_HANG ? this.renderbillDelivery() : this.renderbillReceipt()}
            </View>
        )
    }
}
const styles = {
    container: {
        flex: 1,
        paddingLeft: AppSizes.paddingMedium,
        paddingRight: AppSizes.paddingMedium,
    },
    productName: {
        ...H1,
        marginTop: AppSizes.paddingXXMedium,
        marginBottom: AppSizes.paddingXXMedium,
    },
    titleText: {
        ...AppStyles.regularText,
        color: AppColors.placeHolder,
    },
    contentText: {
        ...AppStyles.regularText,
        color: AppColors.textColor
    },
    orderInfoItem: {
        paddingTop: AppSizes.paddingTiny,
        paddingBottom: AppSizes.paddingTiny,
        paddingLeft: AppSizes.paddingXSml,
        paddingRight: AppSizes.paddingXSml,
        borderRadius: AppSizes.paddingXXMedium,
        backgroundColor: '#f3f3f3',

    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: AppSizes.paddingMedium,
        height: '100%',
        flex: 1,
        backgroundColor: AppColors.addMoreButton,

    },
    mainModalContainer: {
        backgroundColor: 'white',
        borderRadius: AppSizes.paddingXXSml,
        borderWidth: 0.5,
        borderColor: AppColors.hintText,
        paddingTop: AppSizes.paddingXSml,
        paddingBottom: AppSizes.paddingXSml,
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
        maxHeight: AppSizes.screenHeight / 2

    },
    containerCloseModal: {
        position: 'absolute',
        backgroundColor: '#8c8c8c',
        width: AppSizes.paddingLarge * 2,
        height: AppSizes.paddingLarge * 2,
        borderRadius: AppSizes.paddingLarge,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: AppSizes.paddingXXLarge,

    }
};
export default ProductInfoItem;