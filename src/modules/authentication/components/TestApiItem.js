import React, { Component } from 'react';
import { Dimensions, Platform, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import Divider from '../../form/components/Divider';
import AppColors from '../../../theme/AppColors';

const styles = StyleSheet.create({

})

class TestApiItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            done: false,
            fail: false
        }
    }

    componentDidMount() {
        const { apiInfo } = this.props
        const now = new Date()
        apiInfo.api.post(apiInfo.url, apiInfo.body).then(res => {
            if (res.data.data) {
                let timeLost = new Date() - now
                this.props.countDone(apiInfo, timeLost)
                this.setState({ done: true, preiod: timeLost })
            } else {
                this.setState({ fail: true, preiod: new Date() - now })
            }

        }).catch(err => {
            this.props.countFail()

            this.setState({ fail: true, preiod: new Date() - now })
        })
    }
    render() {
        const { apiInfo } = this.props


        return (<View>
            <View style={{ width: '100%', paddingHorizontal: AppSizes.paddingMedium, paddingVertical: AppSizes.paddingSml }}>
                <Text style={AppStyles.regularText}>{apiInfo.userName + ' - ' + apiInfo.orgId}</Text>
                <Text style={AppStyles.regularText}>{apiInfo.baseURL + apiInfo.url}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {this.state.done && !this.state.fail ?
                        <Text style={[AppStyles.regularText, { color: 'green' }]}>Done</Text> :
                        <Text style={[AppStyles.regularText, { color: 'blue' }]}>Loading</Text>}
                    {this.state.fail && <Text style={[AppStyles.regularText, { color: 'red' }]}>Fail</Text>}
                    {(this.state.done || this.state.fail) && <Text style={[AppStyles.regularText, { color: this.state.preiod > 10000 ? 'red' : AppColors.abi_blue }]}>{this.state.preiod + ' ms'} </Text>}
                </View>


            </View>
            <Divider />
        </View>)
    }
}



export default TestApiItem;
