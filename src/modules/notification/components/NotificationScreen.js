import React, { PureComponent, Component } from 'react';
import { FlatList, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import NotificationItem from './NotificationItem';
import Messages from "../../../constant/Messages";
import NavigationHelper from '../../navigation/helpers/NavigationHelper';
import LanguageManager, { Localize } from '../../setting/languages/LanguageManager';
import API from '../../../network/API';
import AppStyles from '../../../theme/AppStyles';
import AwesomeListComponent from 'react-native-awesome-list';
import HeaderDetail from '../../../components/HeaderDetail';
import messages from '../../../constant/Messages';
import { Actions } from 'react-native-router-flux';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import _ from 'lodash'
import AppSizes from '../../../theme/AppSizes';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    containerMarkRead: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: 'white',

    },
    textMarkRead: {
        color: '#455A64',
        fontSize: 16
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#d9d9d9'
    }
})

class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    source = (pagingData) => {
        const { user } = this.props;
        const recipientId = user ? user._id : '';
        return API.notificationList(recipientId, pagingData)
    }


    renderItem = ({ item }) => (
        <NotificationItem
            onPress={() => this.onClickNotificationItem(item)}
            item={item}
        />
    )

    onClickNotificationItem(notification) {
        //In case notification is unread
        if (!notification.activity) {
            API.updateStatusNotification(this.props.user._id, notification.target, false).then(res => {

                this.notificationList.refresh()
                NavigationHelper.handleNotification(notification);
            })
            return;
        }

        NavigationHelper.handleNotification(notification);

    }

    onClickMarkAllRead() {
        API.updateStatusNotification(this.props.user._id, null, true).then(res => {

            this.notificationList.refresh()

        })
    }

    keyExtractor = (item) => item._id

    transformer(res) {
        return _.orderBy(res.data.data, ['date'], ['desc']);
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderDetail
                    title={Localize(messages.notification.notification)}
                />
                <TouchableOpacity style={styles.containerMarkRead} onPress={() => this.onClickMarkAllRead()}>
                    <Text style={styles.textMarkRead}>{Localize(Messages.markRead)}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <AwesomeListComponent
                    ref={ref => this.notificationList = ref}
                    containerStyle={{
                        backgroundColor: 'white',
                        marginLeft: 16,
                        marginRight: 16,
                        width: AppSizes.screenWidth,
                        height: '100%'
                    }}
                    isPaging
                    source={(pagingData) => this.source(pagingData)}
                    transformer={(response) => this.transformer(response)}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item) => this.keyExtractor(item)}
                    emptyText={Localize(Messages.noResult)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.notificationList.onRetry()} />}

                />
            </View >
        );
    }
}

export default connect(state => ({
    notification: state.notification,
    user: state.user.user,
    locale: state.i18n.locale
}), {})(NotificationScreen);

