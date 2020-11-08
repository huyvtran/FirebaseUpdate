import { API_CATEGORY_LIST, API_PROMOTION_VFAST, API_PROMOTION_INITIATIVE } from "../../../network/URL";
import Moment from "moment/moment";
import { surveyConfig } from "../mockdata/SurveyConfig";
import { SURVEY_ANSWER_TYPE, survey_attributes } from "../mockdata/QuestionSurveyVn";
import FormType from "../../../constant/FormType";
import _ from 'lodash'

export const findCategory = (categoryInput, category, type) => {
  if (category.categoryType === type) {
    return category;
  }

  const result = categoryInput.find(value => value.categoryCode === category.parentIds[0].categoryCode);
  if (result.categoryType === type) {
    return result;
  } return findCategory(categoryInput, result.parentIds[0], type);
};

const pushDataToEAVS = (eAVs, cate, subCate, value) => {
  eAVs.push({
    entityId: null,
    entityCode: subCate.categoryCode,
    entityName: subCate.categoryName,
    topParentCode: cate.categoryCode,
    topParentName: cate.categoryName,
    attributeCode: value,
    value: null,
    _id: null
  });
};

const pushDataToEAVSVFast = (eAVs, pro, attributeCode, value) => {
  eAVs.push({
    entityId: null,
    entityCode: pro.code,
    attributeCode,
    value
  });
};

const pushDataToEAVINI = (eAVs, pro) => {
  let eav = eAVs;
  if (pro.productList && pro.productList.length > 0) {
    pro.productList.forEach(product => {
      eav.push({
        _id: product._id,
        productCode: product.productCode,
        productName: product.productName,
        attributeCode: product.productCode,
        entityCode: pro.code,
        entityName: pro.title,
        value: null
      })
    })
  }
}

const totalText = (categoryName) => {
  let result = '';

  switch (categoryName) {
    case 'Chăm sóc cá nhân':
      result = '(Lifebuoy)';
      break;

    case 'Chăm sóc răng miệng':
      result = '(Colgate, P/S, Lipzo)';
      break;

    case 'Chăm sóc tóc':
      result = '(Dove, Sunsilk, Clear, Tresemme)';
      break;

    case 'Tã giấy':
      result = '(Bobby, Huggies)';
      break;

    case 'Nước xả vải':
      result = '(Comfort)';
      break;

    case 'Giặt tẩy':
      result = '(Omo, Viso, Surf)';
      break;


    default:
      result = "";
  }

  return result;
};
const totalMainText = (categoryName) => {
  let result = '';

  switch (categoryName) {
    case 'Chăm sóc cá nhân':
      result = '(Lifebuoy)';
      break;

    case 'Chăm sóc răng miệng':
      result = '(Colgate)';
      break;

    case 'Chăm sóc tóc':
      result = '(Dove, Sunsilk, Clear, Tresemme, Clear men, Romano, Xmen)';
      break;

    case 'Nước xả vải':
      result = '(Comfort)';
      break;

    case 'Tã giấy':
      result = '(Bobby, Huggies)';
      break;

    case 'Giặt tẩy':
      result = '(Omo, Viso, Surf)';
      break;


    default:
      result = "";
  }

  return result;
};
const totalOtherText = (categoryName) => {
  let result = '';

  switch (categoryName) {
    case 'Chăm sóc răng miệng':
      result = '(P/S, Lipzo)';
      break;

    // case 'Chăm sóc tóc':
    //   result = '(Gội và xả)';
    //   break;

    // case 'Giặt tẩy':
    //   result = '(Nước và bột giặt)';
    //   break;

    // case 'Dao cạo':
    //   result = '(Gillette)';
    //   break;

    default:
      result = "";
  }

  return result;
};

const convertTitleToData = (title) => {
  switch (title) {
    case "GONDOLA END (ĐẦU KỆ)":
      return "Gondola End";
    case "OSD (Ụ/ ĐẢO)":
      return "OSD";
    case "STANDEE":
      return "Standee";
    case "MPD/HANGER":
      return "MPD/Hanger";
    case "TRƯNG BÀY KHÁC":
      return "Others";
    default:
      return '';
  }
};


