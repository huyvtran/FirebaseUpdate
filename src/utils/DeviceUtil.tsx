import { Platform, Dimensions, StatusBar } from "react-native";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";

// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;

const IP_6_WIDTH = 375;
const IP_6_HEIGHT = 667;

const IP_5_WIDTH = 320;
const IP_5_HEIGHT = 568;

export default {
  isIPhoneX: () => {
    const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");

    return Platform.OS === "ios" &&
      ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
        (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT));
  },
  isIPhone6: () => {
    const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");

    return Platform.OS === "ios" &&
      ((D_HEIGHT === IP_6_WIDTH && D_WIDTH === IP_6_WIDTH) ||
        (D_HEIGHT === IP_6_WIDTH && D_WIDTH === IP_6_WIDTH));
  },
  isIPhone5: () => {
    const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");

    return Platform.OS === "ios" &&
      ((D_HEIGHT === IP_5_HEIGHT && D_WIDTH === IP_5_WIDTH) ||
        (D_HEIGHT === IP_5_WIDTH && D_WIDTH === IP_5_HEIGHT));
  },
  hasNotch: () => {
    if (Platform.OS === "android") {
      console.log(`StatusBar.currentHeight${StatusBar.currentHeight}`);
      return StatusBar.currentHeight > 24;
    } else {
      return parseInt(DeviceInfo.getSystemVersion().substring(0, 3)) > 11;
    }
  },
  getMACAddress: () => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        // alert(`NetInfo.fetch().then(state: ${state.type}`);
        if (state.type === "wifi") {
          DeviceInfo.getMACAddress().then(macNumber => {
            // console.log("DeviceUtil.getMACAddress: ", macNumber);
            // alert(`DeviceUtil.getMACAddress: ${macNumber}`);
            AsyncStorage.setItem("MacAdress", macNumber);
            resolve(macNumber);
          }).catch(() => {
            AsyncStorage.getItem("MacAdress").then(result => {
              // console.log("DeviceInfo get fail 4G ===> AsyncStorage: ", result);
              // alert(`DeviceInfo get fail 4G ===> AsyncStorage: ${result}`);
              resolve(result);
            }).catch(error => reject(error));
          });
        } else {
          AsyncStorage.getItem("MacAdress").then(result => {
            // console.log("4G ===> AsyncStorage.getItemMacAdress: ", result);
            // alert(`4G ===> AsyncStorage.getItemMacAdress: ${result}`);
            resolve(result);
          }).catch(error => reject(error));
        }
      });
    });
  },
}; 