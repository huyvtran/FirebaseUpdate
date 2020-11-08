import AppConfig from "../config/AppConfig";
import _ from 'lodash'

const _toRadians = number => number * Math.PI / 180;

const _calculateGreatCircleDistance = (locationA, locationZ) => {
    const lat1 = locationA.latitude;
    const lon1 = locationA.longitude;
    const lat2 = locationZ.latitude;
    const lon2 = locationZ.longitude;

    // DOCUMENTATION: http://www.movable-type.co.uk/scripts/latlong.html
    const p1 = _toRadians(lat1);
    const p2 = _toRadians(lat2);
    const deltagamma = _toRadians(lon2 - lon1);
    const R = 6371e3; // gives d in metres
    const d =
        Math.acos(
            Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltagamma)
        ) * R;

    return isNaN(d) ? 0 : d;
}


const kalman = (location, lastLocation, constant) => {
    const accuracy = Math.max(location.accuracy, 1);
    const result = { ...location, ...lastLocation };

    if (!lastLocation) {
        result.variance = accuracy * accuracy;
    } else {
        const timestampInc =
            location.time.getTime() - lastLocation.time.getTime();

        if (timestampInc > 0) {
            // We can tune the velocity and particularly the coefficient at the end
            const velocity =
                _calculateGreatCircleDistance(location, lastLocation) /
                timestampInc *
                constant;
            result.variance += timestampInc * velocity * velocity / 1000;
        }

        const k = result.variance / (result.variance + accuracy * accuracy);
        result.latitude += k * (location.latitude - lastLocation.latitude);
        result.longitude += k * (location.longitude - lastLocation.longitude);
        result.variance = (1 - k) * result.variance;
    }

    return {
        ...location,
        ..._.pick(result, ["latitude", "longitude", "variance"])
    };
};

let lastLocation;
const runKalmanOnLocations = (rawData, kalmanConstant = 1000) => rawData
    .map(location => ({
        ...location,
        time: new Date(location.time)
    }))
    .map(location => {
        lastLocation = kalman(
            location,
            lastLocation,
            kalmanConstant
        );
        return lastLocation;
    });

const getStaticImageMap = (latlng) => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latlng}&zoom=12&markers=color:blue%7Clabel:V%7C${latlng}&size=400x400&key=${AppConfig.GOOGLE_API_KEY}`
}

export default { runKalmanOnLocations, _calculateGreatCircleDistance, getStaticImageMap }