export const addDataToSOOSForm = (jsonFormInput, productDataInput, categoryInput, orgName) => {
  const jsonForm = jsonFormInput;

  // add org name to json form
  jsonForm[0].content = orgName.toUpperCase();

  // add full category to json Form

  // productCategory is the initial panel
  const productCategory = jsonForm.find(panel => panel.properties.url === API_CATEGORY_LIST && panel.properties.type === 'Category');

  if (productCategory) {
    categoryInput
      .filter(cate => cate.categoryType === 'Category')
      .forEach((category) => {

        //Clone the initial panel and change the name of panel by the name of category
        const newCategory = _.cloneDeep(productCategory);
        newCategory.title = category.categoryName;
        jsonForm.splice(3, 0, newCategory);
      });

    //Delete the initial panel
    jsonForm.splice(2, 1);
  } else {
    console.log("Couldnt find the category", jsonForm);
  }

  console.log("add full category to json Form", jsonForm);
  // add sub-category to json form
  jsonForm
    .filter(value => value.type === 'panel')
    .forEach((panel) => {
      categoryInput
        .filter(cate => cate.categoryType === 'Sub-Category' && cate.parentIds[0].categoryName === panel.title)
        .forEach((subCate) => {

          //Clone the initial sub-panel and change the name of panel by the name of category
          const newSubCategory = _.cloneDeep(panel.components[0]);
          newSubCategory.title = subCate.categoryName;
          panel.components.splice(1, 0, newSubCategory);
        });

      //Delete the initial sub-panel
      panel.components.splice(0, 1);
    });

  console.log("add sub-category to json Form", jsonForm);


  // add full product to json form
  if (productDataInput.length > 0) {
    productDataInput.forEach((pro, index) => {

      //Find the douplicate product (data has douplicate product and the different of them is attributeCode)
      const douplicateProduct = productDataInput.filter(p => pro.entityName === p.entityName);
      if (douplicateProduct.length == 1 || (douplicateProduct.length >= 3 && pro.attributeCode === "2")) {

        const categoryChild = categoryInput.find(value => value.categoryCode === pro.directParentCode);

        if (categoryChild) {
          const category = findCategory(categoryInput, categoryChild, "Category");
          const subCategory = findCategory(categoryInput, categoryChild, "Sub-Category");

          const productRowAtForm = jsonForm
            .filter(value => value.type === 'panel')
            .find(panel => panel.title === pro.topParentName)
            .components
            .find(panel => panel.title === subCategory.categoryName)
            .components;

          if (productRowAtForm) {
            const productList = [].concat(productRowAtForm);
            const newProduct = _.cloneDeep(productRowAtForm[1]);

            //ADD Name and id to Product Name
            newProduct.columns[0].components[0].content = pro.entityName;
            // newProduct.columns[0].components[0]._id = pro._id;


            //ADD id to Product Check Box
            newProduct.columns[1].components[0].index = index;

            //ADD id to Product Selector
            newProduct.columns[2].components[0].index = index;


            //ADD value to Product Check Box or Select box

            if (pro.attributeCode === '4') {
              // newProduct.columns[1].components[0].value = pro.value;
              newProduct.columns[1].components[0].defaultValues = [{ value: "No" }];
            } else {

              newProduct.columns[1].components[0].defaultValues = [{ value: 'Yes' }];

              if (pro.value !== 'Yes' && pro.value !== 'No') {
                newProduct.columns[2].components[0].defaultValues = [{ value: pro.value }];

              }
            }

            productList.push(newProduct);
            jsonForm
              .filter(value => value.type === 'panel')
              .find(panel => panel.title === category.categoryName)
              .components
              .find(panel => panel.title === subCategory.categoryName)
              .components = productList;
          } else {
            // console.log("Can not find productColumAtForm", pro);
          }
        } else {
          // console.log("Can not find categoryChild", pro);

          const img = jsonForm
            .find(value => value.type === 'file');

          const note = jsonForm
            .find(value => value.type === 'textarea');


          if (pro.attributeCode === 'SOOS Photos' && img) {
            img.defaultValues = [{ value: pro.value }];
            img.index = index;
          }


          if (pro.attributeCode === 'SOOS Note' && note) {
            note.defaultValues = [{ value: pro.value }];
            note.index = index;
          }
        }
      } else {
        // console.log("Can not find douplicateProduct", pro);
        // console.log("Can not find douplicateProduct", douplicateProduct);
      }

    });
  } else {
    // console.log("productDataInput.length === 0");
  }


  // remove example product data from json form
  jsonForm
    .filter(value => value.type === 'panel')
    .forEach(cate => cate.components.forEach(subCate => subCate.components.splice(1, 1)));

  console.log("add full product to json form", jsonForm);

  return jsonForm;
};

