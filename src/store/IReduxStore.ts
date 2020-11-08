export default interface IReduxStore {
    i18n: any, 
    org: any, 
    user: any, 
    device: any, 
    metadata: any,
    trackLocation:{data:{ latitude: number, longitude: number }}
}