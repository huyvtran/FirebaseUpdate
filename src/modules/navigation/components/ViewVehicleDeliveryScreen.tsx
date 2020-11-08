import React from 'react';
import { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import TestID from "../../../../test/constant/TestID";
import ImageAssets from '../../../assets/ImageAssets';
import ButtonText from '../../../components/ButtonText';
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import Divider from '../../form/components/Divider';
import NavigationHelper from '../helpers/NavigationHelper';

interface Props {
  user: any;
}

interface States {

}
class ViewVehicleDeliveryScreen extends Component<Props, States> {

  componentDidMount() {

  }

  //UI CONTROL ---------------------------------------------------------------------------------
  gotoTaskList() {
    NavigationHelper.navigateRoleMainScene(this.props.user.readUser);

  }

  //UI RENDER ----------------------------------------------------------------------------------
  render() {
    const { user } = this.props;
    return <View testID={TestID.vehicleViewScreen} style={styles.container}>

      <Image
        source={ImageAssets.imgBgViewVehicle}
        style={styles.imageBackground}
        resizeMode={'stretch'}
      />
      <View style={styles.mainContent}>
        <Text style={styles.textHeader}>{messages.user.yourVehicle}</Text>
        <Text
          style={styles.textContent}>{user && user.vehicle && user.vehicle && user.vehicle.vehicleCode}</Text>
        <Divider style={{
          width: AppSizes.screenWidth - 32,
          height: 0.5
        }} color={AppColors.abi_blue} />
        <ButtonText
          testID={TestID.gotoTaskListButton}
          onClick={() => {
            this.gotoTaskList();
          }}
          content={messages.user.letgo}
          containerStyle={styles.buttonTextStyle}
        />

      </View>
    </View>;
  }
};

// Redux
const mapStateToProps = state => ({
  user: state.user
});

// Any actions to map to the component?
const mapDispatchToProps = {};

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ViewVehicleDeliveryScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: AppSizes.screenHeight,
    backgroundColor: 'white',
  },
  imageBackground: {
    height: AppSizes.screenHeight * 2 / 5,
    width: AppSizes.screenWidth
  },
  mainContent: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  textHeader: {
    fontSize: 20,
    color: AppColors.abi_blue,
    fontWeight: "bold",
  },
  textContent: {
    fontSize: 22,
    color: AppColors.abi_blue,
    marginTop: 16,
    marginBottom: 16,
    fontWeight: "bold",

  },
  buttonTextStyle: {
    width: AppSizes.screenWidth - 32,
    paddingVertical: AppSizes.paddingXSml,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.abi_blue,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'grey',
    marginTop: 40,
  }
});
