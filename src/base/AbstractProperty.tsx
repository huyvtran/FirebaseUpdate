export interface INavigationAction {
    goBack(params?);
    openDrawer();
    navigate(name:string, params?:object);
    replace(name:string, params?:object);
    getParam(key:string, defaultValue?:object|string);
    dispatch(action);

    /**
     *  subscribe to updates to navigation lifecycle
     * onWillFocus - event listener
        onDidFocus - event listener
        onWillBlur - event listener
        onDidBlur - event listener
     * @param lis 
     */
    addListener(event:NavigationListener, action:Function);

    removeListener(event:NavigationListener, action:Function);

    /** trạng thái */
    state;

    popToTop();
}

export enum NavigationListener{
    willFocus = "willFocus",
    didFocus  = "didFocus",
    willBlur = "willBlur",
    didBlur = "didBlur",
}

export enum NavigationKey{
    PARAMS = "PARAMS"
}

interface AbstractProps {
    locale?:any;
}

interface AbstractStates {

}

export { AbstractProps, AbstractStates };
