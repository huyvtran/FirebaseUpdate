import Axios from "axios"
import _ from 'lodash'

/*** *******************************************CLENT EVENT **********************************/

function clientDidConnect() {
}

function clientDidDisConnect() {

}
function clientDidFailWithError() {

}
function clientRequestAccessToken() {

}
function callIncomingCall() {

}
function onObjectChange() {

}

/*** *******************************************CALL EVENT **********************************/
function callDidChangeSignalingState() {

}
function callDidChangeMediaState() {

}
function callDidReceiveLocalStream() {

}
function callDidReceiveRemoteStream() {

}
function didReceiveDtmfDigit() {

}
function didReceiveCallInfo() {

}
function didHandleOnAnotherDevice() {

}
export default {
    stringeeClientRef: null,
    stringeeCallRef: null,

    clientEventHandlers: {
        onConnect: clientDidConnect,
        onDisConnect: clientDidDisConnect,
        onFailWithError: clientDidFailWithError,
        onRequestAccessToken: clientRequestAccessToken,
        onIncomingCall: callIncomingCall,
        onObjectChange: onObjectChange
    },

    callEventHandlers: {
        onChangeSignalingState: callDidChangeSignalingState,
        onChangeMediaState: callDidChangeMediaState,
        onReceiveLocalStream: callDidReceiveLocalStream,
        onReceiveRemoteStream: callDidReceiveRemoteStream,
        onReceiveDtmfDigit: didReceiveDtmfDigit,
        onReceiveCallInfo: didReceiveCallInfo,
        onHandleOnAnotherDevice: didHandleOnAnotherDevice
    },

    registerStringeeClient(stringeeClient) {
        this.stringeeClientRef = stringeeClient
    },

    registerStringeeCall(stringeeCall) {
        this.stringeeCallRef = stringeeCall
    },

    async clientConnect(userId) {
        if (_.isEmpty(userId) || !this.stringeeClientRef) {
            return
        }

        const token = await Axios.get(`https://us-central1-abivin-user-console.cloudfunctions.net/stringee/getToken?userId=${userId}`)
        await this.stringeeClientRef.connect(token.data);
    },

    clientDisConnect() {
        this.stringeeClientRef.disconnect();
    },

    makeCallAppToPhone(phoneNumber, callback) {
        if (!this.stringeeCallRef || _.isEmpty(phoneNumber)) {
            return
        }
        const callParam = {
            from: "842873030087",
            to: phoneNumber,
            isVideoCall: false,
            videoResolution: "NORMAL",
            customData: ""
        };
        const stringCallParams = JSON.stringify(callParam)
        this.stringeeCallRef.makeCall(stringCallParams, (status, code, message, customDataFromYourServer) => {
            callback && callback({ status, code, message, customDataFromYourServer })
        })
    },



}