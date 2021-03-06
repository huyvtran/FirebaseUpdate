/**
 * cấu hình tổ chức
 * { configurations: 
       { dayOff: { inWeeks: [], inYears: [] },
         transportServices: 
          { '1_1': null,
            '1_2': null,
            '1_3': null,
            '2_1': null,
            '2_2': null,
            '2_3': null,
            '3_1': null,
            '3_2': null,
            '3_3': null },
         turn_on_two_step_verification: false,
         strongPassword: true,
         firstWeekDay: null,
         dateFormatConfig: null,
         dateFormat: null,
         workingDays: [],
         smsBrandName: null,
         preventReSubmit: false,
         preventUseInventory: false,
         telematics: false,
         erp_sync: true,
         allowSubmitOverTime: true,
         allowApproveOrder: true,
         preventSubmitOverTime: false,
         typeTransportation: null,
         typeWarehouse: null,
         typeShipment: null,
         deviceIdType: null,
         timeZoneOffset: '7',
         allowSendEmail: false,
         consolidatedOrder: false,
         supplierDepot: false,
         unlockOneVrpRoute: true,
         randomVehicleSeed: false,
         transportServiceBy: 'PRODUCT',
         oneDeviceSignInActivated: true,
         avoidUsingApp: false,
         use3DLoading: false,
         avoidCreatingTask: false,
         requireDriver: true,
         showCustomerOnOrder: false,
         enableRouteUnlock: true,
         showDriverOnRoute: false,
         hideNumberCollected: false,
         hidePartlyDelivery: false,
         allowCreateExtraTask: true,
         allowRedelivery: false,
         flexVehicleType: false,
         useFTP: false,
         oddevenPolicy: false,
         showDriverOnVehicle: false,
         longhaul: false,
         approveDepotOrderConfig: false,
         country: 'vi',
         currency: 'VND',
         oversizedGoodRestriction: false,
         orderCreatorPermission: [],
         orderCreationPermission: [] },
      coordinate: { latitude: 10.939841, longitude: 107.270417 },
      algoConfig: 
       { partnerCluster: false,
         useOrderPriority: false,
         maxClusterPerTrip: '2',
         splitDelivery: true,
         includeInactiveVehiclesOnSplitDelivery: false,
         openRoute: false,
         hardTimeWindows: false,
         clusteringByDistrict: false,
         useClustering: false,
         useServiceTime: false,
         useFamiliarity: true,
         limitBikeDistance: 50,
         limitBikeDistanceSegment: 100,
         limitBikeXdock: 10,
         limitWaitTime: 0.5,
         lunchTime: true,
         autoReduceDriver: false,
         startWorkingTime: 7,
         weightUnit: 7,
         volumeUnit: 0.007,
         selfLearnSortingTime: false,
         selfLearnServiceTime: false,
         selfLearnTraffic: false,
         unloadMinTime: 4,
         unloadMinWeight: 20,
         unloadMinVolume: 0.2,
         useVolume: false,
         minTime: '15',
         maxTime: '45',
         reDelivery: true,
         timeBalancing: false,
         useColdChain: false,
         useERP: false,
         useWMS: false,
         useReport: true,
         dynamicLoadingTime: false,
         travelTime: 0,
         loadingTimePerProduct: 0,
         splitRoute: false,
         clusteringType: 'AUTO',
         nearestNeighborSequence: false,
         vehiclePriorityType: 'SMALL_WEIGHT',
         extraCost1: 0,
         extraCost2: 0,
         extraDistanceLowerBound: 0,
         extraDistanceUpperBound: 0,
         discountRate: 0,
         discountRateBackhaul: 0,
         discountRadius: 0,
         discountRadiusBackhaul: 0,
         restrictedArea: [],
         limitNumberTrip: null,
         autoSplitBy: 'VOLUME_AND_WEIGHT' },
      discountConfig: 
       { isUseBranchConfig: true,
         extraCost1: 0,
         extraCost2: 0,
         extraDistanceLowerBound: 0,
         extraDistanceUpperBound: 0,
         discountRate: 0,
         discountRateBackhaul: 0,
         discountRadius: 0,
         discountRadiusBackhaul: 0 },
      organizationCode: 'LK',
      isDeleted: false,
      childIds: [ '5c34755faf9737c702c16536', '5ee8a11415761f44211fd27d' ],
      categoryIds: 
       [ { organizationCategoryCode: 'BRANCH',
           _id: '5afe91638fd3933328d0e335' } ],
      thirdpartycall: '0',
      openTime: '7:00',
      closeTime: '21:00',
      breakTime: '',
      streetAddress: 'Hàm Nghi, Bảo Vinh, Long Khánh, Đồng Nai',
      phoneNumber: '1111111111',
      depotType: 1,
      _id: '5c346d9c15957dc1022bbe84',
      organizationName: 'Branch LK',
      organizationDescription: ''
 */
