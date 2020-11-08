import Toast from 'react-native-root-toast';
import DynamicServerManager from '../data/DynamicServerManager';
const show = (messages) => {
    if (!DynamicServerManager.getDynamicServer().showTimeResponse) {
        return
    }
    Toast.show(messages, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,

    });
}
export default {
    show
}