export const addDataToSODForm = (jsonFormInput, eAVSInput, categoryInput, orgName) => {
  const jsonForm = jsonFormInput;

  // add org name to json form
  jsonForm[0].content = orgName.toUpperCase();


  // add full category to json Form

  const eAVS = eAVSInput.length;

  jsonForm
    .filter(value => value.type === 'panel')
    .forEach((panel) => {
      categoryInput
        .filter(cate => cate.categoryType === 'Category' && cate.categoryName !== 'Chăm sóc phụ nữ')
        .forEach((category) => {
          const newCategory = _.cloneDeep(panel.components[0]);
          newCategory.components[newCategory.components.length - 1].label = `${
            // newCategory.components[newCategory.components.length - 1].label} ${totalText(category.categoryName)
            newCategory.components[newCategory.components.length - 1].label}`;

          newCategory.title = category.categoryName;
          panel.components.splice(1, 0, newCategory);
        });
      panel.components.splice(0, 1);

      panel.components.forEach((child) => {
        categoryInput
          .filter(cate => cate.categoryType === 'Brand' &&
            findCategory(categoryInput, cate, 'Category').categoryName === child.title)
          .forEach((category) => {
            const newCategory = _.cloneDeep(child.components[0]);
            newCategory.defaultValues = [{ value: '' }]
            newCategory.label = category.categoryName;

            const indexSubCate = _.findIndex(eAVSInput, eav => {
              return eav.entityCode == category.categoryCode && eav.entityName == category.categoryName && eav.attributeCode === `SOD PnG ${convertTitleToData(panel.title)}`
            })

            if (eAVS === 0 || indexSubCate < 0) {
              pushDataToEAVS(eAVSInput, findCategory(categoryInput, category, 'Category'), category, `SOD PnG ${convertTitleToData(panel.title)}`);
            }

            child.components.splice(1, 0, newCategory);
          });

        if (eAVS === 0) {
          const cate = categoryInput.find(ea => ea.categoryName === child.title);
          pushDataToEAVS(eAVSInput, cate, cate, `SOS Rival ${convertTitleToData(panel.title)}`);
        }

        child.components.splice(0, 1);
      });
    });
  // add value from eAVS to json form

  eAVSInput.forEach((pro, index) => {
    const element = jsonForm
      .filter(value => value.type === 'panel')
      .find(panel => (pro.attributeCode.toLowerCase()
        .includes(panel.title.substring(0, 3).toLowerCase()) ||
        (pro.attributeCode.includes('Others') && panel.title === 'TRƯNG BÀY KHÁC')))
      .components
      .find(panel => panel.title.includes(pro.topParentName))
      .components
      .find((value) => {
        let result = false;

        if (pro.attributeCode.includes('Rival')) {
          result = (value.label.includes('Tổng tất cả đối thủ'));
        } else {
          result = (value.label && pro.entityName && value.label === pro.entityName);
        }

        return result;
      });

    if (element) {
      element.defaultValues = [{ value: pro.value }];
      element.index = index;
    } else {
      // console.log('EAVS', "EAVS couldn't find element", pro, 'Index', index);
    }
  });

  return jsonForm;
};

