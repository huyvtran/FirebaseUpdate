export interface IRead {
    data: IReadData
}

export interface IReadData {
    globalConfig: { notification: 'NO' },
    speciesProperty: { salesCode: null },
    username: 'lk0618d001',
    webConfigs: [],
    organizationIds:
    [{
        configurations:
        {
            dayOff: { inWeeks: [], inYears: [] },
            transportServices:
            {
                '1_1': null,
                '1_2': null,
                '1_3': null,
                '2_1': null,
                '2_2': null,
                '2_3': null,
                '3_1': null,
                '3_2': null,
                '3_3': null
            },
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
            allowSubmitOverTime: false,
            allowApproveOrder: false,
            preventSubmitOverTime: false,
            typeTransportation: null,
            typeWarehouse: null,
            typeShipment: null,
            deviceIdType: null,
            timeZoneOffset: '7',
            allowSendEmail: false,
            consolidatedOrder: false,
            supplierDepot: false,
            unlockOneVrpRoute: false,
            randomVehicleSeed: false,
            transportServiceBy: 'PRODUCT',
            oneDeviceSignInActivated: true,
            avoidUsingApp: false,
            use3DLoading: false,
            avoidCreatingTask: false,
            requireDriver: true,
            showCustomerOnOrder: false,
            enableRouteUnlock: false,
            showDriverOnRoute: false,
            hideNumberCollected: false,
            hidePartlyDelivery: false,
            allowCreateExtraTask: false,
            orderCreationPermission: []
        },
        algoConfig:
        {
            partnerCluster: false,
            useOrderPriority: false,
            maxClusterPerTrip: '2',
            splitDelivery: false,
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
            unloadMinTime: 1,
            unloadMinWeight: 100,
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
            clusteringType: null,
            nearestNeighborSequence: false,
            restrictedArea: [],
            limitNumberTrip: null,
            vehiclePriority: 'SMALL_VOLUME'
        },
        organizationCode: 'PSLKWH100',
        categoryIds:
        [{
            _id: '5afe91638fd3933328d0e336',
            organizationCategoryName: 'Depot'
        }],
        _id: '5c34755faf9737c702c16536',
        organizationName: 'Kho Long Khanh'
    }],
    roleIds:
    [{
        configurations: { orderApproval: { manageDepots: [] } },
        roleGroupCode: 'DELIVERER',
        organizationId: '5c34755faf9737c702c16536',
        _id: '5c35dfb6042af62a78880547',
        role: string
    }]
}