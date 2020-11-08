import _ from "lodash";
import PropTypes from "prop-types";
import React from 'react';
import { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import TestID from "../../test/constant/TestID";
import { AbstractProps, AbstractStates } from "../base/AbstractProperty";
import AppConfig from "../config/AppConfig";
import { orgSelect } from "../modules/task/actions/creater/org";
import { refresh } from "../store/actions/refresh";
import eventTypes from "../store/constant/eventTypes";
import AppColors from "../theme/AppColors";
import AppSizes from "../theme/AppSizes";
import ButtonIcon from "./ButtonIcon";
import { HeaderSearchComponent } from "./HeaderSearchComponent";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: AppColors.abi_blue,
    justifyContent: "space-between",
    alignItems: "center",
    height: AppSizes.paddingXMedium * 4,
    width: "100%",
  },
  org: {
    color: "white",
    fontSize: AppSizes.fontBase,
    maxWidth: AppSizes.paddingLarge * 10,
    marginRight: AppSizes.paddingTiny,
  },
  containerControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerMainContentHeader: {
    flex: 1,
    height: "100%",
    width: AppSizes.screenWidth,
    flexDirection: "row",
    backgroundColor: AppColors.abi_blue,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

interface Props extends AbstractProps {
  org: any;
  orgSelect: (item: any) => void,
  refresh: (event: string, now: any) => void,
  onChangeText: (text: string) => void,
  onBackSearch: () => void,
  displayArrange, 
  onPressArrange, 
  displayFilter, 
  displayMapView, 
  displaySearch, 
  onPressFilter, 
  onPressSearch, 
  onPressMap, 
  displayAvatar, 
  displayBayMap, 
  onPressBayMap
}

interface States extends AbstractStates {

}

class HeaderView extends Component<Props, States> {
  static PropTypes = {
    displayMapView: PropTypes.string.isRequired,
    displaySearch: PropTypes.bool.isRequired,
  }

  state = {
    isSearch: false,
    isToggleMap: false,
  }

  viewSearchBar = () => (
    <HeaderSearchComponent
      onChangeText={text => this.props.onChangeText(text)}
      onPressCloseSearch={() => {
        this.setState({ isSearch: false }, () => {
          this.props.onBackSearch && this.props.onBackSearch();
        });
      }}

    />

  )

  callBackSelectOrg(org) {
    console.log("callBackSelectOrg ", org);
    this.props.orgSelect([org]);
    this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now());
  }

  onSelectOrg = _.debounce(() => {
    const orgName = this.props.org.orgSelect && this.props.org.orgSelect.length > 0 && this.props.org.orgSelect[0].organizationName;

    const params = {
      callback: this.callBackSelectOrg.bind(this),
      selected: orgName,
    };
    Actions.selectOrg(params);
  }, 300)
  renderAvatar() {
    return (<TouchableOpacity testID={TestID.drawerButton} onPress={() => {
      
      Actions.drawerOpen()
      console.log("Header Avatar click");
    }}
      style={{ width: AppSizes.paddingLarge * 2, height: AppSizes.paddingLarge * 2, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ width: AppSizes.paddingMedium * 2, height: AppSizes.paddingMedium * 2, borderRadius: AppSizes.paddingMedium, backgroundColor: "white" }}>
        <Image style={{ width: AppSizes.paddingMedium * 2, height: AppSizes.paddingMedium * 2, borderRadius: AppSizes.paddingMedium }} source={AppConfig.DRAWER_BUTTON_DEFAULT} />
      </View>
    </TouchableOpacity>);
  }
  renderMainContent() {
    const orgName = this.props.org.orgSelect && this.props.org.orgSelect.length > 0 && this.props.org.orgSelect[0].organizationName;
    const { displayArrange, onPressArrange, displayFilter, displayMapView, displaySearch, onPressFilter, onPressSearch, onPressMap, displayAvatar, displayBayMap, onPressBayMap } = this.props;
    return (<View style={styles.containerMainContentHeader}>
      <TouchableOpacity style={{ flexDirection: "row", marginLeft: AppSizes.paddingXSml }} onPress={() => {
        this.onSelectOrg();
      }}
      >
        <Text numberOfLines={1} style={styles.org}>{orgName}</Text>
        <FontAwesome
          name={"caret-down"}
          size={AppSizes.paddingMedium}
          color={"white"}
        />
      </TouchableOpacity>
      <View style={styles.containerControl}>
        {displayArrange && <ButtonIcon
          iconName={"arrow-split-horizontal"}
          iconSize={AppSizes.paddingLarge}
          iconColor={"white"}
          type = {"material-community"}
          onPress={() => onPressArrange()}
        />}
        {displayFilter && <ButtonIcon
          iconName={"filter-list"}
          iconSize={AppSizes.paddingLarge}
          iconColor={"white"}
          onPress={() => onPressFilter()}
        />}
        {displaySearch && <ButtonIcon
          iconName={"search"}
          iconSize={AppSizes.paddingLarge}
          iconColor={"white"}
          onPress={() => onPressSearch ? onPressSearch() : this.setState({ isSearch: true })}
        />}
        {displayBayMap && <ButtonIcon
          iconName={"device-hub"}
          iconSize={AppSizes.paddingLarge}
          iconColor={"white"}
          onPress={() => onPressBayMap()}
        />}
        {displayMapView && <ButtonIcon
          iconName={!this.state.isToggleMap ? "map" : "format-list-bulleted"}
          iconSize={AppSizes.paddingLarge}
          iconColor={"white"}
          onPress={() => {
            this.setState({ isToggleMap: !this.state.isToggleMap }, () => {
              onPressMap();
            });
          }}
        />}
        {displayAvatar && this.renderAvatar()}

      </View>


    </View>);
  }

  render() {
    //const orgName = this.props.org.orgSelect && this.props.org.orgSelect.length > 0 && this.props.org.orgSelect[0].organizationName;

    return (
      <View style={styles.container}>

        {
          this.state.isSearch ?
            this.viewSearchBar() :
            this.renderMainContent()
        }
      </View>
    );
  }
}

export default connect(state => ({ org: state.org }), { orgSelect, refresh })(HeaderView);