export const addDataToSOSForm = (jsonFormInput, eAVSInput, categoryInput, orgName) => {
  const jsonForm = jsonFormInput;

  // add org name to json form
  jsonForm[0].content = orgName.toUpperCase();

  // add full category to json Form
  const productCategory = jsonForm.find(panel => panel.properties.url === API_CATEGORY_LIST && panel.properties.type === 'Category');


  categoryInput
    .filter(cate => cate.categoryType === 'Category' && cate.categoryName !== 'Chăm sóc phụ nữ')
    .forEach((category) => {
      const newCategory = _.cloneDeep(productCategory);

      const length = newCategory.components.length;

      newCategory.components[length - 1].label = `${
        newCategory.components[length - 1].label} ${totalOtherText(category.categoryName)
        }`;

      newCategory.components[length - 2].label = `${
        newCategory.components[length - 2].label} ${totalMainText(category.categoryName)
        }`;

      if (category.categoryName === 'Dao cạo') {
        newCategory.components.splice(length - 2, 1);
      }

      newCategory.title = category.categoryName;
      if (!jsonForm.find(current => current.title === newCategory.title)) {
        jsonForm.splice(3, 0, newCategory);
      }
    });
  jsonForm.splice(2, 1);

  const eAVS = eAVSInput.length;

  // add sub-category to json form
  jsonForm
    .filter(value => value.type === 'panel')
    .forEach((panel) => {
      // Add brand to category
      const subCateList =
        categoryInput
          .filter(cate => ((cate.categoryType === 'Brand' || cate.categoryType === 'Category') &&
            findCategory(categoryInput, cate, 'Category').categoryName === panel.title));
      console.log("jsonForm subCateList>>", subCateList)
      subCateList.forEach((subCate) => {
        const cate = findCategory(categoryInput, subCate, 'Category');
        if (subCate.categoryType === 'Brand') {
          const newSubCategory = _.cloneDeep(panel.components[0]);
          newSubCategory.defaultValue = '';

          newSubCategory.defaultValues = [{ value: '' }];
          newSubCategory.label = subCate.categoryName;
          panel.components.splice(1, 0, newSubCategory);

          const indexSubCate = _.findIndex(eAVSInput, eav => {
            return eav.entityCode == subCate.categoryCode && eav.entityName == subCate.categoryName
          })
          if (eAVS === 0 || indexSubCate < 0) {
            pushDataToEAVS(eAVSInput, cate, subCate, "SOS PnG");
          }
        } else if (eAVS === 0) {
          pushDataToEAVS(eAVSInput, cate, cate, "SOS DirectRival");
          pushDataToEAVS(eAVSInput, cate, cate, "SOS OtherRival");
        }
      });
      panel.components.splice(0, 1);
    });


  // add value from eAVS to json form

  eAVSInput.forEach((pro, index) => {
    if (pro.attributeCode.includes('DirectRival')) {
      const element = jsonForm
        .find(panel => panel.title === pro.topParentName)
        .components
        .find(value => value.properties.resource === 'SOS DirectRival');

      if (element) {
        element.defaultValues = [{ value: pro.value }];
        element.index = index;
      } else {
        // console.log("Tổng đối thủ chính Product", pro);
      }
    } else if (pro.attributeCode.includes('OtherRival')) {
      const element = jsonForm
        .find(panel => panel.title === pro.topParentName)
        .components
        .find(value => value.properties.resource === 'SOS OtherRival');

      if (element) {
        element.defaultValues = [{ value: pro.value }];
        element.index = index;
      } else {
        // console.log("Tổng đối thủ khác", pro);
      }
    } else {
      const element = jsonForm
        .find(value => value.type === 'panel' && value.title === pro.topParentName)
        .components
        .find(value => value.label === pro.entityName);

      if (element) {
        element.defaultValues = [{ value: pro.value }];
        element.index = index;
      } else {
        // console.log("Product", pro);
      }
    }
  });

  return jsonForm;
};

