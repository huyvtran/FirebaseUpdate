/**
 * @author Nguyễn Đức Lực
 * @email lucnd.icloud@gmail.com
 * @desc [Được sử dụng để thiết kế theo mô hình mvvm]
 */

import * as React from "react";


export default class LifeComponent<
    P = {},
    S = {},
    SS = any
    > extends React.Component<P, S, SS> implements LifePresenter<P,S> {

    public mount: boolean;

    constructor(props) {
        super(props);
        this.mount = false;
    }

    componentDidMount() {
        this.mount = true;
    }

    componentWillUnmount() {
        this.mount = false;
    }

    protected setUnmount() {
        this.mount = false;
    }

    // setState<K extends keyof S>(
    //   state:
    //     | ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null)
    //     | (Pick<S, K> | S | null),
    //   callback?: () => void
    // ): void {
    //   super.setState(state, callback);
    // }

    public isMounted() {
        return this.mount;
    }

    getStates(): S {
        return this.state;
    }

    getProps(): P {
        return this.props;
    }

    setStates<K extends keyof S>(
        state:
            | ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null)
            | (Pick<S, K> | S | null),
        callback?: () => void
    ) {
        // console.log('Chung this.isMouted setState', this.isMouted, state);
        if (this.mount) {
            super.setState(state, callback);
        }
    }
}

export interface LifePresenter<P = {}, S = {}> {
    refs: {
        [key: string]: React.ReactInstance;
    };

    state:S;
    isMounted(): boolean;
    getStates() : S;
    getProps() : P;

    /** hàm này sẽ sử dụng isMount */
    setStates(obj:S, callback?: () => void);

    /** hàm này sẽ ko sử dụng isMount */
    setState(obj:S, callback?: () => void);
}