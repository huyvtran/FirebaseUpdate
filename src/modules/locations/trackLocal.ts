import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import _ from 'lodash';
import FirebaseDatabaseManager from '../../firebase/FirebaseDatabaseManager';
import API from '../../network/API';
import store from '../../store/store';
import MapUtils from '../../utils/MapUtils';
import PermissionUtils from '../../utils/PermissionUtils';
import TrackLocationManager from './TrackLocationManager';

const selectOrg = state => state.org.orgSelectIds;
const INTERVAL_KARMAL = 3;

let coords = [];
let locationLoop = [];
let org = [];
let shipmentId = ''
let routeId = '';

const startTrackLocation = (routeIdParams, shipmentIdParams) => {
  BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 20,
    notificationTitle: 'Abivin background tracking',
    notificationText: 'enabled',
    debug: false,
    startOnBoot: false,
    stopOnTerminate: false,
    locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
    pauseLocationUpdates: false,
    interval: 5000,
    fastestInterval: 1000,
    activitiesInterval: 1000,
    stopOnStillActivity: false,
    activityType: 'AutomotiveNavigation',
    // url: URL_TRACKING,
    httpHeaders: {
      'Content-Type': 'application/json'
    },
    // customize post properties
    postTemplate: {
      locations: {},

    }
  });
  const storeState = store.getState();

  org = selectOrg(storeState);

  console.log('BackgroundGeolocation startTrackLocation:  ', shipmentIdParams);

  shipmentId = shipmentIdParams
  routeId = routeIdParams

  BackgroundGeolocation.on('location', (location) => {
    // handle your locations here
    // to perform long running operation on iOS
    // you need to create background task

    const mapLocation = { ...location, speed: location.speed ? location.speed * 3.6 : 0 };
    locationLoop.push(mapLocation)

    console.log('BackgroundGeolocation location change:  ', locationLoop.length);

    if (locationLoop.length >= INTERVAL_KARMAL) {

      const distance = MapUtils._calculateGreatCircleDistance(locationLoop[0], locationLoop[2])

      console.log("ABIVIN_TRACK: Distance in one karma location list" + distance)
      const karmaLocation = MapUtils.runKalmanOnLocations(locationLoop)
      // const karmaLocation = locationLoop
      if (karmaLocation && karmaLocation.length > 0) {
        locationLoop = [];
        BackgroundGeolocation.startTask(taskKey => {
          // execute long running task
          // eg. ajax post location
          // IMPORTANT: task has to be ended by endTask

          coords = coords.concat(karmaLocation);
          updateLocationToServer(taskKey)

        });
      }
    }

  });

  BackgroundGeolocation.on('stationary', (stationaryLocation) => {
    // handle stationary locations here
    // Actions.sendLocation(stationaryLocation);
  });

  BackgroundGeolocation.on('error', (error) => {
    console.log('[ERROR] BackgroundGeolocation error:', error);
  });

  BackgroundGeolocation.on('start', () => {
    console.log('[INFO] BackgroundGeolocation service has been started');
  });

  BackgroundGeolocation.on('stop', () => {
    console.log('[INFO] BackgroundGeolocation service has been stopped');
  });

  BackgroundGeolocation.on('background', () => {
    console.log('[INFO] App is in background');
    // stopTrackLocation();
    // startTrackLocation(true);
    BackgroundGeolocation.switchMode(BackgroundGeolocation.BACKGROUND_MODE);
  });

  BackgroundGeolocation.on('foreground', () => {
    console.log('[INFO] App is in foreground');
    // stopTrackLocation();
    // startTrackLocation(false);
    BackgroundGeolocation.switchMode(BackgroundGeolocation.FOREGROUND_MODE);
  });

  BackgroundGeolocation.on('abort_requested', () => {
    console.log('[INFO] Server responded with 285 Updates Not Required');

    // Here we can decide whether we want stop the updates or not.
    // If you've configured the server to return 285, then it means the server does not require further update.
    // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
    // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
  });

  BackgroundGeolocation.on('http_authorization', () => {
    console.log('[INFO] App needs to authorize the http requests');
  });

  BackgroundGeolocation.checkStatus(status => {
    console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

    // you don't need to check status before start (this is just the example)
    if (!status.isRunning) {
      BackgroundGeolocation.start(); //triggers start on start event
    }
  });
}

const updateLocationToServer = (taskKey) => {


  const bodyParams = {
    organizationId: org,
    locations: coords,
    shipmentId,
    routeId,
    timestamp: (new Date()).getTime(),
    isGPSStopped: false,
    isIOS: true,

  }

  if (!_.isEmpty(shipmentId)) {
    FirebaseDatabaseManager.trackShipmentLocation(shipmentId, bodyParams)
  }

  if (!_.isEmpty(routeId)) {
    FirebaseDatabaseManager.trackRouteLocation(routeId, bodyParams)
  }
  console.log('BackgroundGeolocation bodyParams:', bodyParams);
  API.pushLocation({
    organizationId: org,
    locations: coords,
    shipmentId,
    routeId
  }).then(res => {
    if (res.data && res.data == 'OK') {
      console.log('BackgroundGeolocation location upload success:', res);
      coords = [];
      BackgroundGeolocation.endTask(taskKey);
    }

  }).catch(err => {
    console.log(err)
    console.log('BackgroundGeolocation location upload fail:', coords.length);
  })
}

export const calculateSnapLocation = (locations) => {
  let snapParams = '';
  _.forEach(locations, (location, index) => {
    if (index === 0) {
      snapParams = location.latitude + ',' + location.longitude;
    } else {
      snapParams += '|' + location.latitude + ',' + location.longitude;
    }
  })
  return snapParams
}

const stopTrackLocation = () => {
  BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
};


const setCurrentPosition = () => {
  PermissionUtils.checkLocationPermission().then(res => {
    if (res === PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
      setGeoCurrentLocation()
    }
  })

};

const getCurrentLocationFromStore = () => {
  return store.getState().trackLocation && store.getState().trackLocation.data ? store.getState().trackLocation.data : { latitude: null, longitude: null }
}

const setGeoCurrentLocation = (enableHighAccuracy = true) => {
  TrackLocationManager.getCurrentLocation((position) => {

  }, (error) => {
    setGeoCurrentLocation(false)
  }, enableHighAccuracy)

}



export {
  startTrackLocation,
  setCurrentPosition,
  stopTrackLocation,
  setGeoCurrentLocation,
  getCurrentLocationFromStore,
};