export const addDataToVFastForm = (jsonFormInput, eAVSInput, programInput, orgName) => {
  const jsonForm = jsonFormInput;

  // add org name to json form
  jsonForm[0].content = orgName.toUpperCase();

  const programDefault = programInput[0];

  const proSelect = jsonForm.find(value => value.type === 'select' && value.properties.url === API_PROMOTION_VFAST);
  if (proSelect) {
    proSelect.defaultValues = [{ value: programDefault.title }];
    proSelect.proData = programInput.map(pro => pro.title);
  } else {
    // console.log("Couldn find the proSelect");
  }

  const eAVS = eAVSInput.length;

  if (eAVS === 0) {
    // console.log("eAVSInput empty");
    programInput.forEach((pro) => {
      pushDataToEAVSVFast(eAVSInput, pro, 'Postmail_From', new Date());
      pushDataToEAVSVFast(eAVSInput, pro, 'Postmail_To', new Date());
      pushDataToEAVSVFast(eAVSInput, pro, 'SOS_Date', new Date());
      pushDataToEAVSVFast(eAVSInput, pro, 'Distribution_Goal', null);
      pushDataToEAVSVFast(eAVSInput, pro, 'Distribution_Real', null);
      pushDataToEAVSVFast(eAVSInput, pro, 'VFast SOS Photos', null);
      pushDataToEAVSVFast(eAVSInput, pro, 'VFast QKC Photos', null);
      pushDataToEAVSVFast(eAVSInput, pro, 'VFast NQKC Photos', null);
    });
  }


  eAVSInput
    .forEach((pro, index) => {
      // console.log("addDataToVFastForm", pro);

      if (pro.entityCode === programDefault.code) {
        const element = jsonForm
          .find(value => pro.attributeCode === value.properties.resource);

        if (element) {
          element.defaultValues = [{ value: pro.value }];
          element._id = pro._id;
          element.index = index;
        } else {
          // console.log("Couldn find the element", pro);
        }
      }
    });


  return jsonForm;
};

