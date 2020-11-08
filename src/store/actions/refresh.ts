export function refresh(types, timeUnix) {
    return {
        type: 'REFRESH',
        data: { types, timeUnix },
    }
}