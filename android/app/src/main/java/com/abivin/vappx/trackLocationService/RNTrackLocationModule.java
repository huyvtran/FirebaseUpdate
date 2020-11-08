package com.abivin.vappx.trackLocationService;

import android.Manifest;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;

import com.abivin.vappx.trackLocationService.model.TrackLocationConfig;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

public class RNTrackLocationModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private TrackLocationGoogleApiService locationService;

    private TrackLocationConfig trackConfig;
    private FusedLocationProviderClient mFusedLocationClient;
    private boolean isServiceConnected = false;

    public RNTrackLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(reactContext);

    }

    @Override
    public String getName() {
        return "RNTrackLocationService";
    }


    @ReactMethod
    public void startTrackLocation(String URL, String token, String organizationId, String shipmentId, String routeDetailId, String vehicleId, ReadableArray shipmentAssignedList) {

        ArrayList shipmentAssignedArrayList = new ArrayList<String>();
        for (int i = 0; i < shipmentAssignedList.size(); i++) {
            shipmentAssignedArrayList.add(shipmentAssignedList.getString(i));
        }

        trackConfig = new TrackLocationConfig(new ArrayList<String>(Arrays.asList(organizationId)), token, URL, shipmentId, routeDetailId, vehicleId, shipmentAssignedArrayList);

        Intent service = new Intent(reactContext.getApplicationContext(), TrackLocationGoogleApiService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(service);
        } else {
            reactContext.startService(service);

        }

//        if (locationService != null &&
//                locationService.getLocationParams() != null &&
//                ((locationService.getLocationParams().getShipmentId() != null &&
//                        !locationService.getLocationParams().getShipmentId().isEmpty() &&
//                        !shipmentId.isEmpty() &&
//                        !locationService.getLocationParams().getShipmentId().equals(shipmentId)) ||
//                        (locationService.getLocationParams().getRouteDetailId() != null &&
//                                !locationService.getLocationParams().getRouteDetailId().isEmpty() &&
//                                !routeDetailId.isEmpty() &&
//                                !locationService.getLocationParams().getRouteDetailId().equals(routeDetailId)
//                        ))
//        ) {
//            if (reactContext != null && serviceConnection != null && isServiceConnected)
//                reactContext.unbindService(serviceConnection);
//        }

        if(locationService != null && reactContext != null && serviceConnection != null && isServiceConnected){
//                reactContext.unbindService(serviceConnection);
            locationService.setLocationParams(trackConfig);
        }

        reactContext.bindService(service, serviceConnection, Context.BIND_AUTO_CREATE);
        isServiceConnected = true;

    }

    @ReactMethod
    public void stopTrackLocation() {
        if (locationService != null) {
            locationService.stopTracking();
        }

        if (isServiceConnected) {
            reactContext.unbindService(serviceConnection);
            isServiceConnected = false;
        }

    }

    @ReactMethod
    public void getLastLocation(final Callback onSuccessLocation, final Callback onErrorLocation) {
        if (ActivityCompat.checkSelfPermission(this.reactContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this.reactContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mFusedLocationClient.getLastLocation().addOnSuccessListener(new OnSuccessListener<Location>() {
            @Override
            public void onSuccess(Location location) {
                if (location != null) {
                    WritableMap mapLocation = Arguments.createMap();

                    WritableMap map = Arguments.createMap();

                    map.putDouble("latitude", location.getLatitude());
                    map.putDouble("longitude", location.getLongitude());
                    map.putDouble("altitude", location.getAltitude());
                    map.putDouble("altitude", new Double(location.getTime()));
                    map.putDouble("accuracy", new Double(location.getAccuracy()));
                    map.putDouble("speed", new Double(location.getSpeed()));

                    mapLocation.putMap("coords", map);
                    onSuccessLocation.invoke(mapLocation);
                } else {
                    WritableMap errorMap = Arguments.createMap();
                    errorMap.putInt("code", 1);
                    errorMap.putString("message", "Location not detected");
                    onErrorLocation.invoke(errorMap);
                }

            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                WritableMap errorMap = Arguments.createMap();
                errorMap.putString("message", e.getMessage());
                onErrorLocation.invoke(errorMap);
            }
        });
    }


    private ServiceConnection serviceConnection = new ServiceConnection() {

        public void onServiceConnected(ComponentName className, IBinder service) {
            String name = className.getClassName();
            if (name.endsWith("TrackLocationGoogleApiService")) {
                locationService = ((TrackLocationGoogleApiService.LocationGoogleApiServiceBinder) service).getService();
                locationService.setLocationParams(trackConfig);
                locationService.startTracking();
            }
            isServiceConnected = true;
        }

        public void onServiceDisconnected(ComponentName className) {
            if (className.getClassName().equals("TrackLocationGoogleApiService")) {
                locationService = null;
            }

            isServiceConnected = false;
        }


    };
}