export const addDataToSurveyForm = (taskDetailData, categoryInput, orgName, org) => {
  const jsonForm = taskDetailData.components;
  const eAVSInput = taskDetailData.task.lastResponse.eAVs;
  const { taskActionCode } = taskDetailData.task.taskAction;
  const eAVS = eAVSInput.length;

  // add org name to json form
  jsonForm[0].content = orgName.toUpperCase();

  const cateRow = jsonForm[1];
  const listCate = ['C001', 'C002', 'C003', 'C004', 'C005'];

  listCate
    .forEach((value) => {
      const newCateRow = _.cloneDeep(cateRow);

      let title = value;

      const cateResult = categoryInput.find(cate => cate.categoryCode === value);
      if (cateResult) {
        title = cateResult.categoryName;
      }

      newCateRow.title = title;
      jsonForm.push(newCateRow);
    });

  jsonForm.splice(1, 1);

  const allQuestions = surveyConfig[taskActionCode];
  const boolQuestions = allQuestions.filter(question => {
    console.log("allQuestions question>>", question)
    return survey_attributes[question.id].answerType === SURVEY_ANSWER_TYPE.BOOLEAN
  });

  boolQuestions.forEach((question) => {
    const questionRows = jsonForm
      .find(panel => panel.type === 'panel' &&
        panel.title === categoryInput.find(cate => cate.categoryCode === question.category).categoryName)
      .components;
    if (questionRows && questionRows[1]) {

      const newQuestionRow = _.cloneDeep(questionRows[1]);
      const newImgRow = _.cloneDeep(questionRows[2]);

      newQuestionRow.properties.resource = question.id;
      newImgRow.properties.resource = question.id;
      questionRows.push(newImgRow, newQuestionRow);
    }

  });


  if (eAVS === 0) {

    allQuestions.forEach((question) => {
      eAVSInput.push({
        entityId: question.category,
        entityCode: question.category,
        attributeCode: question.id,
        value: survey_attributes[question.id].answerType === SURVEY_ANSWER_TYPE.BOOLEAN ? undefined : '0',
        _id: null
      });
    });

    listCate.forEach((cate) => {
      eAVSInput.push({
        entityId: cate,
        entityCode: cate,
        attributeCode: "Golden Category",
        value: undefined,
        _id: null
      }, {
        entityId: cate,
        entityCode: cate,
        attributeCode: "Golden Point of Cat",
        value: '0',
        _id: null
      });
    })


    eAVSInput.push({
      entityId: org[0],
      attributeCode: "Golden Point",
      value: '0'
    }, {
      entityId: org[0],
      attributeCode: "Golden Store",
      value: undefined
    });

    boolQuestions.forEach((question) => {
      eAVSInput.push({
        entityId: question.category,
        entityCode: question.category,
        attributeCode: `${taskActionCode} Survey Photos ${question.id}`,
        value: null,
        _id: null
      });
    });

  } else {
    // console.log('addDataToSurveyForm', "eAVSInput has data", eAVSInput);
  }

  jsonForm
    .filter(value => value.type === 'panel')
    .forEach((panel) => {
      panel.components.splice(1, 2);
    });


  eAVSInput
    .forEach((pro, index) => {
      if (!isNaN(pro.attributeCode) && !survey_attributes[pro.attributeCode]) {
        console.log('here')
      }

      if (pro.attributeCode !== '48' && pro.attributeCode !== '49') {
        if (pro.attributeCode.includes("Survey Photos")) {

          const imgRowAtForm = jsonForm
            .find(value => categoryInput.find(cate => cate.categoryCode === pro.entityCode).categoryName === value.title)
            .components
            .find(row => row.type === 'file' && row.properties.resource && pro.attributeCode.includes(row.properties.resource));

          if (imgRowAtForm) {
            imgRowAtForm.defaultValues = [{ value: pro.value }];
            imgRowAtForm.index = index;
          } else {
            // console.log("addDataToSurveyForm", "Couldn't find the IMG pro", pro);
            // console.log("addDataToSurveyForm", "Couldn't find the IMG jsonForm", jsonForm);
          }
        }
        else if (!isNaN(pro.attributeCode) && survey_attributes[pro.attributeCode].answerType === SURVEY_ANSWER_TYPE.BOOLEAN) {

          const questionRowAtForm = jsonForm
            .find(value => categoryInput.find(cate => cate.categoryCode === pro.entityCode).categoryName === value.title)
            .components
            .find(row => row.properties.resource === pro.attributeCode && row.type === 'columns');

          if (questionRowAtForm) {
            questionRowAtForm.columns[0].components[0].content = survey_attributes[pro.attributeCode].question;
            questionRowAtForm.columns[1].components[0].index = index;

            questionRowAtForm.columns[2].components[0].index = index;

            const question = surveyConfig[taskActionCode].find(q => q.id === pro.attributeCode);
            let questionValue = '0';
            if (question) {
              questionValue = question.value;
            }

            if (pro.value && pro.value.toString().toLowerCase() === 'yes') {
              questionRowAtForm.columns[1].components[0].defaultValues = [{ value: pro.value }];
              questionRowAtForm.columns[1].components[0].value = pro.value;
              questionRowAtForm.columns[2].components[0].content = `${questionValue}${'/'}${questionValue}`;
            } else if (pro.value && pro.value.toString().toLowerCase() === 'no') {
              questionRowAtForm.columns[1].components[0].defaultValues = [{ value: pro.value }];
              questionRowAtForm.columns[1].components[0].value = pro.value;
              questionRowAtForm.columns[2].components[0].content = `${'0/'}${questionValue}`;
            } else {
              questionRowAtForm.columns[1].components[0].defaultValues = [{ value: undefined }];
              questionRowAtForm.columns[1].components[0].value = undefined;
              questionRowAtForm.columns[2].components[0].content = ' ';
            }

          } else {
            // console.log("addDataToSurveyForm", "Couldn't find the element pro", pro);
            // console.log("addDataToSurveyForm", "Couldn't find the element jsonForm", jsonForm);
          }
        }
        else {
          // console.log("addDataToSurveyForm", "Skip ", pro, '; index: ', index);
        }
      }
    });


  return jsonForm;
};


