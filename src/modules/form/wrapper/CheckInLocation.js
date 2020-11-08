import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { CardTitle } from '../../../theme/styled';
import { checkToDayInOut, validateDeliveryTrips, isDeliveryTask, isGeometryTask } from "../../task/helper/FunctionHelper";
import _ from 'lodash';
import Messages from "../../../constant/Messages";
import { addForm } from "../actions/creater/form";
import Moment from "moment/moment";

import messages from '../../../constant/Messages';
import { Localize } from '../../setting/languages/LanguageManager';
import AppColors from '../../../theme/AppColors';
import TaskHelper from '../../task/helper/TaskHelper';
import PermissionUtils from '../../../utils/PermissionUtils';
import { SIMPLE_DATE_TIME_FULL_FORMAT, dateWithFormat } from '../../../utils/TimeUtils';
import API from '../../../network/API';
import { refresh } from '../../../store/actions/refresh'
import eventTypes from '../../../store/constant/eventTypes';
import Progress from '../../../components/Progress';
import FormType from '../../../constant/FormType';
import TrackLocationManager from '../../locations/TrackLocationManager';
import AppStyles from '../../../theme/AppStyles';
import ImageLoading from '../../../components/ImageLoading';
import { PanelContainer } from './PickerImg/components/styled';
import MapUtils from '../../../utils/MapUtils';
import AppSizes from '../../../theme/AppSizes';
import Divider from '../components/Divider';
import ButtonIcon from '../../../components/ButtonIcon';
import FirebaseDatabaseManager from '../../../firebase/FirebaseDatabaseManager';
import AlertUtils from '../../../utils/AlertUtils';


const styles = StyleSheet.create({
    containerLabel: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: AppSizes.paddingMedium,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: AppSizes.paddingMedium,
        paddingLeft: AppSizes.paddingMedium,
        width: AppSizes.screenWidth,
        paddingTop: AppSizes.paddingXSml,
        paddingBottom: AppSizes.paddingXSml,
        backgroundColor: 'transparent',

    },
    containerInfo: {
        paddingTop: AppSizes.paddingTiny,
        paddingBottom: AppSizes.paddingTiny,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
        justifyContent: 'space-between'
    },
    textPicker: {
        fontSize: AppSizes.paddingMedium,
        color: '#455A64'
    },
    image: {
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
        height: AppSizes.paddingSml * 15,

        borderTopLeftRadius: AppSizes.paddingXXSml,
        borderTopRightRadius: AppSizes.paddingXXSml,
        overflow: 'hidden',
    },
    imageContainer: {
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
        borderRadius: AppSizes.paddingXXSml,
        borderWidth: AppSizes.paddingMicro,
        borderColor: AppColors.gray,

    },
    containerInfoLocation: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingXXSml,
    }
})


