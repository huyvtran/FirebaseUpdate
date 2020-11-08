/**
 * App Navigation
 */
import React from "react";
import {
  Actions,
  Lightbox,
  Overlay,
  Scene,
  Stack,
} from "react-native-router-flux";
import InputData from "../../components/InputData";
import Progress from "../../components/Progress";
import PromisesCall from "../../components/PromisesCall";
import CallScreen from "../../components/stringee/CallScreen";
import TaskListArrange from "../task/components/TaskListArrange";
import ChangePasswordScreen from "../authentication/components/ChangePasswordScreen";
import ConfigChangeServerScreen from "../authentication/components/ConfigChangeServerScreen";
import ForgotPasswordScreen from "../authentication/components/ForgotPasswordScreen";
import RecoverPasswordScreen from "../authentication/components/RecoverPasswordScreen";
import SecondStepSignInScreen from "../authentication/components/SecondStepSignInScreen";
import SignInScreen from "../authentication/components/SignInScreen";
import TestApiScreen from "../authentication/components/TestApiScreen";
import CustomerChat from "../customer/components/CustomerChat";
import ContactDetail from "../customer/components/CustomerDetail";
import QRScanScreen from "../form/wrapper/qrScan/QRScanScreen";
import ContainerDetail from "../freight/ContainerDetail";
import FreightMapSearch from "../freight/FreightMapSearch";
import TrailerDetail from "../freight/TrailerDetail";
import NotificationScreen from "../notification/components/NotificationScreen";
import AddOrder from "../orders/AddOrder";
import OrderDetail from "../orders/OrderDetail";
import InventoryDetailMain from "../product/components/InventoryDetailMain";
import ProductDetail from "../product/components/ProductDetail";
import SelectCustomer from "../selector/SelectCustomer";
import SelectFeeType from "../selector/SelectFeeType";
import SelectLanguages from "../selector/SelectLanguages";
import SelectOrg from "../selector/SelectOrg";
import SelectPicker from "../selector/SelectPicker";
import SelectProduct from "../selector/SelectProduct";
import SelectReason from "../selector/SelectReason";
import SettingScreen from "../setting/SettingScreen";
import UserSettingScreen from "../setting/UserSettingScreen";
import ShipmentBargeBayMap from "../shipment/barge/ShipmentBargeBayMap";
import ShipmentBargeDetails from "../shipment/barge/ShipmentBargeDetails";
import ShipmentAddFee from "../shipment/ShipmentAddFee";
import ShipmentAddNFRScreen from "../shipment/ShipmentAddNFRScreen";
import ShipmentSearchScreen from "../shipment/ShipmentSearchScreen";
import ShipmentViewFee from "../shipment/ShipmentViewFee";
import ShipmentViewLocationMap from "../shipment/ShipmentViewLocationMap";
import ShipmentRoadDetailScreen from "../shipment/truck/ShipmentTruckDetailScreen";
import SubTaskList from "../task/components/SubTaskList";
import TaskDetail from "../task/components/TaskDetail";
import ForceUpdateVersionScreen from "./components/ForceUpdateVersionScreen";
import MainComponent from "./components/MainComponent";
import MainRouteScreen from "./components/MainRouteScreen";
import SplashScreen from "./components/SplashScreen";
import ViewImageScreen from "./components/ViewImageScreen";
import ViewVehicleDeliveryScreen from "./components/ViewVehicleDeliveryScreen";

// Scenes