export interface IOrgConfig {
    configurations: {
        dayOff: { inWeeks: any[], inYears: any[] },
        transportServices:
        {
            '1_1': any,
            '1_2': any,
            '1_3': any,
            '2_1': any,
            '2_2': any,
            '2_3': any,
            '3_1': any,
            '3_2': any,
            '3_3': any
        },
        turn_on_two_step_verification: boolean,
        strongPassword: boolean,
        firstWeekDay: any,
        dateFormatConfig: any,
        dateFormat: any,
        workingDays: any[],
        smsBrandName: any,
        preventReSubmit: boolean,
        preventUseInventory: boolean,
        telematics: boolean,
        erp_sync: boolean,
        allowSubmitOverTime: boolean,
        allowApproveOrder: boolean,
        preventSubmitOverTime: boolean,
        typeTransportation: any,
        typeWarehouse: any,
        typeShipment: any,
        deviceIdType: any,
        timeZoneOffset: string,
        allowSendEmail: boolean,
        consolidatedOrder: boolean,
        supplierDepot: boolean,
        unlockOneVrpRoute: boolean,
        randomVehicleSeed: boolean,
        transportServiceBy: string,
        oneDeviceSignInActivated: boolean,
        avoidUsingApp: boolean,
        use3DLoading: boolean,
        avoidCreatingTask: boolean,
        requireDriver: boolean,
        showCustomerOnOrder: boolean,
        enableRouteUnlock: boolean,
        showDriverOnRoute: boolean,
        hideNumberCollected: boolean,
        hidePartlyDelivery: boolean,
        allowCreateExtraTask: boolean,
        allowRedelivery: boolean,
        flexVehicleType: boolean,
        useFTP: boolean,
        oddevenPolicy: boolean,
        showDriverOnVehicle: boolean,
        /**
         * Trạng thái là mô hình PDP
         * True: là mô hình PDP, false: không phải mô hình PDP
         */
        longhaul: boolean,
        approveDepotOrderConfig: boolean,
        country: string,
        currency: string,
        oversizedGoodRestriction: boolean,
        orderCreatorPermission: any[],
        orderCreationPermission: any[]
    },
    coordinate: { latitude: number, longitude: number },
    algoConfig:
    {
        partnerCluster: boolean,
        useOrderPriority: boolean,
        maxClusterPerTrip: string,
        splitDelivery: boolean,
        includeInactiveVehiclesOnSplitDelivery: boolean,
        openRoute: boolean,
        hardTimeWindows: boolean,
        clusteringByDistrict: boolean,
        useClustering: boolean,
        useServiceTime: boolean,
        useFamiliarity: boolean,
        limitBikeDistance: number,
        limitBikeDistanceSegment: number,
        limitBikeXdock: number,
        limitWaitTime: number,
        lunchTime: boolean,
        autoReduceDriver: boolean,
        startWorkingTime: number,
        weightUnit: number,
        volumeUnit: number,
        selfLearnSortingTime: boolean,
        selfLearnServiceTime: boolean,
        selfLearnTraffic: boolean,
        unloadMinTime: number,
        unloadMinWeight: number,
        unloadMinVolume: number,
        useVolume: boolean,
        minTime: string,
        maxTime: string,
        reDelivery: boolean,
        timeBalancing: boolean,
        useColdChain: boolean,
        useERP: boolean,
        useWMS: boolean,
        useReport: boolean,
        dynamicLoadingTime: boolean,
        travelTime: number,
        loadingTimePerProduct: number,
        splitRoute: boolean,
        clusteringType: string,
        nearestNeighborSequence: boolean,
        vehiclePriorityType: string,
        extraCost1: number,
        extraCost2: number,
        extraDistanceLowerBound: number,
        extraDistanceUpperBound: number,
        discountRate: number,
        discountRateBackhaul: number,
        discountRadius: number,
        discountRadiusBackhaul: number,
        restrictedArea: any[],
        limitNumberTrip: any,
        autoSplitBy: string
    },
    discountConfig:
    {
        isUseBranchConfig: boolean,
        extraCost1: number,
        extraCost2: number,
        extraDistanceLowerBound: number,
        extraDistanceUpperBound: number,
        discountRate: number,
        discountRateBackhaul: number,
        discountRadius: number,
        discountRadiusBackhaul: number
    },
    organizationCode: string,
    isDeleted: boolean,
    childIds: string[],
    categoryIds:
    [{
        organizationCategoryCode: string,
        _id: string
    }],
    thirdpartycall: string,
    openTime: string,
    closeTime: string,
    breakTime: string,
    streetAddress: string,
    phoneNumber: string,
    depotType: 1,
    _id: string,
    organizationName: string,
    organizationDescription: string
}