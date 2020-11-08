import React from 'react';
import { PureComponent } from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Icon } from "react-native-elements";
import { AbstractProps, AbstractStates } from "../../../base/AbstractProperty";
import Messages from '../../../constant/Messages';
import TaskCode from '../../../constant/TaskCode';
import { ITask, TaskStatus, TaskStatusColor } from '../../../network/tasks/TaskListModel';
import AppColors from "../../../theme/AppColors";
import AppSizes from "../../../theme/AppSizes";
import { H0, H1, H1M, H2 } from "../../../theme/styled";
import { Localize } from '../../setting/languages/LanguageManager';

const styles = {
  mainContentContainer: {
    backgroundColor: "white",
    // paddingHorizontal: AppSizes.paddingXXMedium,
    // paddingVertical: AppSizes.paddingXSml,
    flexDirection: "row",
    alignItems: "center",
  },
  hourContainer: {
    height: AppSizes.paddingXMedium * 4,
    width: AppSizes.paddingXMedium * 4,
    borderRadius: AppSizes.paddingXMedium * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 0.95,
    justifyContent: "flex-start",
    marginLeft: AppSizes.paddingSml,
    marginHorizontal: AppSizes.paddingXXMedium,
    marginVertical: AppSizes.paddingXSml,
  },
  detailContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: AppSizes.paddingXSml,
    // marginBottom: AppSizes.paddingXSml
  },
};

interface Props extends AbstractProps {

  //vị trí trong danh sách
  index: number,

  //trạng thái được lựa chọn
  isChecked: boolean,


  isMarked: boolean,

  //vị trí soạn hàng
  // startPosition:number,

  //vị trí hết ngày
  // endPosition: number,

  //danh sách các vị trí ẩn nút
  // hideButtonPosition: number[],

  //tiêu đề
  subject: string,

  i2?: any,

  //địa chỉ
  address: any,

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

  //click vào move task
  onMove: (position) => void,

  //trạng thái của task
  status: TaskStatus,

  //màu sắc
  fulfillmentStatusIconColor: string,

  //id test
  testID: any,

  //task
  // taskModel: ITask;

  //không cho phép chọn task để move
  enableSelection:boolean;

  //cho phép move task
  enableMoveTask:boolean;
}

interface States extends AbstractStates {

}

/*
i1:Task Name
i2:
i3:Address
i4:Date/Month
*/
class ListArrangeRow extends PureComponent<Props, States> {

  
  /**
   * Không hiện thị checkbox
   * - không hiện thị icon ở extra task sau hết ngày
   * Tạo check box nếu có
   */
  private renderCheckBox = () => {

    //nếu soạn hàng và hết ngày
    if (!this.props.enableSelection) return null;

    return (
      <View style={{
        flexDirection: "row",
        height: "100%",
        alignItems: "center",
      }}
      >
        <View style={{
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: AppColors.abi_blue,
          position: "absolute",
        }}
        />
        {this.props.isChecked ? <Icon
          containerStyle={{ marginLeft: AppSizes.paddingXMedium }}
          name="dot-circle-o"
          type="font-awesome"
          color={AppColors.abi_blue}
        /> : <Icon
            containerStyle={{ marginLeft: AppSizes.paddingXMedium }}
            name="circle-o"
            type="font-awesome"
            color={AppColors.abi_blue}
          />}
      </View>
    )
  }

  /**
   * Hiện thị nút moveTaskHere
   */
  private renderMoveTaskHere = () => {

    if (this.props.enableMoveTask) {

      return (<TouchableOpacity
        onPress={() => this.props.onMove(this.props.index)}
        style={{ width: "100%", backgroundColor: "#CEE9F9", alignSelf: "flex-end", paddingVertical: 5, alignItems: "center" }}
      >
        <Text style={{ color: AppColors.abi_blue, fontSize: 14 }}>{Localize(Messages.taskListArrange.moveTaskHere)}</Text>
      </TouchableOpacity>)
    }

    return (<View style={{ width: "80%", backgroundColor: "#d3dfe4", height: AppSizes.paddingXXTiny, alignSelf: "flex-end" }} />)
  }

  render() {
    const { isChecked, isMarked, subject, i2, address, startAndDueDate, hourStart, hourEnd, displayNameCard, nameCard,
      onPress, status = 2, testID } = this.props;
    
    const taskStatusColorItem = TaskStatusColor[status];
    const backgroundColor = taskStatusColorItem?.color || "#FFFFFF";
    const borderColor = taskStatusColorItem?.borderColor || AppColors.spaceGrey;
    const textColor = taskStatusColorItem?.textColor || AppColors.spaceGrey;

    return (
      <View>
        <TouchableWithoutFeedback onPress={onPress} key={nameCard}
          testID={testID}
        >
          <View style={[styles.mainContentContainer, (isChecked || isMarked) && { backgroundColor: "#E0F2FF" }]} >
            {this.renderCheckBox()}
            <View style={{
              ...styles.hourContainer,
              backgroundColor,
              borderColor,
              borderWidth: 1,
              marginLeft: AppSizes.paddingXXMedium,
            }}
            >
              {
                displayNameCard ? <Text style={[H0, { fontSize: AppSizes.fontXXLarge }]}>{nameCard}</Text> :
                  <View>
                    <Text style={[H1M, { alignSelf: "center", color: textColor, fontSize: AppSizes.fontBase }, isMarked && { color: "#FC5959" }]}>{hourStart}</Text>
                    <Text style={[H1M, { alignSelf: "center", color: textColor, fontSize: AppSizes.fontBase }, isMarked && { color: "#FC5959" }]}>{hourEnd}</Text>
                  </View>
              }
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.detailContainer}>
                <Text
                  style={[H1, { width: "90%" }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {subject && subject.toLocaleUpperCase()}
                </Text>
              </View>
              {i2 && <Text style={[H2, { marginTop: AppSizes.paddingXSml }]} >{i2}</Text>}
              {address && <View style={styles.detailContainer}>
                <Text style={H2} numberOfLines={1}>{address}</Text>
              </View>}
              <View style={styles.detailContainer}>
                {
                  startAndDueDate &&
                  <Text
                    style={[H1M, { fontSize: AppSizes.fontSmall, marginTop: AppSizes.paddingXSml, color: "rgba(0,0,0,0.38)" }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {startAndDueDate}
                  </Text>
                }
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this.renderMoveTaskHere()}
      </View>
    );
  }
}
export { ListArrangeRow };

