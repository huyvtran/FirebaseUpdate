// Set initial state
const initialState = {
    
};

export default function devicing(state = initialState, action) {
    console.log("devicing action>>", action.type)
        

    switch (action.type) {
        case 'DEVICE_BUILD_NUMBER':
            return {
                ...state,
                deviceBuildNumber: action.data,
            }
        default:
            return state;
    }
}