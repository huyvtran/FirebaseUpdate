//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import AppColors from '../../../../theme/AppColors';
import { Icon } from 'react-native-elements'
import AppSizes from '../../../../theme/AppSizes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    image: {
        width: AppSizes.paddingSml * 8,
        height: AppSizes.paddingSml * 10,
        margin: AppSizes.paddingXSml
    },

})

// create a component
class MultiImageListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medias: props.data,
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({ medias: newProps.data })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    ref={ref => this.flatList = ref}
                    renderItem={this.renderCell.bind(this)}
                    data={this.state.medias}
                    keyExtractor={this.keyExtractor}
                    horizontal={true}
                />
            </View>);
    }

    renderCell = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.onClickImageItem(item, index)}
            >
                <ImageBackground
                    style={styles.image}
                    source={{ uri: item.value }}
                    resizeMode={'stretch'}
                    borderColor={AppColors.lightgray}
                    borderWidth={0.5}
                    borderRadius={AppSizes.paddingXXSml}
                >

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: AppSizes.paddingSml * 3,
                            height: AppSizes.paddingSml * 3,
                            padding: AppSizes.paddingTiny,
                        }}
                        onPress={() => this.props.onDelete(item, index)}>
                        <Icon
                            name={'highlight-off'}
                            size={AppSizes.paddingXXLarge}
                            color={'white'}
                        />
                    </TouchableOpacity>

                </ImageBackground >
            </TouchableOpacity>
        )
    }

    keyExtractor = (item, index) => {
        if (!item.id) {
            return index.toString();
        }
        return item.id
    }
}

export default MultiImageListView
