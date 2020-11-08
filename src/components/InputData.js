import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ViewPropTypes,
    ScrollView,
    Keyboard,
    BackHandler

} from 'react-native';
import AppColors from '../theme/AppColors';
import AppStyles from '../theme/AppStyles';
import ButtonText from './ButtonText';
import { Localize } from '../modules/setting/languages/LanguageManager';
import messages from '../constant/Messages';
import { Actions } from 'react-native-router-flux';
import AppSizes from '../theme/AppSizes';
import _ from 'lodash'
import AlertUtils from '../utils/AlertUtils';
const styles = {
    container: {
        backgroundColor: AppColors.graytrans,
        flex: 1,
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        left: 0
    },
    textInputContainer: {
        width: '100%',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        backgroundColor: 'white',
        flexDirection: 'row',
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
    doneText: {
        ...AppStyles.regularText,
        textAlign: 'center',
        color: AppColors.abi_blue
    }
}
class InputData extends Component {
    static propTypes = {
        hintText: ViewPropTypes.string,
        keyboardType: ViewPropTypes.number,
        onCallBackValue: ViewPropTypes.func,
    };

    static defaultProps = {
        keyboardType: 'default',
        hintText: messages.enter
    }
    constructor(props) {
        super(props)
        this.state = {
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow());
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());

    }

    _keyboardDidShow() {
    }

    _keyboardDidHide() {
        if (!this.isHideKeyBoard && Platform.OS === 'android' && !this.isClickDone) {
            this.isHideKeyBoard = true
            Actions.pop()

        }
    }

    handleBackButtonClick() {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    onChangeText(text) {
        this.textResult = text
    }

    onClickDone() {
        if (_.isEmpty(this.textResult)) {
            AlertUtils.showError(messages.needToFill)
            return
        }
        this.isClickDone = true
        this.props.onCallBackValue(this.textResult)
        Actions.pop()
    }

    renderTextInput() {
        const { hintText, keyboardType } = this.props

        return <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={styles.containerSearch}>
                <TextInput
                    keyboardShouldPersistTaps='always'
                    style={styles.textInput}
                    onChangeText={(text) => this.onChangeText(text)}
                    placeholder={hintText}
                    autoFocus
                    autoCorrect={false}
                    autoCapitalize='none'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    keyboardType={keyboardType}
                />
            </View>

            <ButtonText
                containerStyle={{
                    flex: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                content={Localize(messages.done)}
                onClick={() => { this.onClickDone() }}
                textStyle={styles.doneText}
            />
        </View>
    }

    renderContentInputData() {
        if (Platform.OS === 'ios') {
            return <KeyboardAvoidingView
                style={styles.textInputContainer}
                behavior={"padding"}
                keyboardVerticalOffset={30}>
                {this.renderTextInput()}
            </KeyboardAvoidingView>
        } else {
            return <View style={styles.textInputContainer}>
                {this.renderTextInput()}
            </View>
        }
    }
    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 30 : 50
        const { hintText, keyboardType } = this.props
        return (
            <View
                style={styles.container}>
                {this.renderContentInputData()}

            </View>
        );
    }
}


export default InputData