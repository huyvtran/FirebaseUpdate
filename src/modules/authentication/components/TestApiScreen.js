import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, Linking, TouchableOpacity, Platform, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../../theme/AppStyles';
import HeaderDetail from '../../../components/HeaderDetail';
import { Actions } from 'react-native-router-flux';
import messages from '../../../constant/Messages';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../../setting/languages/LanguageManager';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import Moment from 'moment';
import axios from 'axios';
import DevConfig from '../../../config/DevConfig';
import { API_TASK_LIST, API_UPDATE_LOCATIONS } from '../../../network/URL';
import TestApiItem from './TestApiItem';
import { LogInterceptor } from '../../../network/Interceptors'
import DynamicServerManager from '../../../data/DynamicServerManager';
import ButtonText from '../../../components/ButtonText';
import PromisesCall from '../../../components/PromisesCall';
import AppSizes from '../../../theme/AppSizes';

// const UserOrgIdTest = require('../../../../../userOrgId.json')
// const TaskTest = require('../../../../../taskTest.json')
// const TrackLocationData = require('../../../../../trackLocationTestData.json')

class TestAPIScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countDone: 0,
            countFail: 0
        }
        this.countDone = 0;
        this.source = this.calculateSource()
    }

    componentDidMount() {
        // this.locationUpdate()
    }

    componentWillReceiveProps(nextProps) {

    }
    //LOGIC CONTROL ---------------------------------------------------------------------------------
    locationUpdate() {
        TrackLocationData.forEach((trackData, index) => {
            const axiosCall = this.createAxios(trackData.token)

            setInterval(function () {
                axiosCall.post(API_UPDATE_LOCATIONS, trackData.body).then(res => {
                    console.log('TRACK LOCATION SUCESSSSS +' + index)
                })
            }, 1000);
        })

    }
    getBaseUrl = () => {
        const dynamicServer = DynamicServerManager.getDynamicServer();
        return dynamicServer.protocol + dynamicServer.host
    }

    createAxios(token) {
        const axiosParams = axios.create({
            baseURL: this.getBaseUrl(),
            timeout: 120000,
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        })

        axiosParams.interceptors.request.use(
            LogInterceptor.requestLog,
            LogInterceptor.requestError,
        );

        axiosParams.interceptors.response.use(
            LogInterceptor.responseLog,
            LogInterceptor.responseError,
        );

        return axiosParams
    }

    calculateSource() {
        const endDate = Moment(new Moment()).format('YYYY-MM-DD');
        const startDate = Moment(new Moment()).subtract(1, 'days').format('YYYY-MM-DD');

        let initualizeTask = [
        ]

        let initualizeAxios = []
        let userOrgIdList = {}
        UserOrgIdTest.forEach(userOrgId => {
            userOrgIdList[userOrgId.username] = userOrgId.organizationIds[0];
        })

        for (var key in TaskTest) {
            if (userOrgIdList[key]) {

                let axiosParams = this.createAxios(TaskTest[key])
                initualizeAxios.push(
                    {
                        orgId: userOrgIdList[key],
                        api: axiosParams,
                        userName: key
                    }
                )
            }

        }

        initualizeTask = initualizeAxios.map(axios => {
            const body = {
                "organizationIds": [axios.orgId],
                "searchInput": "",
                "currentPage": 1,
                "pageLimit": 200,
                "orderBy": { "startAt": 1 },
                "startDate": startDate,
                "endDate": endDate,
                "status": [],
                "filterBy":
                {
                    "taskActionIds": [],
                    "organizationsIds": [axios.orgId]
                },
                "listUserOrgs": [axios.orgId],
                "assignTo": [],
                "isMobile": true,
                "version": "3.0.90"
            }
            return {
                api: axios.api,
                url: API_TASK_LIST,
                body,
                userName: axios.userName,
                orgId: axios.orgId,
                baseURL: this.getBaseUrl(),
                timeLost: 0
            }
        })

        return initualizeTask
    }

    makeAPITaskList = (intanceAxios, url, body) => {
        return intanceAxios.post(url, body)
    }

    countDoneApi(apiInfo, timeLost) {
        this.countDone++;
        this.source = this.source.map(param => {
            if (apiInfo.orgId === param.orgId && apiInfo.userName === param.userName) {
                let sourceItem = {
                    ...param,
                    timeLost
                }

                return sourceItem
            }
            return param
        })
        this.forceUpdate()
    }

    countFailApi() {
        this.setState({
            countFail: this.state.countFail + 1
        })
    }

    callAllApiOnceTime() {
        const initialPromiseCall = this.source.map(item => {
            return { method: this.makeAPITaskList, params: [item.api, item.url, item.body] }
        })
        const now = new Date();
        PromisesCall.show(initialPromiseCall, ([taskListRes]) => {
            alert('Done all - ' + (new Date() - now) + ' ms')
        })
    }
    //UI CONTROL ---------------------------------------------------------------------------------



    renderItem(item) {
        return <TestApiItem
            countDone={(apiInfo, timeLost) => this.countDoneApi(apiInfo, timeLost)}
            countFail={() => this.countFailApi()}
            apiInfo={item}
        />
    }




    //UI RENDER ----------------------------------------------------------------------------------

    renderRightView() {
        return <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[AppStyles.regularText, { color: 'white' }]}>{this.countDone + '/' + this.source.length}</Text>
            <ButtonText
                content={'AOT'}
                onClick={() => {
                    this.callAllApiOnceTime()
                }}
            />

        </View>
    }

    renderDataView() {
        let listView = []
        this.source.forEach(item => {
            listView.push(this.renderItem(item))
        })

        return <ScrollView style={{ flex: 1 }}>
            {listView}
        </ScrollView>
    }
    render() {

        return (<View style={styles.container}>
            <HeaderDetail
                title={messages.login.testAPI}
                rightView={this.renderRightView()}
            />


            {this.renderDataView()}

        </View>)
    }
};

// Redux
const mapStateToProps = state => ({
    locale: state.i18n.locale,
    user: state.user.isAuthenticated,
    userInfo: state.user.readUser,
    storeRehydrated: state._persist.rehydrated
})

// Any actions to map to the component?
const mapDispatchToProps = {

}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(TestAPIScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        width: AppSizes.screenWidth,
        height: AppSizes.screenHeight
    }
})
