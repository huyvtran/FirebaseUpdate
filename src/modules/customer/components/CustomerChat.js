import React, {Component} from 'react';
import {View, Image, FlatList, Text, TextInput, Platform, KeyboardAvoidingView} from 'react-native';
import {connect} from 'react-redux';
import HeaderDetail from '../../../components/HeaderDetail';
import {H1} from '../../../theme/styled';
import AppSizes from '../../../theme/AppSizes';
import Messages from "../../../constant/Messages";
import AppColors from "../../../theme/AppColors";
import AppStyles from "../../../theme/AppStyles";
import ButtonText from "../../../components/ButtonText";
import {Localize} from "../../setting/languages/LanguageManager";
import ButtonIcon from "../../../components/ButtonIcon";
import FirebaseDatabaseManager from "../../../firebase/FirebaseDatabaseManager";
import {timeToDDDMMMYY} from "../../../utils/TimeUtils";

const styles = {
    container: {
        backgroundColor: 'white',
        height: '100%'
    },
    profileContainer: {
        marginTop: AppSizes.paddingLarge * 5
    },
    profile: {
        width: AppSizes.paddingLarge * 10,
        position: 'absolute',
        alignSelf: 'center',
        marginTop: -AppSizes.paddingLarge * 7,
        marginBottom: AppSizes.paddingSml,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        height: AppSizes.paddingLarge * 5,
        width: AppSizes.paddingLarge * 5
    },
    driverChatItemContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: AppSizes.paddingSml,
        paddingVertical: AppSizes.paddingTiny,
        width: AppSizes.screenWidth,
        backgroundColor: 'white',
    },
    customerChatItemContainer: {
        paddingVertical: AppSizes.paddingTiny,
        width: AppSizes.screenWidth,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',

    },
    customerAva: {
        height: AppSizes.paddingMedium,
        width: AppSizes.paddingMedium,
        borderRadius: AppSizes.paddingMedium / 2,
        marginRight: AppSizes.paddingSml
    },
    chatTextContainer: {
        backgroundColor: AppColors.abi_blue_light,
        maxWidth: '70%',
        borderRadius: AppSizes.paddingXXSml,
        padding: AppSizes.paddingXXSml
    },
    textInputContainer: {
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    },
    containerSearch: {
        backgroundColor: 'white',
        height: '100%',
        flexDirection: 'row',
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: 'center',

        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingMicro,
        borderColor: AppColors.lightgray,
        flex: 8.5
    },
    textInput: {
        ...AppStyles.regularText,
        flex: 8,
        backgroundColor: 'transparent',
        padding: 0,
        height: AppSizes.paddingSml * 3,

    },
    timeText: {
        ...AppStyles.italicText,
        color: AppColors.grayLight,
        marginVertical: AppSizes.paddingXXSml
    }

};
const VIEW_TYPE = {
    CUSTOMER: 'CUSTOMER',
    DRIVER: 'DRIVER'
};
const DATA_SAMPLE = [
    {
        id: 2,
        content: 'Thanks. I am ok',
        type: VIEW_TYPE.DRIVER,
    },
    {
        id: 1,
        content: 'Hi Mark, Are you ok?',
        type: VIEW_TYPE.CUSTOMER,
    },

];

class CustomerChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingChat: true,
            chatList: []
        };
    }

    componentDidMount() {
        const {order} = this.props;

        FirebaseDatabaseManager.onListenCustomerChat(order._id, (chatList) => {
            this.setState({
                chatList,
                loadingChat: false
            });
        });
    }

    onChangeText = (text) => {
        this.textChat = text;
    };

    onClickSend = () => {
        const {order} = this.props;
        const chatParam = {
            id: (new Date()).getTime(),
            timeStamp: (new Date()).getTime(),
            type: VIEW_TYPE.DRIVER,
            content: this.textChat
        };
        FirebaseDatabaseManager.chatWithCustomer(chatParam, order._id);
        this.chatTextInput.clear();
    };

    isLastChatItem = (index) => {
        return index === 0;
    };

    renderChatItem(chatItem, index) {
        if (!chatItem) return <View/>;

        switch (chatItem.type) {
            case VIEW_TYPE.DRIVER:
                return this.renderDriverChatItem(chatItem, index);
            case VIEW_TYPE.CUSTOMER:
                return this.renderCustomerChatItem(chatItem, index);
        }


    }

    renderDriverChatItem(chatItem, index) {
        return <View style={[styles.driverChatItemContainer,]}>
            <View style={styles.chatTextContainer}>
                <Text style={{
                    ...AppStyles.regularText,
                    color: 'white'
                }}>{chatItem.content}</Text>

            </View>
            {this.isLastChatItem(index) &&
            <Text style={styles.timeText}>{timeToDDDMMMYY(chatItem.timeStamp)}</Text>}

        </View>;
    }

    renderCustomerChatItem(chatItem, index) {
        return <View style={{
            width: '100%',
            paddingHorizontal: AppSizes.paddingSml,
        }}>
            <View style={styles.customerChatItemContainer}>
                <Image style={styles.customerAva}
                       source={require('../../../assets/icon/iconPerson.png')}/>
                <View style={styles.chatTextContainer}>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: 'white'
                    }}>{chatItem.content}</Text>

                </View>
            </View>
            {this.isLastChatItem(index) &&
            <Text style={styles.timeText}>{timeToDDDMMMYY(chatItem.timeStamp)}</Text>}

        </View>;
    }

    renderTextInput() {

        return <View style={{
            flexDirection: 'row',
            width: '100%',
            borderTopColor: AppColors.lightgray,
            borderTopWidth: 1,
            paddingTop: AppSizes.paddingSml,
            paddingHorizontal: AppSizes.paddingSml
        }}>
            <View style={styles.containerSearch}>
                <TextInput
                    ref={ref => this.chatTextInput = ref}
                    keyboardShouldPersistTaps='always'
                    style={styles.textInput}
                    onChangeText={(text) => this.onChangeText(text)}
                    placeholder={Localize(Messages.enter)}
                    autoFocus
                    autoCorrect={false}
                    autoCapitalize='none'
                    underlineColorAndroid='rgba(0,0,0,0)'
                />
            </View>

            <ButtonIcon
                containerStyle={{
                    flex: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                iconName={'send'}
                iconColor={AppColors.abi_blue}
                iconSize={AppSizes.paddingLarge}
                onPress={() => {
                    this.onClickSend();
                }}
            />
        </View>;
    }

    renderChatContent() {
        return <View style={{flex: 1}}>
            <FlatList
                style = {{height: AppSizes.screenHeight - 200}}
                keyExtractor={item => item && item.id}
                refreshing={this.state.loadingChat}
                inverted
                data={this.state.chatList}
                renderItem={({item, index}) => this.renderChatItem(item, index)}/>
            {this.renderTextInput()}
        </View>;
    }

    renderMainContent() {
        if (Platform.OS === 'ios') {
            return <KeyboardAvoidingView
                style={styles.textInputContainer}
                behavior={"padding"}
                keyboardVerticalOffset={30}>
                {this.renderChatContent()}
            </KeyboardAvoidingView>;
        } else {
            return <View style={[styles.textInputContainer, {paddingVertical: AppSizes.paddingSml}]}>
                {this.renderChatContent()}
            </View>;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderDetail title={Localize(Messages.chat)}/>
                {this.renderMainContent()}
            </View>
        );
    }


}

export default CustomerChat;