// Component...
class CheckInLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latLng: props && props.defaultValues && props.defaultValues[0] ? props.defaultValues[0].value : null,
            timestamp: props && props.defaultValues && props.defaultValues[0] ? props.defaultValues[0].timestamp : new Date(),
            loadingLocation: false
        };
        const { ...item } = this.props;
        this.item = item;
        //in case, after check in, we refresh task list => API call error => task List will empty
        //so we pass props task list to this.taskList of this component
        this.taskList = props.taskList

    }


    componentWillReceiveProps(newProps) {
        const { ...item } = newProps;
        this.item = item;
        if (!_.isEqual(this.props.defaultValues, newProps.defaultValues)) {
            this.setState({
                latLng: newProps.defaultValues[0].value,
                timestamp: newProps.defaultValues[0].timestamp,
                loadingLocation: false
            })
        }

    }


    shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(this.props.defaultValues, nextProps.defaultValues) ||
            this.state.loadingLocation !== nextState.loadingLocation
        );
    }



    // -----------------------------------------UI CONTROL -----------------------------------
    /**
     * onClickList when user click pick Image + change Image
     * check some logics befor check loccation permission
     */
    onClickCheckIn = _.throttle(() => {
        const { configurations } = this.props.orgConfig;
        const allowSubmitOverTime = configurations.allowSubmitOverTime;

        /**
           * if task is completed and is not geometry task => do not allow resubmit
           */
        if (this.props.taskDetail &&
            this.props.taskDetail.status === TaskHelper.status.COMPLETE && !isGeometryTask(this.props.taskActionCode)) {
            AlertUtils.showError(messages.taskIsCompleted)
            return;
        }
        /**
         * if task is check in or check out task => do not allow submit when date is not today
         */
        if (!checkToDayInOut(this.props.currentDate) && !allowSubmitOverTime) {
            AlertUtils.showError(messages.notToday)

            return;
        }

        if (isDeliveryTask(this.props.taskActionCode) && !validateDeliveryTrips(this.taskList, this.props.taskDetailContain)) {
            return;
        }
        this.onCheckPermission()


    }, 300, { 'trailing': false })

    /**
     * check location permission that user grant to app. 
     * If user not grant location permission => do not allow to capture image
     * this function is called before call getCurrentLocation
     */
    onCheckPermission() {
        PermissionUtils.checkLocationPermission().then(value => {
            if (value === PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
                this.setState({ loadingLocation: true }, () => {
                    this.getCurrentLocation()

                })
            } else {
                AlertUtils.showWarning(messages.canotCheckLocation)
            }
        })


    }

    /**
     * get user's current location, after check location permission
     * and must get current location before picking image
      * @param {accuracy GPS enable} enableAccracy 
      * @param {count retry} count 
     */
    getCurrentLocation(enableAccracy = true, count = 0) {
        TrackLocationManager.getCurrentLocation((position) => {
            if (Platform.OS === 'android' && position.mocked) {
                FirebaseDatabaseManager.reportUserMockLocation(this.props.user)
                this.setState({
                    loadingLocation: false
                })
                AlertUtils.showError(messages.youAreUsingMockLocation)
                return
            }
            if (position && position.coords) {
                this.location = position.coords;
                this.submitCheckIn()
            }

        }, error => {
            console.log("getCurrentLocation >>", error.message)
            if (isDeliveryTask(this.props.taskActionCode)) {
                if (count >= 5) {
                    this.setState({ loadingLocation: false })
                    AlertUtils.showWarning(messages.canotCheckLocation)

                    return;
                }
                this.getCurrentLocation(false, count + 1);
            } else {
                this.submitCheckIn()
            }
        }, enableAccracy)
    }

    submitCheckIn() {
        const { taskDetail, username } = this.props;
        if (!this.location) {
            AlertUtils.showError(messages.locationIsnotDetect)
            return;
        }
        const bodyParams = {
            taskId: taskDetail._id,
            checkIn: {
                imageUrls: '',
                latitude: this.location.latitude,
                longitude: this.location.longitude,
                status: 1,
                timestamp: new Date(),
                username,
            },
            lastResponse: {
                entities: [
                    {
                        data: [{
                            value: '',
                            timestamp: new Date(),
                        }],
                        validate: true,
                        label: 'Check in',
                        multiple: false,
                        propertyName: 'undefinedFile',
                        propertyType: 'file',
                        referenceId: null,
                    },
                ],
            },
            status: 1,
            isCheckin: true,
        }
        Progress.show(API.submitCheckIn, [bodyParams], (res) => {
            Progress.show(this.props.addForm, [this.item, [{
                value: this.location.latitude + ',' + this.location.longitude,
                timestamp: new Date(),
            }]], () => {
                this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now());

            })
        })
    }

    renderPicker() {
        return (
            <TouchableOpacity style={styles.containerLabel} onPress={() => this.onClickCheckIn()}>
                <Icon name='add-location' color='#5c91e2' />
            </TouchableOpacity>
        );
    }

    getCheckInTimeServer() {
        if (this.props.components) {
            const component = this.props.components.find(component => component.type === FormType.PICK_IMAGE)
            if (component && component.defaultValues && component.defaultValues[0] && component.defaultValues[0].timestamp) {
                const checkInServer = (component.defaultValues[0].timestamp);
                var gmtDateTime = Moment.utc(checkInServer);
                return gmtDateTime.local().format(SIMPLE_DATE_TIME_FULL_FORMAT);
            }
        }
    }

    renderInfoLocationItem(title, content) {
        return <View style={{ flex: 1 }}>
            <Text style={{ ...AppStyles.regularText, color: AppColors.abi_blue }}>{title}</Text>
            <Text style={{ ...AppStyles.regularText }} numberOfLines={1}>{content}</Text>
        </View>
    }
    renderImage() {
        return (<View style={styles.imageContainer} >
            <ImageLoading
                resizeMode={'cover'}
                style={styles.image}
                imageStyle={styles.image}
                source={{ uri: MapUtils.getStaticImageMap(this.state.latLng) }}
            />
            <View style={styles.containerInfoLocation}>
                {this.renderInfoLocationItem(Localize(messages.location), this.state.latLng)}
                <Divider vertical style={{ marginHorizontal: AppSizes.paddingXSml }} />
                {this.renderInfoLocationItem(Localize(messages.time), dateWithFormat(this.state.timestamp, 'DD/MM/YY | hh:mm'))}
            </View>
        </View>)
    }

    renderLoadingLocation() {
        return (<View style={styles.containerLabel}>
            <ActivityIndicator />
        </View>)
    }
    render() {

        return (
            <View style={{
                marginHorizontal: AppSizes.paddingXTiny,
                marginVertical: AppSizes.paddingXXSml,
                borderRadius: AppSizes.paddingXTiny
            }}>
                <PanelContainer >
                    <Text style={CardTitle}>{this.props.label}</Text>
                    {this.state.latLng !== null && <ButtonIcon
                        iconName={'add-location'}
                        iconSize={AppSizes.paddingXXLarge}
                        iconColor={'white'}
                        onPress={() => {
                            this.onClickCheckIn()
                        }}
                    />}
                </PanelContainer>
                <View style={styles.contentContainer} >
                    {_.isEmpty(this.state.latLng) && !this.state.loadingLocation && this.renderPicker()}
                    {this.state.loadingLocation && this.renderLoadingLocation()}
                    {!_.isEmpty(this.state.latLng) && !this.state.loadingLocation && this.renderImage()}

                </View>

            </View>
        );
    }
}
export default connect(state => ({
    currentDate: state.task.currentDate,
    taskList: state.task.data,
    taskDetail: state.task.taskDetail.task,
    username: state.user.user.username,
    taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
    org: state.org.orgSelect,
    taskDetailContain: state.task.taskDetail,
    components: state.task.taskDetail.components,
    orgConfig: state.user.orgConfig,
    user: state.user.user,

}), {
        addForm,
        refresh,
    })(CheckInLocation);