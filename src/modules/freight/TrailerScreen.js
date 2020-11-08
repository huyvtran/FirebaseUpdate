import React, { Component } from 'react';
import {
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
    TouchableHighlight,
    Alert,
    StyleSheet
} from 'react-native';

import { connect } from 'react-redux';
import { Promise } from 'core-js';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import TrailerItem from './TrailerItem';
import API from '../../network/API';
import TagView from '../../components/TagInputs';
import ErrorAbivinView from '../../components/ErrorAbivinView';
import { Actions } from 'react-native-router-flux';
import SearchIconMapComponent from '../../components/SearchIconMapComponent';
import _ from 'lodash'

class TrailerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            locationList: []
        };
    }
    //============================================= COMPONENT LIFE CYCLE =========================================//

    componentWillReceiveProps(nextProps) {
        if (this.props.textSearch !== nextProps.textSearch) {
            this.onChangeTextSearch(nextProps.textSearch)
        }
        if (this.isDiffArray(nextProps.filterList, this.props.filterList)) {
            this.trailerList.refresh()

        }
        if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
            this.trailerList.refresh()
        }
    }

    //============================================= UI CONTROL =========================================//
    onChangeTextSearch = (text) => {

        if (_.isEmpty(text)) {
            this.trailerList.removeFilter()
            return
        }
        this.trailerList.applyFilter((item, index) => {
            return item.trailerCode && item.trailerCode.toLowerCase().includes(text.toLowerCase())
        })

    }

    isDiffArray(filterF, filterS) {
        if (filterF.length !== filterS.length) {
            return true;
        }
        if (filterF[0].content !== filterS[0].content) {
            return true
        }
        return false

    }
    source = (pagingData) => {
        const { textSearch, org, filterList } = this.props
        const { locationList } = this.state;
        const locationId = locationList && locationList[0] ? locationList[0]._id : null
        let filterBy = null;

        const organizationIds = org && org[0] ? org[0].id : undefined;
        filterBy = {
            organizationIds: [organizationIds],
        }

        if (filterList.length === 1) {
            if (filterList[0].content === 'active') {
                filterBy = {
                    ...filterBy,
                    isActive: true
                }
            } else {
                filterBy = {
                    ...filterBy,
                    isActive: false
                }
            }
        }
        return API.trailerList(textSearch, filterBy, locationId)
    }

    keyExtractor = (item) => item._id

    onPressItem = (trailer) => {
        Actions.trailerDetail({ trailer, refreshList: () => this.trailerList.refresh() })
    }
    /**
     * filter trailer list to the list that not contain the requesting trailer
     * @param {data get in server} res 
     */
    transformer(res) {
        const trailerList = res.data.data.filter(trailerParam => {
            return !trailerParam.attachedVehicleId || !trailerParam.attachedVehicleId._id
        }).filter(trailerCon => {
            return !trailerCon.attachedContainerIds || trailerCon.attachedContainerIds.length === 0
        })

        return trailerList
    }

    onSelectLocation = (location) => {
        console.log("onSelectLocation >>", location)
        this.setState({ locationList: [location] }, () => this.trailerList.refresh())
    }

    onCloseTagView = (content) => {
        this.setState({ locationList: [] }, () => {
            this.trailerList.refresh()
        })
    }



    //============================================= UI RENDER =========================================//

    renderItem = ({ item }) => (
        <TrailerItem trailer={item} onPressItem={() => this.onPressItem(item)} />
    )


    render() {
        const { locationList } = this.state
        return (
            <View style={styles.container}>

                <SearchIconMapComponent
                    onChangeTextSearch={text => this.onChangeTextSearch(text)}
                    onPressMap={() => Actions.freightMapSearch({ onSelectLocation: (location) => this.onSelectLocation(location) })}
                />
                {locationList.length > 0 && <TagView
                    tagList={locationList}
                    extractorValue={(item) => item.fullName}
                    title={Localize(messages.location) + ': '}
                    onClose={(item) => this.onCloseTagView(item)} />}
                <AwesomeListComponent
                    ref={ref => this.trailerList = ref}
                    // isPaging
                    source={(pagingData) => this.source(pagingData)}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item) => this.keyExtractor(item)}
                    emptyText={Localize(messages.noResult)}
                    transformer={(response) => this.transformer(response)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.trailerList.onRetry()} />}
                    filterEmptyText={Localize(messages.filterNoTrailer)}
                />
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

});
export default connect(state => ({
    org: state.org.orgSelect,

}), {
    })(TrailerScreen);