export const addDataToInitiativeForm = (components, eAVSInput, programInput, orgName) => {
  let componentValue = components;
  componentValue[0].content = orgName.toUpperCase();

  const programDefault = programInput[0];

  const proSelect = componentValue.find(value => value.type === 'select' && value.properties.url === API_PROMOTION_INITIATIVE);
  if (proSelect) {
    proSelect.defaultValues = [{ value: programDefault.title }];
    proSelect.proData = programInput.map(pro => pro.title);
    proSelect.programList = programInput;
  }

  let eavListDefault = []
  /**
   * with case task is new, eav is empty, we must add productList from programs to eav list (easy case)
   */
  if (!eAVSInput || eAVSInput.length === 0) {
    console.log("eAVSInput empty");
    programInput.forEach((pro) => {
      pushDataToEAVINI(eAVSInput, pro);
    });

  }
  /**
   * task is submitted,(complicated case)
   * we must map productList in program to eav list
   * we have three cases that we must do : 
   *      + PSKU in a program is added : this PSKU must be displayed on screen with value null 
   *      + PSKU in a program is deleted : this PSKU must  not be displayed on screen 
   *      + PSKU in a program is change : this PSKU must  not be displayed by new its name
   *      + Similar with case Program is added ,deleted or changed 
   * * * Alogrithm: start from program, map eav to each of program's productList
   * * * Note:  + program does not contain the image infomation, eav does.  
   *            + program can has same product 
   */
  else if (eAVSInput.length > 0) {
    let eAVSInputNew = []
    /**
     * add product code + poduct name in evas
     * must be map from program's products to eavs list by its _id
     */

    let eAVSInputProduct = _.filter(eAVSInput, eav => {
      return (!eav.value || !eav.value.includes('http'));
    })

    let eAVSInputFile = _.filter(eAVSInput, eav => {
      return (eav.value && eav.value.includes('http'));
    })

    programInput.forEach((program) => {
      _.forEach(program.productList, product => {
        //find in eav, there is product that has productCode same as product 
        const indexProductEav = _.findIndex(eAVSInputProduct, eavProduct => {
          return product.productCode === eavProduct.attributeCode && program.code === eavProduct.entityCode;
        })
        // if product not change, push to eAVSInputNew
        if (indexProductEav >= 0) {
          eAVSInputNew.push({
            _id: product._id,
            productCode: product.productCode,
            productName: product.productName,
            attributeCode: product.productCode,
            entityCode: program.code,
            entityName: program.title,
            value: eAVSInputProduct[indexProductEav].value,
          })
        }
        // if product is new, (has just added), push to newEav with value is null 
        else {
          eAVSInputNew.push({
            _id: product._id,
            productCode: product.productCode,
            productName: product.productName,
            attributeCode: product.productCode,
            entityCode: program.code,
            entityName: program.title,
            value: null
          })
        }
      })
    });

    _.forEach(eAVSInputFile, eavFile => {
      const indexProgram = _.findIndex(programInput, program => {
        return eavFile.entityCode === program.code;
      })
      if (indexProgram >= 0) {
        const programFile = programInput[indexProgram];

        eAVSInputNew.push({
          attributeCode: eavFile.attributeCode,
          entityCode: programFile.code,
          entityName: programFile.title,
          value: eavFile.value,
        })
      }
    })
    eAVSInput.splice(0, eAVSInput.length, ...eAVSInputNew)

    // filter to eav list consitent with default program
    eavListDefault = _.filter(eAVSInput, (eav) => {
      return programDefault.title === eav.entityName && programDefault.code === eav.entityCode;
    })
  }
  //push data to default with program default
  let columnDefault = _.cloneDeep(componentValue[2].components[1].columns);

  //add PSKU
  if (programDefault.productList && programDefault.productList.length > 0) {
    programDefault.productList.forEach(product => {
      let columns = _.cloneDeep(columnDefault);
      columns[0].components[0].content = product.productName;
      columns[1].components[0].product = product;
      columns[1].components[0].program = programDefault.title;

      let valueDefault = null
      if (eavListDefault && eavListDefault.length > 0) {
        const eavDefault = _.filter(eavListDefault, (eav) => { return eav._id === product._id });
        console.log("eAVSInput eavDefault>>", eavDefault);
        valueDefault = eavDefault && eavDefault.length > 0 ? eavDefault[0].value : null
      }
      columns[1].components[0].value = valueDefault;

      components[2].components.push({
        columns,
        input: false,
        key: "undefinedPanelColumns2",
        tableView: false,
        tags: [],
        type: "columns"
      })
    })
  }

  //add image
  components[3].program = programDefault;
  components[4].program = programDefault;

  //filter eav that contains value of this image ( eav that has same label and programCode )
  const eavsInput1 = _.filter(eAVSInput, (eav) => {
    return eav.attributeCode === components[3].key && eav.entityCode === programDefault.code;
  })

  if (eavsInput1 && eavsInput1.length > 0) {
    components[3].defaultValues = [{ value: eavsInput1[0].value }]
    // components[3].defaultValues = eavsInput1[0].value//[{ value: eavsInput1[0].value }]
    components[3].valueDefault = eavsInput1[0].value
  } else {
    components[3].defaultValues = []
    components[3].valueDefault = ''
  }

  const eavsInput2 = _.filter(eAVSInput, (eav) => {
    return eav.attributeCode === components[4].key && eav.entityCode === programDefault.code
  })

  if (eavsInput2 && eavsInput2.length > 0) {
    components[4].defaultValues = [{ value: eavsInput2[0].value }]
    // components[4].defaultValues = eavsInput2[0].value //[{ value: eavsInput2[0].value }]
    components[4].valueDefault = eavsInput2[0].value
  } else {
    components[4].defaultValues = []
    components[4].valueDefault = ''
  }

  return componentValue;
};

