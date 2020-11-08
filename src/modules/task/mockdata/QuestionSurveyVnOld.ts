
export const SURVEY_ANSWER_TYPE = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  SOS: 'SOS',
  SOD: 'SOD',
  PSKU: 'PSKU'
};

export const survey_attributes = {

  5: {
    question: "P sku ditribution =100%",
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  6: {
    question: "SOS >= 28%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 28
  },
  7: {
    question: "SOD >= 35%",
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 35
  },
  8: {
    question: "Quầy kệ Ariel có bên cạnh OMO không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  9: {
    question: "Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Tide Downy/ Ariel Sạch nhanh) không (+/- 2% sai lệch)?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  10: {
    question: "Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  11: {
    question: "Quầy kệ các thông tin nhãn hàng không (header/ divider)?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  12: {
    question: "Mâm kệ chính có đèn chiếu sáng không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  13: {
    question: "SOS >= 43%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 43
  },
  14: {
    question: "Planogram Downy Hương nước hoa PMC  có >=60% (+/-2%) so với tổng kệ Downy không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  15: {
    question: "SOD >= 50%",
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 50
  },
  16: {
    question: "Cửa hàng có trưng bày đầy đủ các mặt hàng và >=50% (+/-2%) trưng bày cho những mặt hàng chủ chốt (Huyền Bí và Đam Mê/ Hương Nắng Mai)?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  17: {
    question: "SOS >= 27%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 27
  },
  18: {
    question: "SOD >= 29%",
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 29
  },
  19: {
    question: "Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  20: {
    question: "Siêu thị có lắp đặt frame có đèn của PNT, H&S và Rejoice không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  21: {
    question: "SOS >= 22%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 22
  },
  22: {
    question: "SOD >= 22%",
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 22
  },
  23: {
    question: "Planogram Pampers có sắp xếp theo cùng nhãn hiệu Pampers, rồi chia theo Tả quần cao cấp => Tả dán - Tả quần thông dụng không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  24: {
    question: "Tả quần Pampers size S/M hoặc tả dán Pampers newborn/ Pampers newborn size S có được trưng bày trên kệ ngang tầm mắt của khách hàng không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  25: {
    question: "Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  26: {
    question: "Trên quầy kệ chính có thông tin nhãn hiệu không? (shelf talker hoặc khung frame)",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  27: {
    question: "Siêu thị có lắp đặt trung tâm Chăm sóc trẻ em (Baby solution center) không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  28: {
    question: "Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  29: {
    question: "SOS >= 60%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 60
  },
  30: {
    question: "Planogram có được chia ra Dao cạo thay lưỡi (60%) và Dao cạo dùng một lần (40%) không? (sai lệch +/-2%)",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  31: {
    question: "Dao cạo thay lưỡi có nằm ở vị trí ngang tầm mắt và Dao cạo dùng một lần ở mâm kệ phía dưới không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  32: {
    question: "Cửa hàng có trưng bày tại Quầy Cashier hay không? (chỉ áp dụng cho MM/Lotte/Emart/Giant/BigC)",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  33: {
    question: "Có lắp đặt tủ Gillette không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  34: {
    question: "SOS >= 34%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 34
  },
  35: {
    question: "SOS >= 35%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 35
  },
  36: {
    question: "SOS >= 24%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 24
  },
  37: {
    question: "SOD >= 49.5%",
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 49.5
  },
  38: {
    question: "SOS >= 70%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 70
  },
  39: {
    question: "SOS >= 26%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 26
  },
  40: {
    question: "Gillette có 6 mặt trên kệ?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  41: {
    question: "Gillette có trưng bày ít nhất 6 mặt các P sku trên kệ không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  42: {
    question: "Trên quầy kệ Pampers có đủ các size từ S-XL không?",
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },


  // New Question add since 26/3/2018

  //MR - Laundry (Giật tấy - C002)

  50: {
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  51: {
    question: 'Thị phần quầy kệ >= ?',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 28
  },
  52: {
    question: "Thị phần trưng bày >= 40%",
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 40
  },
  53: {
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Tide Downy/ Ariel Sạch nhanh) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  54: {
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  55: {
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  56: {
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/


  //MR - Fabric Enhancer (Nước xả vải - C003)

  57: {
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  58: {
    question: 'Thị phần quầy kệ >= ?',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 37
  },
  59: {
    question: 'Planogram Downy Hương nước hoa PMC  có >=60% (+/-2%) so với tổng kệ Downy không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  60: {
    question: 'Thị phần trưng bày >= 50%',
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 50
  },
  61: {
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Huyền Bí & Đam mê/ Nắng mai) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  62: {
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  63: {
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  64: {
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/

  //MR - Haircare (Chăm sóc tóc - C001)

  65: {
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  66: {
    question: 'Thị phần quầy kệ >= ?',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 28
  },
  67: {
    question: 'Thị phần trưng bày >=39.4%',
    answerType: SURVEY_ANSWER_TYPE.SOD,
    baseValue: 39.4
  },
  68: {
    question: 'Trên quầy kệ có trưng bày Golden River (Dòng Sông Vàng Dầu Xả 3MM?) ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  69: {
    question: 'Siêu thị có lắp đặt frame có đèn của PNT, H&S và Rejoice không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/

  //MR - Diaper (Tã giấy - C004)

  70: {
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  71: {
    question: 'Siêu thị có phân phối đầy đủ các size từ M -> XL không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  72: {
    question: 'Planogram Pampers có sắp xếp theo cùng nhãn hiệu Pampers, rồi chia theo Tả quần cao cấp => Tả dán - Tả quần thông dụng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  73: {
    question: 'Tả quần Pampers size S/M có được trưng bày trên kệ ngang tầm mắt của khách hàng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  74: {
    question: 'Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  75: {
    question: 'Trên quầy kệ chính có thông tin nhãn hiệu không? (shelf talker hoặc khung frame)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  76: {
    question: 'Siêu thị có lắp đặt trung tâm Chăm sóc trẻ em (Baby solution center) không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/

  //MR - Shaving (Dao cạo - C005)

  77: {
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  78: {
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  79: {
    question: 'Thị phần quầy kệ >= ?',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 60
  },
  80: {
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  81: {
    question: 'Cửa hàng có trưng bày tại Quầy Cashier hay không? (chỉ áp dụng cho MM/Lotte/Emart/Giant/BigC)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  82: {
    question: 'Cửa hàng có thanh thông tin sản phẩm (Mach 3 & ProGlide) và hàng mẫu thử không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  83: {
    question: 'Có lắp đặt Gillette PMU không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/
  /*End of MR*/

  //MM/CVS - Haircare (Chăm sóc tóc - C001)


  84: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 90%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  85: {
    question: 'Thị phần quầy kệ >= 33.3',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 33.3
  },

  /*==============================================================================================*/

  //MM - DIAPERS (Tã giấy - C004)

  86: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 90%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  87: {
    question: 'Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/

  //MM - SHAVE CARE (Dao cạo - C005)

  88: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  89: {
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  90: {
    question: 'Thị phần quầy kệ >= 60',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 60
  },
  91: {
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  92: {
    question: 'Cửa hàng có tủ trưng bày Gillette hay không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/

  //MM - LAUNDRY (Giật tấy - C002)

  93: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },

  /*==============================================================================================*/

  //MM - FABRIC ENHANCER (Nước xả vải - C003)

  94: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  95: {
    question: `Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Huyền Bí & Đam mê/ Nắng mai) không ((+/- 2% sai lệch)?`,
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  /*==============================================================================================*/
  /*End of MM*/

  //CVS - SHAVE CARE (Dao cạo - C005)

  96: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  97: {
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  98: {
    question: 'Thị phần quầy kệ >= 60',
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 60
  },
  99: {
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  100: {
    question: 'Cửa hàng có tủ trưng bày Gillette hay không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  /*==============================================================================================*/

  //CVS - LAUNDRY (Giật tấy - C002)
  101: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  /*==============================================================================================*/

  //CVS - FABRIC ENHANCER (Nước xả vải - C003)
  102: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  /*==============================================================================================*/

  //CVS - DIAPERS (Tã giấy - C004)

  103: {
    question: 'Phân phối sản phẩm chủ lực (P sku) >= 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },

  /*==============================================================================================*/
  /*End of CVS*/

  104:
  {
    AttributeCode: 104,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  105:
  {
    AttributeCode: 105,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  106:
  {
    AttributeCode: 106,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  107:
  {
    AttributeCode: 107,
    Weightage: 100,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  108:
  {
    AttributeCode: 108,
    Weightage: 100,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  109:
  {
    AttributeCode: 109,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 28%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  110:
  {
    AttributeCode: 110,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 28%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  111:
  {
    AttributeCode: 111,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 28%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  112:
  {
    AttributeCode: 112,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOD >= 40%',
    question: 'Thị phần trưng bày >= 40%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  113:
  {
    AttributeCode: 113,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOD >= 40%',
    question: 'Thị phần trưng bày >= 40%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  114:
  {
    AttributeCode: 114,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOD >= 40%',
    question: 'Thị phần trưng bày >= 40%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  115:
  {
    AttributeCode: 115,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have full variant in display (vs. Feature) and >=50% (+/- 2%)display for hero variants (Tide Downy, Ariel Base)?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Tide Downy/ Ariel Sạch nhanh) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  116:
  {
    AttributeCode: 116,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have full variant in display (vs. Feature) and >=50% (+/- 2%)display for hero variants (Tide Downy, Ariel Base)?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Tide Downy/ Ariel Sạch nhanh) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  117:
  {
    AttributeCode: 117,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have full variant in display (vs. Feature) and >=50% (+/- 2%)display for hero variants (Tide Downy, Ariel Base)?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Tide Downy/ Ariel Sạch nhanh) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  118:
  {
    AttributeCode: 118,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have shelf Always on Claim like shelf tray/ shelf talker/ shelf frame?',
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  119:
  {
    AttributeCode: 119,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have shelf Always on Claim like shelf tray/ shelf talker/ shelf frame?',
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  120:
  {
    AttributeCode: 120,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have shelf Always on Claim like shelf tray/ shelf talker/ shelf frame?',
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  121:
  {
    AttributeCode: 121,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have brand communication board?',
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  122:
  {
    AttributeCode: 122,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have brand communication board?',
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  123:
  {
    AttributeCode: 123,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have brand communication board?',
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  124:
  {
    AttributeCode: 124,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have lighting shelving?',
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  125:
  {
    AttributeCode: 125,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have lighting shelving?',
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  126:
  {
    AttributeCode: 126,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have lighting shelving?',
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  127:
  {
    AttributeCode: 127,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  128:
  {
    AttributeCode: 128,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  129:
  {
    AttributeCode: 129,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  130:
  {
    AttributeCode: 130,
    Weightage: '50',
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  131:
  {
    AttributeCode: 131,
    Weightage: 100,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  132:
  {
    AttributeCode: 132,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 37%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  133:
  {
    AttributeCode: 133,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 37%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  134:
  {
    AttributeCode: 134,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 37%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  135:
  {
    AttributeCode: 135,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'PMC shelving >= 60% (+/- 2%) of total Downy shelving',
    question: 'Planogram Downy Hương nước hoa PMC  có >=60% (+/-2%) so với tổng kệ Downy không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  136:
  {
    AttributeCode: 136,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'PMC shelving >= 60% (+/- 2%) of total Downy shelving',
    question: 'Planogram Downy Hương nước hoa PMC  có >=60% (+/-2%) so với tổng kệ Downy không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  137:
  {
    AttributeCode: 137,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'PMC shelving >= 60% (+/- 2%) of total Downy shelving',
    question: 'Planogram Downy Hương nước hoa PMC  có >=60% (+/-2%) so với tổng kệ Downy không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  138:
  {
    AttributeCode: 138,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOD >50% ',
    question: 'Thị phần trưng bày >= 50%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  139:
  {
    AttributeCode: 139,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOD >50% ',
    question: 'Thị phần trưng bày >= 50%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  140:
  {
    AttributeCode: 140,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOD >50% ',
    question: 'Thị phần trưng bày >= 50%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  141:
  {
    AttributeCode: 141,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have full variant in display and >=50% (+/- 2%) display for hero variants (Mystique/ Passion/ Sunrise Fresh) ?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Huyền Bí & Đam mê/ Nắng mai) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  142:
  {
    AttributeCode: 142,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have full variant in display and >=50% (+/- 2%) display for hero variants (Mystique/ Passion/ Sunrise Fresh) ?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Huyền Bí & Đam mê/ Nắng mai) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  143:
  {
    AttributeCode: 143,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have full variant in display and >=50% (+/- 2%) display for hero variants (Mystique/ Passion/ Sunrise Fresh) ?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Huyền Bí & Đam mê/ Nắng mai) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  144:
  {
    AttributeCode: 144,
    Weightage: '50',
    Target: '50',
    PE: 'SBD',
    Description: 'Do we have full variant in display and >=50% (+/- 2%) display for hero variants (Mystique/ Passion/ Sunrise Fresh) ?',
    question: 'Tại các vị trí trưng bày của nhãn hiệu có đầy đủ các variant không so với postmail và  có trưng bày >=50%  các variant chính (Huyền Bí & Đam mê/ Nắng mai) không ((+/- 2% sai lệch)?\r\n',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  145:
  {
    AttributeCode: 145,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have shelf Always on Claim like shelf tray/ shelf talker/ shelf frame?',
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  146:
  {
    AttributeCode: 146,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have shelf Always on Claim like shelf tray/ shelf talker/ shelf frame?',
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  147:
  {
    AttributeCode: 147,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have shelf Always on Claim like shelf tray/ shelf talker/ shelf frame?',
    question: 'Trên quầy kệ chính luôn có shelf tray hay shelf talker hay khung frame không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  148:
  {
    AttributeCode: 148,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have brand communication board?',
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  149:
  {
    AttributeCode: 149,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have brand communication board?',
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  150:
  {
    AttributeCode: 150,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have brand communication board?',
    question: 'Quầy kệ các thông tin nhãn hàng không (header/ divider)? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  151:
  {
    AttributeCode: 151,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have lighting shelving?',
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  152:
  {
    AttributeCode: 152,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have lighting shelving?',
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  153:
  {
    AttributeCode: 153,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have lighting shelving?',
    question: 'Mâm kệ chính có đèn chiếu sáng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  154:
  {
    AttributeCode: 154,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  155:
  {
    AttributeCode: 155,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  156:
  {
    AttributeCode: 156,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  157:
  {
    AttributeCode: 157,
    Weightage: '80',
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  158:
  {
    AttributeCode: 158,
    Weightage: '80',
    Target: 95,
    PE: 'PSKU',
    Description: 'Do we have P sku ditribution >= 95%?',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  159:
  {
    AttributeCode: 159,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS ≥ 28% (MR/IS) & SOS ≥ 33.3% (MM/CVS)',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  160:
  {
    AttributeCode: 160,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS ≥ 28% (MR/IS) & SOS ≥ 33.3% (MM/CVS)',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  161:
  {
    AttributeCode: 161,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS ≥ 28% (MR/IS) & SOS ≥ 33.3% (MM/CVS)',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  162:
  {
    AttributeCode: 162,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS ≥ 28% (MR/IS) & SOS ≥ 33.3% (MM/CVS)',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  163:
  {
    AttributeCode: 163,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS ≥ 28% (MR/IS) & SOS ≥ 33.3% (MM/CVS)',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  164:
  {
    AttributeCode: 164,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOD ≥ 39.4%',
    question: 'Thị phần trưng bày >=39.4%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  165:
  {
    AttributeCode: 165,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOD ≥ 39.4%',
    question: 'Thị phần trưng bày >=39.4%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  166:
  {
    AttributeCode: 166,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOD ≥ 39.4%',
    question: 'Thị phần trưng bày >=39.4%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  167:
  {
    AttributeCode: 167,
    Weightage: '30',
    Target: '30',
    PE: 'SBD',
    Description: 'Do we have Golden River Executed from top to bottom shelf. Store >1 bay 1.2m have minim 4 facings',
    question: 'Trên quầy kệ có trưng bày Golden River (Dòng Sông Vàng Dầu Xả 3MM?) ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  168:
  {
    AttributeCode: 168,
    Weightage: '30',
    Target: '30',
    PE: 'SBD',
    Description: 'Do we have Golden River Executed from top to bottom shelf. Store >1 bay 1.2m have minim 4 facings',
    question: 'Trên quầy kệ có trưng bày Golden River (Dòng Sông Vàng Dầu Xả 3MM?) ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  169:
  {
    AttributeCode: 169,
    Weightage: '30',
    Target: '30',
    PE: 'SBD',
    Description: 'Do we have Golden River Executed from top to bottom shelf. Store >1 bay 1.2m have minim 4 facings',
    question: 'Trên quầy kệ có trưng bày Golden River (Dòng Sông Vàng Dầu Xả 3MM?) ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  170:
  {
    AttributeCode: 170,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Pantene, H&S and Rejoice Avalanche installation in-store',
    question: 'Siêu thị có lắp đặt frame có đèn của PNT, H&S và Rejoice không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  171:
  {
    AttributeCode: 171,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Pantene, H&S and Rejoice Avalanche installation in-store',
    question: 'Siêu thị có lắp đặt frame có đèn của PNT, H&S và Rejoice không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  172:
  {
    AttributeCode: 172,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Pantene, H&S and Rejoice Avalanche installation in-store',
    question: 'Siêu thị có lắp đặt frame có đèn của PNT, H&S và Rejoice không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  173:
  {
    AttributeCode: 173,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >= 95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  174:
  {
    AttributeCode: 174,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >= 95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  175:
  {
    AttributeCode: 175,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >= 95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  176:
  {
    AttributeCode: 176,
    Weightage: '50',
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >= 95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  177:
  {
    AttributeCode: 177,
    Weightage: 100,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >= 95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  178:
  {
    AttributeCode: 178,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do Pampers have FSD (across pack-count)?',
    question: 'Siêu thị có phân phối đầy đủ các size từ M -> XL không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  179:
  {
    AttributeCode: 179,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do Pampers have FSD (across pack-count)?',
    question: 'Siêu thị có phân phối đầy đủ các size từ M -> XL không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  180:
  {
    AttributeCode: 180,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do Pampers have FSD (across pack-count)?',
    question: 'Siêu thị có phân phối đầy đủ các size từ M -> XL không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  181:
  {
    AttributeCode: 181,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Pampers shelf brand block to follow premium pants, base pants?',
    question: 'Planogram Pampers có sắp xếp theo cùng nhãn hiệu Pampers, rồi chia theo Tả quần cao cấp => Tả dán - Tả quần thông dụng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  182:
  {
    AttributeCode: 182,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Pampers shelf brand block to follow premium pants, base pants?',
    question: 'Planogram Pampers có sắp xếp theo cùng nhãn hiệu Pampers, rồi chia theo Tả quần cao cấp => Tả dán - Tả quần thông dụng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  183:
  {
    AttributeCode: 183,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Pampers shelf brand block to follow premium pants, base pants?',
    question: 'Planogram Pampers có sắp xếp theo cùng nhãn hiệu Pampers, rồi chia theo Tả quần cao cấp => Tả dán - Tả quần thông dụng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  184:
  {
    AttributeCode: 184,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Pampers S/M (Tape/Pant) shelf at eye level?',
    question: 'Tả quần Pampers size S/M có được trưng bày trên kệ ngang tầm mắt của khách hàng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  185:
  {
    AttributeCode: 185,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Pampers S/M (Tape/Pant) shelf at eye level?',
    question: 'Tả quần Pampers size S/M có được trưng bày trên kệ ngang tầm mắt của khách hàng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  186:
  {
    AttributeCode: 186,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Pampers S/M (Tape/Pant) shelf at eye level?',
    question: 'Tả quần Pampers size S/M có được trưng bày trên kệ ngang tầm mắt của khách hàng không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  187:
  {
    AttributeCode: 187,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have Touch & Feel sample at shelf?',
    question: 'Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  188:
  {
    AttributeCode: 188,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have Touch & Feel sample at shelf?',
    question: 'Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  189:
  {
    AttributeCode: 189,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have Touch & Feel sample at shelf?',
    question: 'Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  190:
  {
    AttributeCode: 190,
    Weightage: '50',
    Target: '50',
    PE: 'SBD',
    Description: 'Do we have Touch & Feel sample at shelf?',
    question: 'Trên kệ có mẫu thử để khách hàng sờ thử và cảm nhận không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  191:
  {
    AttributeCode: 191,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have claim on shelf (shelf talker, shelf frame)?',
    question: 'Trên quầy kệ chính có thông tin nhãn hiệu không? (shelf talker hoặc khung frame)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  192:
  {
    AttributeCode: 192,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have claim on shelf (shelf talker, shelf frame)?',
    question: 'Trên quầy kệ chính có thông tin nhãn hiệu không? (shelf talker hoặc khung frame)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  193:
  {
    AttributeCode: 193,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have claim on shelf (shelf talker, shelf frame)?',
    question: 'Trên quầy kệ chính có thông tin nhãn hiệu không? (shelf talker hoặc khung frame)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  194:
  {
    AttributeCode: 194,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Baby solutions center?',
    question: 'Siêu thị có lắp đặt trung tâm Chăm sóc trẻ em (Baby solution center) không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  195:
  {
    AttributeCode: 195,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Baby solutions center?',
    question: 'Siêu thị có lắp đặt trung tâm Chăm sóc trẻ em (Baby solution center) không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  196:
  {
    AttributeCode: 196,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Baby solutions center?',
    question: 'Siêu thị có lắp đặt trung tâm Chăm sóc trẻ em (Baby solution center) không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  197:
  {
    AttributeCode: 197,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >=95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  198:
  {
    AttributeCode: 198,
    Weightage: 20,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >=95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  199:
  {
    AttributeCode: 199,
    Weightage: 25,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >=95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  200:
  {
    AttributeCode: 200,
    Weightage: 25,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >=95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  201:
  {
    AttributeCode: 201,
    Weightage: 25,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >=95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  202:
  {
    AttributeCode: 202,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette open for sales without store assistant?',
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  203:
  {
    AttributeCode: 203,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette open for sales without store assistant?',
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  204:
  {
    AttributeCode: 204,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette open for sales without store assistant?',
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  205:
  {
    AttributeCode: 205,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette open for sales without store assistant?',
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  206:
  {
    AttributeCode: 206,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette open for sales without store assistant?',
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  207:
  {
    AttributeCode: 207,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 60%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  208:
  {
    AttributeCode: 208,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'SOS >= 60%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  209:
  {
    AttributeCode: 209,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS >= 60%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  210:
  {
    AttributeCode: 210,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS >= 60%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  211:
  {
    AttributeCode: 211,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS >= 60%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  212:
  {
    AttributeCode: 212,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette have multilocation display (target 1 display)? ',
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  213:
  {
    AttributeCode: 213,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette have multilocation display (target 1 display)? ',
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  214:
  {
    AttributeCode: 214,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette have multilocation display (target 1 display)? ',
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  215:
  {
    AttributeCode: 215,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette have multilocation display (target 1 display)? ',
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  216:
  {
    AttributeCode: 216,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette have multilocation display (target 1 display)? ',
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  217:
  {
    AttributeCode: 217,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette have at least 1 display at the check-count counter',
    question: 'Cửa hàng có trưng bày tại Quầy Cashier hay không? (chỉ áp dụng cho MM/Lotte/Emart/Giant/BigC)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  218:
  {
    AttributeCode: 218,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette have at least 1 display at the check-count counter',
    question: 'Cửa hàng có trưng bày tại Quầy Cashier hay không? (chỉ áp dụng cho MM/Lotte/Emart/Giant/BigC)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  219:
  {
    AttributeCode: 219,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Does Gillette have at least 1 display at the check-count counter',
    question: 'Cửa hàng có trưng bày tại Quầy Cashier hay không? (chỉ áp dụng cho MM/Lotte/Emart/Giant/BigC)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  220:
  {
    AttributeCode: 220,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Touch & Learn bar on shelf?',
    question: 'Cửa hàng có thanh thông tin sản phẩm (Mach 3 & ProGlide) và hàng mẫu thử không?  ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  221:
  {
    AttributeCode: 221,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Touch & Learn bar on shelf?',
    question: 'Cửa hàng có thanh thông tin sản phẩm (Mach 3 & ProGlide) và hàng mẫu thử không?  ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  222:
  {
    AttributeCode: 222,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Touch & Learn bar on shelf?',
    question: 'Cửa hàng có thanh thông tin sản phẩm (Mach 3 & ProGlide) và hàng mẫu thử không?  ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  223:
  {
    AttributeCode: 223,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Gillette brading on Men Zone shelf?',
    question: 'Có lắp đặt Gillette PMU không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  224:
  {
    AttributeCode: 224,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Gillette brading on Men Zone shelf?',
    question: 'Có lắp đặt Gillette PMU không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  225:
  {
    AttributeCode: 225,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Do we have Gillette brading on Men Zone shelf?',
    question: 'Có lắp đặt Gillette PMU không?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  226: {
    AttributeCode: 226,
    Weightage: 25,
    Target: 95,
    PE: 'PSKU',
    Description: 'P sku ditribution >=95%',
    question: 'Phân phối sản phẩm chủ lực (P sku) = 95%',
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  227: {
    AttributeCode: 227,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'Does Gillette open for sales without store assistant?',
    question: 'Gillette có được trưng bày bán mà không đưa vào tủ khóa lại?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  228: {
    AttributeCode: 228,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOS >= 60%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  229: {
    AttributeCode: 229,
    Weightage: 25,
    Target: 20,
    PE: 'SBD',
    Description: 'Does Gillette have multilocation display (target 1 display)? ',
    question: 'Cửa hàng có trưng bày ngoài quầy kệ hay không? ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  230: {
    AttributeCode: 230,
    Weightage: 0,
    Target: 0,
    PE: 'SBD',
    Description: 'Does Gillette have at least 1 display at the check-count counter',
    question: 'Cửa hàng có trưng bày tại Quầy Cashier hay không? (chỉ áp dụng cho MM/Lotte/Emart/Giant/BigC)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  // HM/CCC/SM/IS
  231: {
    AttributeCode: 231,
    Weightage: 15,
    Target: 15,
    PE: 'SBD',
    Description: 'Do we have core collection on display: Pantene Hair Fall Control/3MM/Silky Smooth Care, H&S Ultra Men Cool Methol/Cool Methol/Itchy Scapl Care/Lemon Fresh, Rejoice Perfum Smooth/Rich',
    question: 'Trưng bày ngoài quầy kệ có đủ các variant chủ lực không? Pantene Ngăn Rụng/3 Phút Diệu Kỳ/Mượt Mà Óng Ả, H&S Ultra Men Bạc Hà/H&S Bạc Hà/ Da Đầu ngứa/Hương Chanh; Rejoice Hoa Mẫu Đơn/Siêu Mượt',
    answerType: SURVEY_ANSWER_TYPE.NUMBER
  },
  // HM/CCC/SM/IS
  232: {
    AttributeCode: 232,
    Weightage: 15,
    Target: 15,
    PE: 'SBD',
    Description: 'Do we have core collection on display: Pantene Hair Fall Control/3MM/Silky Smooth Care, H&S Ultra Men Cool Methol/Cool Methol/Itchy Scapl Care/Lemon Fresh, Rejoice Perfum Smooth/Rich',
    question: 'Trưng bày ngoài quầy kệ có đủ các variant chủ lực không? Pantene Ngăn Rụng/3 Phút Diệu Kỳ/Mượt Mà Óng Ả, H&S Ultra Men Bạc Hà/H&S Bạc Hà/ Da Đầu ngứa/Hương Chanh; Rejoice Hoa Mẫu Đơn/Siêu Mượt',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  // all
  233: {
    AttributeCode: 233,
    Weightage: 30,
    Target: 30,
    PE: 'SBD',
    Description: 'SOS ≥ 31%',
    question: 'Thị phần quầy kệ',
    answerType: SURVEY_ANSWER_TYPE.SOS
  },
  // alll
  234: {
    AttributeCode: 234,
    Weightage: 25,
    Target: 25,
    PE: 'SBD',
    Description: 'SOD ≥ 40%',
    question: 'Thị phần trưng bày >= 40%',
    answerType: SURVEY_ANSWER_TYPE.SOD
  },
  // HM CCC SM IS
  235: {
    AttributeCode: 235,
    Weightage: 10,
    Target: 10,
    PE: 'SBD',
    Description: 'Do we have Golden River Executed from top to bottom shelf. Store >1 bay 1.2m have minim 4 facings',
    question: 'Trên quầy kệ có trưng bày Golden River (Dòng Sông Vàng Dầu Xả 3MM?)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  // ALL
  236: {
    AttributeCode: 236,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Do we have horizontal variant shelving from small to big, varian order follow planogram',
    question: 'Quầy kệ có trưng bày theo hàng ngang: từ size bé đến size lớn & các variant theo planogram của siêu thị.',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  // MM cvs
  237: {
    AttributeCode: 237,
    Weightage: 15,
    Target: 15,
    PE: 'SBD',
    Description: '2X Facing for Core SKU: PTN HFC 170g/H&S CM 170g/RJ Rich 170g',
    // question: 'Gấp đôi số mặt cho các SKU chính: Pantene Ngăn Rụng Tóc 170g/ H&S Bạc Hà 170g/Rejoice Siêu mượt 170g',
    question: 'Dầu gội & Dầu Xả cùng nhãn hàng nằm cạnh nhau ở vị trí ngang tầm mắt (Pantene, Rejoice)',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  // MM CVS
  238: {
    AttributeCode: 238,
    Weightage: 10,
    Target: 10,
    PE: 'SBD',
    Description: '3MM in the middle of Pantene Shampoo ',
    question: 'Dầu Xà Pantene 3 Phút ở giữa Dầu Gội Pantene ',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  239: {
    AttributeCode: 239,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Is Ariel Liquid scent tester available at eye-level?',
    question: 'Mẫu thử Ariel có được đặt ở tầm mắt (mâm 2 - 3 cho quầy kệ 5 tầng & mâm 1-2 cho quầy kệ 4 tầng)?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  240: {
    AttributeCode: 240,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Is Ariel Liquid scent tester available at eye-level?',
    question: 'Mẫu thử Ariel có được đặt ở tầm mắt (mâm 2 - 3 cho quầy kệ 5 tầng & mâm 1-2 cho quầy kệ 4 tầng)?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  241: {
    AttributeCode: 241,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Is Ariel Liquid scent tester available at eye-level?',
    question: 'Mẫu thử Ariel có được đặt ở tầm mắt (mâm 2 - 3 cho quầy kệ 5 tầng & mâm 1-2 cho quầy kệ 4 tầng)?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },

  242: {
    AttributeCode: 242,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Is Downy liquid scent tester available at eye-level?',
    question: 'Mẫu thử Downy có được đặt ở tầm mắt (mâm 2 - 3 cho quầy kệ 5 tầng & mâm 1-2 cho quầy kệ 4 tầng)?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  243: {
    AttributeCode: 243,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Is Downy liquid scent tester available at eye-level?',
    question: 'Mẫu thử Downy có được đặt ở tầm mắt (mâm 2 - 3 cho quầy kệ 5 tầng & mâm 1-2 cho quầy kệ 4 tầng)?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  244: {
    AttributeCode: 244,
    Weightage: 20,
    Target: 20,
    PE: 'SBD',
    Description: 'Is Downy liquid scent tester available at eye-level?',
    question: 'Mẫu thử Downy có được đặt ở tầm mắt (mâm 2 - 3 cho quầy kệ 5 tầng & mâm 1-2 cho quầy kệ 4 tầng)?',
    answerType: SURVEY_ANSWER_TYPE.BOOLEAN
  },
  245: {
    AttributeCode: 245,
    Weightage: 30,
    Target: 30,
    PE: 'SBD',
    Description: 'SOD ≥ 40%',
    question: 'Thị phần trưng bày >= 40%',
    answerType: SURVEY_ANSWER_TYPE.NUMBER
  }

};