/* Routes ==================================================================== */
export default Actions.create(
  <Overlay>
    <Scene key="mainComponent" component={MainComponent} />
    <Lightbox>
      <Stack key="root" hideNavBar={true} panHandlers={null}>
        <Scene
          key="splash"
          initial={true}
          hideNavBar={true}
          component={SplashScreen}
        />
        <Scene
          key="forceUpdate"
          hideNavBar={true}
          component={ForceUpdateVersionScreen}
        />
        <Scene key="login" hideNavBar={true} component={SignInScreen} />
        <Scene
          key="changeServer"
          hideNavBar={true}
          component={ConfigChangeServerScreen}
        />
        <Scene
          key="changePassword"
          hideNavBar={true}
          component={ChangePasswordScreen}
        />
        <Scene
          key="forgotPass"
          hideNavBar={true}
          component={ForgotPasswordScreen}
        />
        <Scene
          key="recoverPass"
          hideNavBar={true}
          component={RecoverPasswordScreen}
        />
        <Scene
          key="secondStepSign"
          hideNavBar={true}
          component={SecondStepSignInScreen}
        />
        <Scene key="testAPI" hideNavBar={true} component={TestApiScreen} />
        <Scene
          key="viewVehicle"
          hideNavBar={true}
          component={ViewVehicleDeliveryScreen}
        />

        <Scene
          key="taskDetail"
          hideNavBar={true}
          component={TaskDetail}
          modal={true}
        />
        <Scene
          key="contactDetail"
          hideNavBar={true}
          component={ContactDetail}
        />
        <Scene key="editCreateOrder" hideNavBar={true} component={AddOrder} />
        <Scene
          key="productDetail"
          hideNavBar={true}
          component={ProductDetail}
        />
        <Scene
          key="inventoryDetail"
          hideNavBar={true}
          component={InventoryDetailMain}
        />
        <Scene key="orderDetail" hideNavBar={true} component={OrderDetail} />
        <Scene
          key="containerDetail"
          hideNavBar={true}
          component={ContainerDetail}
        />
        <Scene
          key="shipmentBayMap"
          hideNavBar={true}
          component={ShipmentBargeBayMap}
        />
        <Scene
          key="shipmentSearch"
          hideNavBar={true}
          component={ShipmentSearchScreen}
        />
        <Scene key="customerChat" hideNavBar={true} component={CustomerChat} />

        <Scene
          key="drawer"
          drawer={true}
          contentComponent={SettingScreen}
          drawerPosition="right"
          drawerLabel="Hi"
        >
          <Scene key="main" hideNavBar={true} component={MainRouteScreen} />
          <Scene
            key="taskListArrange"
            hideNavBar={true}
            component={TaskListArrange}
            modal={true}
          />
        </Scene>
        <Scene key="subTaskList" hideNavBar={true} component={SubTaskList} />
        <Scene
          key="trailerDetail"
          hideNavBar={true}
          component={TrailerDetail}
        />
        <Scene
          key="freightMapSearch"
          hideNavBar={true}
          component={FreightMapSearch}
        />

        <Scene key="selectOrg" component={SelectOrg} />
        <Scene key="selectReason" component={SelectReason} />
        <Scene key="selectCustomer" component={SelectCustomer} />
        <Scene key="selectLanguages" component={SelectLanguages} />
        <Scene key="selectProduct" component={SelectProduct} />
        <Scene key="selectFeeType" component={SelectFeeType} />
        <Scene key="selectPicker" component={SelectPicker} />
        <Scene key="setting" component={UserSettingScreen} />
        <Scene key="notification" component={NotificationScreen} />
        <Scene key="shipmentRoadDetail" component={ShipmentRoadDetailScreen} />
        <Scene key="shipmentBargeDetail" component={ShipmentBargeDetails} />
        <Scene key="shipmentViewLocation" component={ShipmentViewLocationMap} />
        <Scene key="shipmentAddFee" component={ShipmentAddFee} />
        <Scene key="shipmentViewFee" component={ShipmentViewFee} />
        <Scene key="shipmentAddNFR" component={ShipmentAddNFRScreen} />
      </Stack>
      <Scene key="progress" component={Progress} />
      <Scene key="qrScan" component={QRScanScreen} />
      <Scene key="promiseCall" component={PromisesCall} />
      <Scene key="viewImage" component={ViewImageScreen} />
      <Scene key="inputData" component={InputData} />
      <Scene key="makeCall" component={CallScreen} />
      {/* <Scene key='actionSheet' component={PopupActionSheet} /> */}
    </Lightbox>
  </Overlay>
);

export const screenNotInTab = (currentScene) =>
  [
    "selectProduct",
    "selectLanguages",
    "selectOrg",
    "orderDetail",
    "inventoryDetail",
    "productDetail",
    "editCreateOrder",
    "contactDetail",
    "taskDetail",
    "viewVehicle",
  ].find((sceneName) => sceneName === currentScene);