export const addDataToCheckInForm = (jsonFormInput, eAVSInput) => {
  if (!eAVSInput || !eAVSInput[0]) {
    jsonFormInput[0].defaultValues = []
  } else {
    jsonFormInput[0].defaultValues = [{ value: eAVSInput[0].value }]
  }
}

export const calculateComponentPhotoApp = (components, eAVSInput, dataTask) => {
  if (!components || components.length <= 0) {
    return components;
  }
  const program = dataTask.task.description;

  let componentResult = components;
  const proNameComponentIndex = _.findIndex(components, component => component.type === FormType.HTML_TEXT);
  const pickImageIndex = _.findIndex(components, component => component.type === FormType.PICK_IMAGE);
  //set program name 
  componentResult[proNameComponentIndex].content = program
  //set image follow program 
  if (eAVSInput && eAVSInput.length > 0) {
    componentResult[pickImageIndex].defaultValues = eAVSInput.map(eav => {
      return {
        ...eav,
        value: eav.value,
        latlng: eav.entityCode,
        timestamp: eav.entityName,
      }
    })
  }
  return componentResult
}

export const notUnknowContainer = (container) => {
  if (!container || !container.containerNumber || _.isEmpty(container.containerNumber))
    return true;

  return container.containerNumber.toLowerCase() === 'unknown'
}

export const calculateComponentLiftOn1 = (components, currentShipment, taskDetail) => {

  if (!components || components.length <= 0) {
    return components;
  }
  const panelComponent = components.filter(component => {
    return component.type === FormType.PANEL
  })

  const currentShipmentStops = currentShipment.shipmentStopIds.find((stop) => {
    return stop.taskIds.filter(task => task._id === taskDetail._id).length > 0
  })

  const containerIds = currentShipmentStops.containerIds

  // if (panelComponent.length >= containerIds.length) {
  //   return components
  // }
  // let componentResult = components;
  const lastIndexPanel = _.findLastIndex(components, component => {
    return component.type === FormType.PANEL
  })
  const notPanelComponent = components.filter(component => {
    return component.type !== FormType.PANEL
  })
  const entities = taskDetail.lastResponse.entities
  if (lastIndexPanel === -1) {
    return []
  }
  let componentResult = containerIds.map((id, index) => {
    const componentPanel = _.cloneDeep(components[lastIndexPanel])

    componentPanel.components = componentPanel.components.map((component, idx) => {

      const entity = entities.find(ent => {
        return ent.data && ent.data[0] && ent.data[0].label === id.containerCode && ent.label === component.label
      })
      if (idx === 0) {
        return {
          ...component,
          key: component.key + index,
          disabled: !notUnknowContainer(id),
          defaultValues: [
            {
              label: id.containerCode,
              value: entity && entity.data[0] ? entity.data[0].value : (notUnknowContainer(id) ? '' : id.containerNumber),
            }
          ]
        }
      }
      return {
        ...component,
        key: component.key + index,
        defaultValues: [
          {
            label: id.containerCode,
            value: entity && entity.data[0] ? entity.data[0].value : ''
          }
        ]
      }
    })
    componentPanel.title += ' ' + (index + 1)
    return componentPanel
  })

  const lastResult = componentResult.concat(notPanelComponent)

  return lastResult


}
