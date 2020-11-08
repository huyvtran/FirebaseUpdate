import _ from 'lodash';
import { Moment } from 'moment';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AwesomeListComponent from 'react-native-awesome-list';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ListRowTask } from '../../../components';
import ButtonIcon from '../../../components/ButtonIcon';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import HeaderDetail from '../../../components/HeaderDetail';
import { HeaderSearchComponent } from '../../../components/HeaderSearchComponent';
import messages from '../../../constant/Messages';
import API from '../../../network/API';
import eventTypes from '../../../store/constant/eventTypes';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import { callOnce } from '../../../utils/callOnce';
import { dateToDDMM, dateToHHMM } from '../../../utils/TimeUtils';
import { Localize } from '../../setting/languages/LanguageManager';
import { loadTaskDetail, loadTaskImplementing } from "../actions/creater/task";
import { AbstractTaskProps, AbstractTaskStates } from '../helper/AbstractTaskProps';
import { getContentSecondRowTaskItem, isDepotTMSTasks, isTMSTasks } from '../helper/FunctionHelper';

interface Props extends AbstractTaskProps {
    //thời gian lựa chọn
    selectedDate:Moment,
  }
  
  interface States extends AbstractTaskStates {
    searchMode: boolean,
  }

class SubTaskList extends Component<Props,States> {
    taskDetail: any;
    subTaskList: any;
    constructor(props) {
        super(props);

        this.taskDetail = props.taskDetail;
        this.state = {
            searchMode: false
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_TASK_LIST) {
            if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
                this.subTaskList.refresh()
            }
        }
    }

    source = () => {
        const { subTask } = this.taskDetail;
        if (!this.props.org || !this.props.org[0])
            return Promise.resolve([]);

        const orgId = this.props.org[0]._id
        return API.getSubTaskList(this.props.selectedDate, orgId, subTask)
    }

    listRowRender = ({ item }) => {

        return (
            <ListRowTask
                status={item.status}
                onPress={callOnce(() => this.taskItemPress(item), 1000)}
                subject={item.subject}
                address={item.contentSecondRow}
                startAndDueDate={`${dateToDDMM(item.startDate)}-${dateToDDMM(item.dueDate)}`}
                hourStart={dateToHHMM(item.startDate)}
                hourEnd={dateToHHMM(item.dueDate)}
            />
        )
    }

    taskItemPress(item) {

        Actions.taskDetail({ item, selectedDate: this.props.selectedDate, index: 0 });
    }

    transformer(res) {
        const taskListBefore = res.data.data;
        const isTMSTask = isTMSTasks(taskListBefore);
        const isDepotTMSTask = isDepotTMSTasks(taskListBefore)

        return _.map(taskListBefore, (taskItem) => {
            return {
                ...taskItem,
                contentSecondRow: getContentSecondRowTaskItem(isTMSTask, isDepotTMSTask, taskItem)
            }
        })
    }

    keyExtractor = (item) => item._id

    onChangeSearchText = _.debounce((text) => {
        if (_.isEmpty(text)) {
            this.subTaskList.removeFilter()
            return
        }
        this.subTaskList.applyFilter((item, index) => {
            return item.subject.toLowerCase().includes(text.toLowerCase())
        })

    }, 300);

    renderHeaderTitle() {
        if (!this.taskDetail) {
            return <View />
        }
        if (this.state.searchMode) {
            return <HeaderSearchComponent
                onChangeText={(text) => this.onChangeSearchText(text)}
                onPressCloseSearch={() => {
                    this.setState({ searchMode: false })
                }}
            />
        } else {
            return null
            return <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
            }}>
                <Text numberOfLines={1} style={[styles.textHeaderTitle]}>{this.taskDetail.subject}</Text>
            </View>
        }

    }

    renderRightView() {
        return <ButtonIcon
            iconName={'search'}
            iconSize={24}
            onPress={() => { this.setState({ searchMode: true }) }}
            iconColor={'white'}
        />
    }


    render() {
        return (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
                <HeaderDetail
                    leftButtonAction={() => !this.state.searchMode ? Actions.pop() : this.setState({ searchMode: false })}
                    contentView={this.renderHeaderTitle()}
                    rightView={this.renderRightView()}
                    title={this.taskDetail.subject}
                />

                <AwesomeListComponent
                    ref={ref => this.subTaskList = ref}
                    source={() => this.source()}
                    transformer={(response) => this.transformer(response)}
                    renderItem={(item) => this.listRowRender(item)}
                    keyExtractor={(item) => this.keyExtractor(item)}
                    emptyText={Localize(messages.noResult)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.subTaskList.onRetry()} />}

                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    textHeaderTitle: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: AppColors.abi_blue,
        width: '100%',
    },
    containerTaskParent: {
        // backgroundColor: '#3b79ba',
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,

        borderColor: AppColors.gray,
        borderWidth: 1
    },
    iconHeaderContainer: {
        flex: 2,
        alignItems: 'center',
    },
    contentHeaderContainer: {
        flex: 8,
        width: '100%',
        marginBottom: 8
    },
    containerSourceView: {
        flexDirection: 'row',
    },
    textSecond: {
        ...AppStyles.regularText,
        color: AppColors.textSubContent,
        paddingTop: 8
    },

    containerInfoSection: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 8
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        backgroundColor: 'white',
        padding: 0,
        color: AppColors.textContent,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
        width: AppSizes.screenWidth - 80,
        margin: 8
    },
    shipmentRequestButton: {
        width: '100%',
        position: 'absolute',
        backgroundColor: AppColors.abi_blue,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12
    },
    requestText: {
        ...AppStyles.regularText,
        fontSize: 16,
        color: 'white'
    }
})
export default connect(state => ({
    task: state.task,
    event: state.refresh.event,
    locale: state.i18n.locale,
    org: state.org.orgSelect,
    orgConfig: state.user.orgConfig,
}), { loadTaskDetail, loadTaskImplementing })(SubTaskList);
