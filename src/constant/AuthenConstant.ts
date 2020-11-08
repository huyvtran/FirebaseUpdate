import Messages from "./Messages";
import StringUtils from "../utils/StringUtils";

export default {
    LEVEL_PASSWORD_STRENGTH: [
        {
            key: Messages.containUppercase,
            content: Messages.containUppercase,
            checkPass: (text = "") => StringUtils.isContainUpperCaseLetter(text)
        },
        {
            key: Messages.containLowercase,
            content: Messages.containLowercase,
            checkPass: (text = "") => StringUtils.isContainLowerCaseLetter(text)

        },
        {
            key: Messages.containNumber,
            content: Messages.containNumber,
            checkPass: (text = "") => StringUtils.isContainDigit(text)
        },
        {
            key: Messages.containerSpecialLetter,
            content: Messages.containerSpecialLetter,
            checkPass: (text = "") => StringUtils.isContainNonWord(text)
        },
        {
            key: Messages.atLeast8Character,
            content: Messages.atLeast8Character,
            checkPass: (text = "") => StringUtils.isMoreThan8Char(text)
        },
    ]
}