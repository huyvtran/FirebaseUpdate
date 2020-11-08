import { Alert } from "react-native"
import { Localize } from "../modules/setting/languages/LanguageManager"
import messages from "../constant/Messages"

const showError = (messageContent) => {
    Alert.alert(Localize(messages.error), Localize(messageContent))
}

const showWarning = (messageContent, onPressOk?) => {
    Alert.alert(Localize(messages.warning), Localize(messageContent), [
        {
            text: Localize(messages.cancel),
        },
        {
            text: Localize(messages.ok), onPress: () => onPressOk && onPressOk()
        },
    ])
}

const showSuccess = (messageContent) => {
    Alert.alert(Localize(messages.success), Localize(messageContent))
}

const showConfirm = (messageContent, onPressOk?, onPressCancel?) => {
    Alert.alert(Localize(messages.confirm), Localize(messageContent), [
        {
            text: Localize(messages.cancel), onPress: () => onPressCancel && onPressCancel()
        },
        {
            text: Localize(messages.ok), onPress: () => onPressOk && onPressOk()
        },
    ])
}


export default { showError, showWarning, showSuccess, showConfirm }