//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import warningIcon from '../../../assets/icon/notification/iconWarningTask.png';
import infoIcon from '../../../assets/icon/notification/iconInfoTask.png';
import NotificationManager from '../NotificationManager';
import AppStyles from '../../../theme/AppStyles';
import Divider from '../../form/components/Divider';
import HTMLView from 'react-native-htmlview';
import AppSizes from '../../../theme/AppSizes';
const styleHtml = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
});
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    timeText: {
        fontSize: 14,
        lineHeight: 17,
        color: '#909090',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    content: {
        fontSize: 14,
        lineHeight: 17,
        color: '#455A64',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    icon: {
        height: 40,
        width: 40,
        alignSelf: 'center',
        position: 'absolute'
    },
    imageContainer: {
        height: 40,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    }
});

class NotificationItem extends Component {
    getDate(date) {
        var newDate = new Date();
        var oldDate = new Date(date);
        var changeNumber = newDate.getTime() - oldDate.getTime();
        if (changeNumber > 86400000) {
            return parseInt(changeNumber / 86400000) + ' day ago.';
        } else if (changeNumber > 3600000) {
            return parseInt(changeNumber / 3600000) + ' hour ago.';
        } else {
            return parseInt(changeNumber / 60000) + ' minute ago.';
        }
    }
    getTaskIcon(notification) {
        switch (notification.notificationStatus) {
            case NotificationManager.messageType.WARNING:
                return warningIcon;
            case NotificationManager.messageType.INFO:
                return infoIcon;
            default:
                return infoIcon
        }
    }

    getContentColor(notification) {
        switch (notification.notificationStatus) {
            case NotificationManager.messageType.WARNING:
                return '#F2405D';
            case NotificationManager.messageType.INFO:
                return '#455A64';
            default:
                return infoIcon
        }
    }
    render() {
        item = this.props.item;
        const backgroundColor = item.activity ? 'white' : 'rgba(27,100,176, 0.12)'
        const { onPress } = this.props;
        if (item != null) {
            return (
                <TouchableOpacity onPress={onPress && onPress} style={[{ backgroundColor, width: AppSizes.screenWidth - 32 }]}>

                    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.icon}
                                source={this.getTaskIcon(item)}
                            />
                        </View>

                        <View style={{ flexDirection: 'column', width: '80%', backgroundColor: 'rgba(0,0,0,0)' }}>
                            <HTMLView
                                style={[styles.content, { color: this.getContentColor(item) }]}
                                value={item.body}
                                stylesheet={styleHtml}
                            />
                            <Text style={styles.timeText}>
                                {this.getDate(item.date)}
                            </Text>
                        </View>
                    </View>
                    <Divider style={{ width: AppSizes.screenWidth - 32 }} />
                </TouchableOpacity >
            );
        }
        return (null);
    }

}

//make this component available to the app
export default NotificationItem;
