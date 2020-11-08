import React from 'react';
import { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { AbstractProps, AbstractStates } from '../base/AbstractProperty';
import { TaskStatus, TaskStatusColor } from '../network/tasks/TaskListModel';
import AppColors from '../theme/AppColors';
import AppSizes from '../theme/AppSizes';
import { H0, H1, H1M, H2 } from '../theme/styled';

const styles = {
  mainContentContainer: {
    backgroundColor: 'white',
    paddingHorizontal: AppSizes.paddingXXMedium,
    paddingVertical: AppSizes.paddingXSml,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourContainer: {
    height: AppSizes.paddingXMedium * 4,
    width: AppSizes.paddingXMedium * 4,
    borderRadius: AppSizes.paddingXMedium * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 0.95,
    justifyContent: 'flex-start',
    marginLeft: AppSizes.paddingSml,
  },
  detailContainer: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: AppSizes.paddingXSml,
  }
}

interface Props extends AbstractProps {
  //tiêu đề
  subject: string,

  i2?: any,

  //địa chỉ
  address?: any,

  //ngày bắt đầu cho đến kết thúc
  startAndDueDate: string,

  //giờ bắt đầu
  hourStart: string,
  //giờ kết thúc
  hourEnd: string,

  displayNameCard?: string,

  nameCard?: string,

  //click chọn
  onPress: () => void,

  //trạng thái của task
  status: TaskStatus,

  //màu sắc
  fulfillmentStatusIconColor?: string,

  //id test
  testID?: any,
}

class ListRowTask extends PureComponent<Props, AbstractStates> {

  render() {
    const { subject, i2, address, startAndDueDate, hourStart, hourEnd, displayNameCard, nameCard, onPress, status = 2, fulfillmentStatusIconColor, testID } = this.props;

    const taskStatusColorItem = TaskStatusColor[status];
    const backgroundColor = taskStatusColorItem?.color || "#FFFFFF";
    const borderColor = taskStatusColorItem?.borderColor || AppColors.spaceGrey;
    const textColor = taskStatusColorItem?.textColor || AppColors.spaceGrey;

    return (
      <View>

        <TouchableOpacity onPress={onPress} key={nameCard} testID={testID}>
          <View style={styles.mainContentContainer} >
            <View style={{ ...styles.hourContainer, backgroundColor, borderColor, borderWidth: 1 }} >
              {
                displayNameCard ? <Text style={[H0, { fontSize: AppSizes.fontXXLarge }]}>{nameCard}</Text> :
                  <View>
                    <Text style={[H1M, { alignSelf: 'center', color: textColor, fontSize: AppSizes.fontBase }]}>{hourStart}</Text>
                    <Text style={[H1M, { alignSelf: 'center', color: textColor, fontSize: AppSizes.fontBase }]}>{hourEnd}</Text>

                  </View>
              }
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.detailContainer}>
                <Text
                  style={[H1, { width: '90%' }]}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {subject && subject.toLocaleUpperCase()}
                </Text>

                {fulfillmentStatusIconColor && <View style={{ width: '10%' }}>
                  <Icon
                    name='check-circle'
                    color={fulfillmentStatusIconColor}
                    type='material-community'
                  />
                </View>}


              </View>

              {i2 && <Text style={[H2, { marginTop: AppSizes.paddingXSml }]} >{i2}</Text>}
              {address && <View style={styles.detailContainer}>
                <Text style={H2} numberOfLines={1}>{address}</Text>
              </View>}
              <View style={styles.detailContainer}>
                {
                  startAndDueDate &&
                  <Text
                    style={[H1M, { fontSize: AppSizes.fontSmall, marginTop: AppSizes.paddingXSml, color: 'rgba(0,0,0,0.38)' }]}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {startAndDueDate}
                  </Text>
                }


              </View>
              <View style={{ width: '100%', backgroundColor: '#d3dfe4', height: AppSizes.paddingXXTiny, alignSelf: 'flex-end', marginTop: AppSizes.paddingMedium, }} />

            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
/*
i1:Task Name
i2:
i3:Address
i4:Date/Month
*/
// const ListRowTask = ({ i1, i2, i3, i4, hourStart, hourEnd, displayNameCard, nameCard, onPress, onLongPress, status = 2, fulfillmentStatusIconColor, testID }) => {


//   const backgroundColor = STATUS[status] ? STATUS[status].color : '#FFFFFF';
//   const borderColor = STATUS[status] ? STATUS[status].borderColor : AppColors.spaceGrey;
//   const textColor = STATUS[status] ? STATUS[status].textColor : AppColors.spaceGrey;


//   return (
//     <View>

//       <TouchableOpacity onPress={onPress} key={nameCard} testID={testID}>
//         <View style={styles.mainContentContainer} >
//           <View style={{ ...styles.hourContainer, backgroundColor, borderColor, borderWidth: 1 }} >
//             {
//               displayNameCard ? <Text style={[H0, { fontSize: AppSizes.fontXXLarge }]}>{nameCard}</Text> :
//                 <View>
//                   <Text style={[H1M, { alignSelf: 'center', color: textColor, fontSize: AppSizes.fontBase }]}>{hourStart}</Text>
//                   <Text style={[H1M, { alignSelf: 'center', color: textColor, fontSize: AppSizes.fontBase }]}>{hourEnd}</Text>

//                 </View>
//             }
//           </View>
//           <View style={styles.contentContainer}>
//             <View style={styles.detailContainer}>
//               <Text
//                 style={[H1, { width: '90%' }]}
//                 numberOfLines={1}
//                 ellipsizeMode='tail'
//               >
//                 {i1 && i1.toLocaleUpperCase()}
//               </Text>

//               {fulfillmentStatusIconColor && <View style={{ width: '10%' }}>
//                 <Icon
//                   name='check-circle'
//                   type='evilicon'
//                   color={fulfillmentStatusIconColor}
//                   type='material-community'
//                 />
//               </View>}


//             </View>

//             {i2 && <Text style={[H2, { marginTop: AppSizes.paddingXSml }]} >{i2}</Text>}
//             {i3 && <View style={styles.detailContainer}>
//               <Text style={H2} numberOfLines={1}>{i3}</Text>
//             </View>}
//             <View style={styles.detailContainer}>
//               {
//                 i4 &&
//                 <Text
//                   style={[H1M, { fontSize: AppSizes.fontSmall, marginTop: AppSizes.paddingXSml, color: 'rgba(0,0,0,0.38)' }]}
//                   numberOfLines={1}
//                   ellipsizeMode='tail'
//                 >
//                   {i4}
//                 </Text>
//               }


//             </View>
//             <View style={{ width: '100%', backgroundColor: '#d3dfe4', height: AppSizes.paddingXXTiny, alignSelf: 'flex-end', marginTop: AppSizes.paddingMedium, }} />

//           </View>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// ListRowTask.PropTypes = {
//   i1: PropTypes.string.isRequired,
//   i2: PropTypes.string.isRequired,
//   i3: PropTypes.string.isRequired,
//   i4: PropTypes.string.isRequired,
// };

export { ListRowTask };

