import React, { useState, useEffect, } from 'react';
import { Keyboard } from 'react-native';
import DeviceUtil from '../../utils/DeviceUtil';
const useKeyBoardStatus = (initialValue) => {
    const [keyboardInfo, setKeyboardInfo] = useState({ isKeyboardShow: initialValue, heightKeyboard: 0 });
    useEffect(() => {
        let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => keyboardDidShow(e));
        let keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => keyboardDidHide());
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const keyboardDidShow = (e) => {
        const { isKeyboardShow, heightKeyboard } = keyboardInfo
        if (!isKeyboardShow || heightKeyboard === 0) {
            setKeyboardInfo({
                isKeyboardShow: true,
                heightKeyboard: e.endCoordinates.height + (DeviceUtil.hasNotch() ? 20 : 0)
            })
        }

    };

    const keyboardDidHide = () => {
        const { isKeyboardShow, heightKeyboard } = keyboardInfo
        if (isKeyboardShow || heightKeyboard !== 0) {
            setKeyboardInfo({
                isKeyboardShow: false,
                heightKeyboard: 0
            })
        }

    };
    return keyboardInfo;
};
export { useKeyBoardStatus };

