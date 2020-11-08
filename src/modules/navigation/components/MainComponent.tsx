import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import messages from '../../../constant/Messages';
import FirebaseAnalyticsManager from '../../../firebase/FirebaseAnalyticsManager';
import { hasPermission, onMessage, onNotification, requestPermission } from '../../../firebase/FirebaseMessage';
import AlertUtils from '../../../utils/AlertUtils';
import NotificationManager from '../../notification/NotificationManager';

/**
 * this api is fake api to check force update function
 * will return a version that can be configged 
 * format response : 
 * {
 *     version : 3059
 * }
 */
// const getVersionAppMork = create({
//     timeout: 100000,
//     baseURL: 'https://randomapi.com/api/b00c8f91c1eb622dc2d976c272a493ec',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

interface Props {
    state: any
}
class MainComponent extends Component<Props, any> {
    unsubscribeFromNotificationListener: () => any;
    messageListener: () => any;

    componentDidMount() {
        this.checkNotificationPermission()

    }

    componentWillReceiveProps(newProps) {
        FirebaseAnalyticsManager.sendScreenInfoToFirebase()
    }

    //UI CONTROL ---------------------------------------------------------------------------------

    checkNotificationPermission = async () => {
        const enabled = await hasPermission();
        if (enabled) {
            // user has permissions
            this.onNotification()
        } else {
            // user doesn't have permission
            this.requestNotificationPermission()
        }
    }

    requestNotificationPermission = () => {
        requestPermission()
            .then(() => {
                // User has authorised  
                this.onNotification()
            })
            .catch(error => {
                // User has rejected permissions 
                AlertUtils.showWarning(messages.notGrantForNotiPermisson)

            });
    }

    onNotification() {
        // if (Platform.OS == 'ios') {
        // } else {
        // }
        this.onMessagesListener()

        this.onNotificationListener()

    }

    onNotificationListener = () => {
        // the listener returns a function you can use to unsubscribe
        this.unsubscribeFromNotificationListener = onNotification((notification) => {
            NotificationManager.onNotification(notification)
        });
    }

    onMessagesListener = () => {
        this.messageListener = onMessage((message) => {
            // Process your message as required
            if (message && message._data) {
                NotificationManager.onNotification(message._data)

            }
        });
    }
    //UI RENDER ----------------------------------------------------------------------------------
    render() {
        return null
    }
};

// Redux
const mapStateToProps = state => ({
    state: state
})

// Any actions to map to the component?
const mapDispatchToProps = {
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(MainComponent);
