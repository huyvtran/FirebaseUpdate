import React from 'react';
import Moment from "moment/moment";
import {
  DatePicker,
  Panel,
  Picker,
  PickerImg,
  PickerImgMulti,
  Tags,
  TextField,
  Radio,
  Toggle,
  CheckBoxWrapper,
  TableView,
  Pod,
  OrderView,
  Column,
} from './wrapper';
import HtmlToText from "./wrapper/HtmlToText";
import { defaultDataPicker, defaultValuesPicker } from "../task/helper/FunctionHelper";
import CheckBoxYesNo from './wrapper/CheckBoxYesNo';
import ProductInfoView from './wrapper/product/ProductInfoView';
import FormType from '../../constant/FormType';
import SignatureView from './wrapper/SignatureImg/SignatureView';
import CheckInLocation from './wrapper/CheckInLocation';
import OrderDepotView from './wrapper/orderdepot/OrderDepotView';
import PickerTextInput from './wrapper/PickerTextInput';
import OrderStatusDepotView from './wrapper/orderdepot/OrderStatusDepotView';
import QRScanView from './wrapper/qrScan/QRScanComponent'

const getFileDefaultValue = (item) => {
  if (item.defaultValues) {
    if (item.defaultValues.length == 1 && item.defaultValues[0] && item.defaultValues[0].value) {
      return item.defaultValues[0].value.replace("[", '').replace("]", '').replace('"', '').replace('"', '');
    }
    return '';
  }
};

const formCreator = (data) => {
  const components = [];
  data.forEach((item) => {
    const props = {
      ...item,
      _id: item.i,
      _key: item.key,
      key: item.key,
      defaultValue: item.defaultValue,
      defaultValues: item.defaultValues,
      calculateValue: item.calculateValue,
      type: item.type,
      label: item.label,
      validate: item.validate,
      placeholder: item.placeholder,
      index: item.index,
      product: item.product,
      program: item.program,
      valueCheckBoxYesNo: item.value,
      programList: item.programList,
    };

    switch (item.type) {
      case FormType.PANEL:
        components.push(<Panel key={item.key} title={item.title} properties={item.properties}>
          {item.components && formCreator(item.components)}
        </Panel>);
        break;
      case FormType.CONTAINER:// form reset to create
        switch (item.customClass) {
          case FormType.CONTAINER_TYPES.ORDER_DEPOT:
            components.push(<OrderDepotView
              {...props}
            />);
            break;
          case FormType.CONTAINER_TYPES.ORDER_STATUS_DEPOT:
            components.push(<OrderStatusDepotView
              {...props}
            />);
            break;
          default:
            components.push(<OrderView
              {...props}
            />);
        }


        break;
      case FormType.TEXT_FIELD:
        item.multiple ?
          components.push(<Tags
            {...props}
            errorLabel={item.errorLabel}
          />) :
          components.push(<TextField
            {...props}
            errorLabel={item.errorLabel}
          />);
        break;
      case FormType.TEXT_AREA:
        components.push(<TextField
          {...props}
          errorLabel={item.errorLabel}
          rows={item.rows}
        />);
        break;
      case FormType.NUMBER:
        components.push(<TextField
          {...props}
          errorLabel={item.errorLabel}
        />);
        break;
      case FormType.RADIO:
        components.push(<Radio
          {...props}
          values={item.values}
        />);
        break;
      case FormType.CURRENCY:
        components.push(<TextField
          {...props}
          errorLabel={item.errorLabel}
        />);
        break;
      case FormType.HTML_TEXT:

        components.push(<HtmlToText
          {...props}
          typeText={item.properties.type}
          content={item.content}
        />);
        break;
      case FormType.CHECKBOX:
        item.properties && item.properties.isYesNoChoice ?
          components.push(<CheckBoxYesNo
            {...props}
          />) :
          components.push(<Toggle
            {...props}
            parentCode={item.parentCode}
            parentName={item.parentName}
          />);
        break;
      case FormType.SELECT:
        switch (item.customClass) {
          case FormType.SELECT_TYPES.TEXT_INPUT_SELECT:
            components.push(<PickerTextInput
              {...props}
              template={item.template}
              data={defaultDataPicker(item)}
              _id={item._id}
              defaultValues={defaultValuesPicker(item)}
            />);
            break;
          default:
            components.push(<Picker
              {...props}
              dataSrc={item.dataSrc}
              values={item.data.values}
              template={item.template}
              data={defaultDataPicker(item)}
              _id={item._id}
              defaultValues={defaultValuesPicker(item)}
            />);
        }

        break;
      case FormType.SELECT_BOX:
        components.push(<CheckBoxWrapper
          {...props}
          values={item.values}
        />);
        break;
      case FormType.DATE_TIME:
        components.push(<DatePicker
          {...props}
          defaultDate={item.defaultDate}
          _id={item._id}
          defaultValues={item.defaultValues ? item.defaultValues.map(date => ({
            value: date.value ? Moment(date.value)
              .format('DD/MM/YYYY') : Moment()
                .format('DD/MM/YYYY')
          })) : null}
        />);
        break;
      case FormType.PICK_IMAGE:
        switch (item.customClass) {
          case FormType.CAMERA_TYPE.QR_SCAN:
            components.push(<QRScanView
              {...props}
            />);
            break;

          default:
            item.multiple ?
              components.push(<PickerImgMulti
                {...props}

              />) :
              components.push(<PickerImg
                {...props}
                _id={item._id}
                defaultValues={getFileDefaultValue(item)}
              />);
        }
        break;
      case FormType.BUTTON:
        components.push(<Pod
          {...props}
          properties={item.properties}
        />);
        break;
      case FormType.TABLE:
        components.push(<TableView
          {...props}
          rows={item.rows}
          apiUrl={item.properties.url}
        />);
        break;
      case FormType.COLUMNS:
        (!item.properties || !item.properties.isHide) && components.push(<Column item={item} />);
        break;
      case FormType.PACKING_LIST:
        components.push(<ProductInfoView
          {...props}
        />);
        break;
      case FormType.SIGNATURE:
        components.push(<SignatureView
          {...props}
        />);
        break;
      case FormType.CHECK_IN_LOCATION:
        components.push(<CheckInLocation
          {...props}
        />);
        break;

      default: null;

    }
  });
  return components;
};

export default formCreator;
