import React from 'react';
import { Component } from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Carousel from 'react-native-snap-carousel';
import ButtonIcon from '../../../components/ButtonIcon';
import ImageLoading from '../../../components/ImageLoading';
import messages from '../../../constant/Messages';
import AppSizes from '../../../theme/AppSizes';
import { Localize } from '../../setting/languages/LanguageManager';

const HEIGHT_ITEM = AppSizes.screenHeight - 100

const styles = {
    container: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },

    containerItem: {
        width: AppSizes.screenWidth - 48,
        height: HEIGHT_ITEM,
        marginTop: 8,
    },
    navBar: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingHorizontal: 8,
        paddingVertical: 16
    }
}

interface Props {
    imageList: any[],
    indexSelected: number
}

class ViewImageScreen extends Component<Props, any> {
    _carousel: any;


    //UI CONTROL ---------------------------------------------------------------------------------

    //UI RENDER ----------------------------------------------------------------------------------
    renderItem({ item }) {
        return (

            <ImageLoading
                style={styles.containerItem}
                source={{ uri: item }}
                resizeMode={'contain'}
            />
        )

    }

    render() {
        return <View style={styles.container}>
            <View style={styles.navBar}>
                <ButtonIcon
                    iconName={'clear'}
                    iconSize={24}
                    iconColor={'white'}
                    containerStyle={{ flex: 1 }}
                    onPress={() => Actions.pop()}
                />
                <Text style={{ fontSize: 16, color: 'white', flex: 5, width: '100%', textAlign: 'center' }}>{Localize(messages.detail)}</Text>
            </View>
            <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.props.imageList}
                renderItem={this.renderItem}
                sliderWidth={AppSizes.screenWidth}
                itemWidth={AppSizes.screenWidth - 48}
                firstItem={this.props.indexSelected}
            />
        </View>
    }
};


//Connect everything
export default ViewImageScreen;
