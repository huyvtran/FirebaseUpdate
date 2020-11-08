import React, { Component, PropTypes } from 'react';
import { Actions, Overlay } from 'react-native-router-flux';
import { TouchableOpacity, Dimensions, StyleSheet, View, Text, } from 'react-native';
import _ from 'lodash';
import messages from '../constant/Messages';
import AppStyles from '../theme/AppStyles';
import AppColors from '../theme/AppColors';
import { Localize } from '../modules/setting/languages/LanguageManager';
import LottieView from 'lottie-react-native';
import AppSizes from '../theme/AppSizes';
const { width, height } = Dimensions.get('window');

const DefaultConfig = {
    maxWidthPercentage: 0.8,
    maxHeightPercentage: 0.8,
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
    dialog: {
        backgroundColor: '#fff',
        width: Math.min(AppSizes.screenWidth, AppSizes.screenHeight) * DefaultConfig.maxWidthPercentage,
        maxHeight: height * DefaultConfig.maxHeightPercentage,
        borderRadius: 5,
        borderWidth: 0,
    },
    title: {
        ...AppStyles.h3,
        alignSelf: 'stretch',
        textAlign: 'center',
        margin: AppSizes.paddingSml,
        color: AppColors.textTitle,
    },
    textContent: {
        ...AppStyles.h4,
        padding: AppSizes.paddingMedium,
        color: AppColors.textContent,
        textAlign: 'center',
    },
    divider: {
        backgroundColor: AppColors.divider,
        alignSelf: 'stretch',
    },
    button: {
        flex: 1,
    },
    buttonText: {
        ...AppStyles.h4,
        textAlign: 'center',
        padding: AppSizes.paddingSml,
        backgroundColor: 'transparent',
        color: AppColors.cerulean,
    },
    buttonStyle: {
        flex: 1
    },
    textLoading: {
        paddingLeft: AppSizes.paddingMedium,
        paddingTop: AppSizes.padding,
        paddingBottom: AppSizes.padding,
        color: AppColors.textContent,
        fontSize: AppSizes.fontXXMedium,
        textAlign: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    loadingContainer: {
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: AppSizes.paddingXXSml,
        alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingMicro,
        borderColor: AppColors.grayLight
    },
    lottieView: {
        width: AppSizes.paddingLarge * 3,
        height: AppSizes.paddingLarge * 3
    }
});

class Progress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
        };
    }

    renderLoadingView() {
        return <View style={styles.loadingContainer}>
            {/* <AbivinLoading ref={ref => this.abivinLoading = ref} size={50} /> */}
            {/* <ActivityIndicator size="large" color={AppColors.abi_blue} /> */}
            <LottieView style={styles.lottieView} source={require('../assets/animation/aniCarLoading.json')} autoPlay loop />
            <Text style={styles.textLoading}>{Localize(messages.loading) + '...'}</Text>

        </View>
    }
    render() {

        return (
            /** Dim background and handle touch outside */
            <View style={styles.container}>
                {!this.state.error &&
                    this.renderLoadingView()}
                {this.state.error &&

                    <View style={styles.dialog}>

                        <Text style={styles.title}>{Localize(messages.error)}</Text>
                        <Text style={styles.textContent}>{this.state.error.message}</Text>

                        {this.renderHorizontalDivider()}
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', }}>
                            <TouchableOpacity style={styles.buttonStyle} onPress={() => this.retry()}>
                                <Text style={styles.buttonText}>{Localize(messages.retry)}</Text>
                            </TouchableOpacity>
                            {this.renderVerticalDivider()}
                            <TouchableOpacity style={styles.buttonStyle} onPress={() => this.cancel()}>
                                <Text style={styles.buttonText}>{Localize(messages.cancel)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        );
    }

    doTask() {
        this.setState({ error: null }, () => {
            let task;
            if (!_.isArray(this.props.args))
                task = this.props.promiseFunction(this.props.args);
            else
                task = this.props.promiseFunction(...this.props.args);

            console.log("doTask task>>", task);
            task
                .then(result => {
                    // call server and receive response with known exception
                    if (result) {
                        if (result.request && result.data
                            && result.data.responseData && result.data.responseData.error) {
                            this.setError(result.data.responseData.error);
                            return;
                        }

                        // in create Transport preset server return status 200 and error in result.data
                        if (result.request && result.data && result.data.error) {
                            this.setError(result.data.error);
                            return;
                        }
                        // Success
                        this.dismiss();
                        if (this.props.onSuccess) {
                            this.props.onSuccess(result);
                        }
                    } else {

                        this.setError({
                            message: Localize(messages.notResponseServer)
                        });

                    }

                })
                .catch(error => {
                    if (this.unmounted) {
                        throw error;
                    }
                    this.setError(error);
                });
        })
    }

    setError(error) {
        if (this.props.handleError && this.props.handleError(error)) {
            this.dismiss();
            return;
        }
        if (error && error.response && error.response.data) {
            this.setState({ error: error.response.data })
            return
        }
        this.setState({ error });
    }

    renderHorizontalDivider() {
        return (<View style={[styles.divider, { height: 1, }]} />);
    }

    renderVerticalDivider() {
        return (<View style={[styles.divider, { width: 1, }]} />);
    }

    retry() {
        this.doTask();
    }

    cancel() {
        this.dismiss();
        if (this.props.onError) {
            this.props.onError(this.state.error);
        }
    }

    dismiss() {
        // this.abivinLoading.stopAnimated()
        Actions.pop();
    }

    componentDidMount() {
        this.doTask();
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    static show(promiseFunction, args, onSuccess, onError, handleError) {
        if (!_.isFunction(promiseFunction)) throw new Error('Progress.show: First param must be a function');
        Actions.progress({ promiseFunction, args, onSuccess, onError, handleError });
    }
}
export default Progress;