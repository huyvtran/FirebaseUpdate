package com.abivin.vappx.trackLocationService.model;

import java.util.ArrayList;

public class TrackLocationConfig {
    private ArrayList<String> organizationId;
    private ArrayList<String> shipmentAssignedList;
    private String token;
    private String URL;
    private String shipmentId;
    private String routeDetailId;
    private String vehicleId;

    public TrackLocationConfig(ArrayList<String> organizationId, String token, String URL, String shimentId, String routeDetailId, String vehicleId, ArrayList<String> shipmentAssignedList) {
        this.organizationId = organizationId;
        this.token = token;
        this.URL = URL;
        this.shipmentId = shimentId;
        this.routeDetailId = routeDetailId;
        this.shipmentAssignedList = shipmentAssignedList;
        this.vehicleId = vehicleId;
    }

    public ArrayList<String> getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(ArrayList<String> organizationId) {
        this.organizationId = organizationId;
    }

    public String getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(String shipmentId) {
        this.shipmentId = shipmentId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    public String getRouteDetailId(){
        return routeDetailId;
    }

    public ArrayList<String> getShipmentAssignedList() {
        return shipmentAssignedList;
    }

    public void setShipmentAssignedList(ArrayList<String> shipmentAssignedList) {
        this.shipmentAssignedList = shipmentAssignedList;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }
}
