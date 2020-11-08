import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Badge } from 'react-native-elements';
// import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

import AppColors from '../theme/AppColors';
import AppStyles from '../theme/AppStyles';
import { translateText } from '../modules/setting/languages/components/translate';
import AppSizes from '../theme/AppSizes';

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: AppColors.red,
    paddingLeft: AppSizes.paddingXXSml,
    paddingRight: AppSizes.paddingXXSml
  },
  badge: {
    position: 'absolute',
    right: AppSizes.paddingXXSml,
    top: AppSizes.paddingXXSml,
  }
});

class TabIcon extends Component {

  render() {
    const { showBadge, unreadNotification, focused, iconActive, iconInactive, title, tabBarLabel, onPress, selected, isShowTabLabel } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress && onPress} style={{
        backgroundColor: AppColors.abi_blue, flex: 1,
      }} >
        <View style={{ opacity: selected ? 0.9 : 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.abi_blue, flex: 1, }}>
          <Image source={iconActive} style={{ width: AppSizes.paddingXXLarge, height: AppSizes.paddingXXLarge, marginTop: AppSizes.paddingTiny, }} resizeMode="contain" />
          {isShowTabLabel && translateText(tabBarLabel, { style: { ...AppStyles.regularText, color: 'white', marginVertical: AppSizes.paddingTiny, fontWeight: '500', lineHeight: AppSizes.paddingXXLarge }, numberOfLines: 1 })}
          {
            showBadge && !!unreadNotification && unreadNotification.length > 0 &&
            <Badge value={unreadNotification.length}
              wrapperStyle={styles.badge}
              containerStyle={styles.badgeContainer}
              textStyle={[{ color: AppColors.white }]}
            />
          }
        </View>

      </TouchableWithoutFeedback>
    );
  }
};

/**
 * Container
 */
const mapStateToProps = state => ({
  //   unreadNotification: state.home.unreadNotification
});

// Any actions to map to the component?
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon);
