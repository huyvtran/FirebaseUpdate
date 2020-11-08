export function devicing(buildNumber) {
    return {
        type: 'DEVICE_BUILD_NUMBER',
        data: { buildNumber },
    }
}