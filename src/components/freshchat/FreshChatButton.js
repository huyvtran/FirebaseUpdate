import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ImageBackground, ViewPropTypes, Text } from 'react-native';
import { connect } from 'react-redux';

import ActionButton from 'react-native-action-button';

import { Icon } from 'react-native-elements'
import {
    Freshchat,
    FreshchatConfig,
    FaqOptions,
    ConversationOptions,
    FreshchatUser,
    FreshchatMessage,
    FreshchatNotificationConfig
} from 'react-native-freshchat-sdk';
import AppColors from '../../theme/AppColors';
import { Badge } from 'react-native-elements';
import NotificationManager from '../../modules/notification/NotificationManager';
import { Localize } from '../../modules/setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import AppSizes from '../../theme/AppSizes';

const SIZE_BUTTON = AppSizes.padding * 3
class FreshChatButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unReadMessgaeCont: 0,
        };
    }

    componentDidMount() {
        this.getUnreadMessages();

        Freshchat.addEventListener(
            Freshchat.EVENT_UNREAD_MESSAGE_COUNT_CHANGED,
            () => {
                console.log("onUnreadMessageCountChanged triggered");
                this.getUnreadMessages()
            }
        );
    }

    getUnreadMessages() {
        Freshchat.getUnreadCountAsync((data) => {
            var count = data.count;
            var status = data.status;

            if (status) {
                console.log("Message count: " + count);
                if (this.state.unReadMessgaeCont < count) {
                    NotificationManager.showMessageBar(Localize(messages.notiNewMessage), NotificationManager.messageType.INFO, () => {
                        Freshchat.showConversations();
                    }, NotificationManager.DURATION.LONG)
                }
                this.setState({
                    unReadMessgaeCont: count
                });
            } else {
                console.log("getUnreadCountAsync unsuccessful");
            }
        });
    }
    render() {
        return (
            <View style={styles.containerStyle}>

                <TouchableOpacity style={styles.containerIcon}
                    onPress={() => Freshchat.showConversations()}>
                    <Icon name="chat" color='white' style={{
                        fontSize: AppSizes.fontMedium,
                        height: AppSizes.paddingXLarge,
                    }} />
                </TouchableOpacity>

                {this.state.unReadMessgaeCont > 0 && <Badge value={this.state.unReadMessgaeCont}
                    wrapperStyle={styles.badgeContainer}
                    containerStyle={styles.badgeContainer}
                    textStyle={[{ color: AppColors.white }]}
                />}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        position: 'absolute',
        bottom: AppSizes.paddingSml * 5,
        right: AppSizes.paddingSml * 3,
        width: SIZE_BUTTON + 10,
        height: SIZE_BUTTON + 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerIcon: {
        width: SIZE_BUTTON,
        height: SIZE_BUTTON,
        borderRadius: SIZE_BUTTON / 2,
        backgroundColor: AppColors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.35,
        shadowOffset: {
            width: 0,
            height: AppSizes.paddingTiny
        },
        shadowColor: "#000",
        shadowRadius: 3,
        elevation: 5
    },
    badgeContainer: {
        backgroundColor: AppColors.red,
        width: AppSizes.paddingLarge,
        height: AppSizes.paddingLarge,
        borderRadius: 10,
        position: 'absolute',
        right: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    textBadge: {
        fontSize: AppSizes.fontSmall,
        color: 'white',
        width: AppSizes.paddingLarge,
        height: AppSizes.paddingLarge,
        borderRadius: AppSizes.paddingLarge / 2,
        textAlign: 'center',
    }

});

// Redux
const mapStateToProps = state => ({


})

// Any actions to map to the component?
const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(FreshChatButton);