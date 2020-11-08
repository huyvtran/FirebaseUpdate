import React, { Component } from 'react';
import { H1, H2 } from '../../../theme/styled';
import { Text } from 'react-native'
import AppSizes from '../../../theme/AppSizes';
import { Image, View, TouchableOpacity } from 'react-native'

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: AppSizes.paddingSml * 30,
    width: '100%'
  },
  image: {
    height: AppSizes.paddingSml * 28,
    width: '95%',
    marginVertical: AppSizes.paddingSml
  }
}
class Img extends Component {
  state = {
    text: '',
  }
  onChangeText = async text => {
    await this.setState({ text });
    this.props.onChangeText &&
      (await this.props.onChangeText(this.state.text));
  };

  render() {
    const { time, uri, description, onPress } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          // resizeMode='contain'
          source={{ uri }}
        />
        <TouchableOpacity onPress={onPress}>
          <Text style={H2}>{description}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Img;
