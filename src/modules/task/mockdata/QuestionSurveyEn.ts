
export const SURVEY_ANSWER_TYPE = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  SOS: 'SOS',
  SOD: 'SOD',
  PSKU: 'PSKU'
};

export const survey_attributes = {
  5: {
    question: "P sku ditribution >= 95%",
    answerType: SURVEY_ANSWER_TYPE.PSKU
  },
  6: {
    question: "SOS >= 28%",
    answerType: SURVEY_ANSWER_TYPE.SOS,
    baseValue: 28
  },
  7: {
    question: "SOD >= 40%",
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
    question: "Tả quần Pampers size S hoặc tả dán Pampers newborn/ Pampers newborn size S có được trưng bày trên kệ ngang tầm mắt của khách hàng không?",
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
    question: "Cửa hàng có thanh thông tin sản phẩm (Mach 3 & ProGlide) và hàng mẫu thử không?",
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
};
