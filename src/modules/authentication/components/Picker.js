import React, {
  Component,
} from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';

const styles = {
  listItem: {
    marginTop: AppSizes.paddingXSml,
    marginBottom: AppSizes.paddingXSml,
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },
  labelItem: {
    ...AppStyles.regularText,
    fontSize: AppSizes.paddingMedium,
    fontWeight: '500'
  }
}

class Picker extends Component {
  state = {
    isVisible: false,
    data: this.props.data,
    itemSelected: null,
  }
  showAddModal() {
    this.setState({
      isVisible: true,
    });
  }
  closeAddModal() {
    this.setState({
      isVisible: false,
    });
  }
  listRowRender = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => this.props.onPress(item)}
    >
      <Text style={styles.labelItem}>{item}</Text>
    </TouchableOpacity>
  )
  keyExtractor = (item) => item
  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
          <Text style={styles.labelItem}>{this.props.itemSelected || 'Vui lòng chọn'}</Text>
        </TouchableOpacity>
        <Modal
          ref={'addOrder1'}
          isVisible={this.state.isVisible}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 6,
              paddingVertical: 16,
              paddingHorizontal: 16,
              marginTop: 16,
              height: 400,
              width: 320,
            }}
          >
            <FlatList
              style={{ backgroundColor: 'white' }}
              data={this.props.data}
              renderItem={this.listRowRender}
              keyExtractor={this.keyExtractor}
            />
            <Button title='Cancel' onPress={() => this.setState({ isVisible: false })} />
          </View >
        </Modal>
      </View>
    );
  }
}

export default Picker;
