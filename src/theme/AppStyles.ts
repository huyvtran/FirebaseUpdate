import { Platform } from 'react-native';
import AppColors from './AppColors';
import AppFonts from './AppFonts';
import AppSizes from './AppSizes';

const appStylesBase = {
    // Give me padding
    cellContainer: {
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingMedium,
    },
    shadow: {
        shadowColor: AppColors.darkgray,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    padding: {
        paddingVertical: AppSizes.padding,
        paddingHorizontal: AppSizes.padding,
    },
    paddingHorizontal: {
        paddingHorizontal: AppSizes.padding,
    },
    paddingLeft: {
        paddingLeft: AppSizes.padding,
    },
    paddingRight: {
        paddingRight: AppSizes.padding,
    },
    paddingVertical: {
        paddingVertical: AppSizes.padding,
    },
    paddingTop: {
        paddingTop: AppSizes.padding,
    },
    paddingBottom: {
        paddingBottom: AppSizes.padding,
    },
    paddingSml: {
        paddingVertical: AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingSml,
    },
    paddingHorizontalSml: {
        paddingHorizontal: AppSizes.paddingSml,
    },
    paddingLeftSml: {
        paddingLeft: AppSizes.paddingSml,
    },
    paddingRightSml: {
        paddingRight: AppSizes.paddingSml,
    },
    paddingVerticalSml: {
        paddingVertical: AppSizes.paddingSml,
    },
    paddingTopSml: {
        paddingTop: AppSizes.paddingSml,
    },
    paddingBottomSml: {
        paddingBottom: AppSizes.paddingSml,
    },
    // Give me margin
    margin: {
        // margin: AppSizes.margin,
    },
    marginHorizontal: {
        // marginLeft: AppSizes.margin,
        // marginRight: AppSizes.margin,
    },
    marginLeft: {
        // marginLeft: AppSizes.margin,
    },
    marginRight: {
        // marginRight: AppSizes.margin,
    },
    marginVertical: {
        // marginTop: AppSizes.margin,
        // marginBottom: AppSizes.margin,
    },
    marginTop: {
        // marginTop: AppSizes.margin,
    },
    marginBottom: {
        // marginBottom: AppSizes.margin,
    },
    marginSml: {
        // margin: AppSizes.marginSml,
    },
    marginHorizontalSml: {
        // marginLeft: AppSizes.marginSml,
        // marginRight: AppSizes.marginSml,
    },
    marginLeftSml: {
        // marginLeft: AppSizes.marginSml,
    },
    marginRightSml: {
        // marginRight: AppSizes.marginSml,
    },
    marginVerticalSml: {
        // marginTop: AppSizes.marginSml,
        // marginBottom: AppSizes.marginSml,
    },
    marginTopSml: {
        // marginTop: AppSizes.marginSml,
    },
    marginBottomSml: {
        // marginBottom: AppSizes.marginSml,
    },
    borderBase: {
        borderColor: AppColors.border,
        // borderWidth: AppSizes.borderWidth,
        // borderRadius: AppSizes.borderRadius,
    },
};

export default {
    titleTabBarContainer: {
        fontFamily: AppFonts.base.family,

        justifyContent: 'center',
        alignItems: 'center',
        height: AppSizes.paddingXMedium * 2.5,
        flex: 1,
        zIndex: 0,
        paddingTop: 0

    },
    titleTabBar: {
        fontFamily: AppFonts.base.family,

        fontSize: AppSizes.fontBase,
        fontWeight: '500' as 'bold',
        color: 'white',
        zIndex: 0,
        marginTop: 0,
        marginBottom: AppSizes.paddingSml
    },
    indicatorTabBar: {
        backgroundColor: AppColors.orange,
        height: AppSizes.paddingXTiny
    },
    // navbar: {
    //     backgroundColor: AppColors.navbar.background,
    //     borderBottomWidth: 0,
    //     shadowColor: AppColors.border,
    //     elevation: 1,
    //     zIndex: 1,
    //     paddingTop: 8,
    //     paddingBottom: 8
    // },

    ...appStylesBase,
    appContainer: {
        backgroundColor: '#fff',
        height: '100%',
    },
    // Default
    container: {
        position: 'relative',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: AppColors.background,
    },
    borderedCardContainer: {
        backgroundColor: AppColors.cardBackground,
        margin: 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: AppColors.border,
        shadowColor: AppColors.border,
        elevation: 1,
    },
    borderlessCardContainer: {
        backgroundColor: AppColors.cardBackground,
        margin: 2,
        borderRadius: 5,
        shadowColor: AppColors.border,
        elevation: 1,
    },
    containerCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    windowSize: {
        height: AppSizes.screenHeight,
        width: AppSizes.screenWidth,
    },
    // Aligning items
    leftAligned: {
        alignItems: 'flex-start',
    },
    centerAligned: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightAligned: {
        alignItems: 'flex-end',
    },
    // Text Styles
    regularText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size,
        color: AppColors.textPrimary,
        fontWeight: '100' as 'bold'
    },

    boldItalicText: {
        fontFamily: AppFonts.boldItalic.family,
        fontSize: AppFonts.base.size,
        lineHeight: AppFonts.base.lineHeight,
        color: AppColors.textPrimary,
    },

    italicText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size,
        lineHeight: AppFonts.base.lineHeight,
        color: AppColors.textPrimary,
        fontStyle: 'italic'
    },
    semiboldText: {
        fontFamily: AppFonts.semibold.family,
        fontSize: AppFonts.semibold.size,
        lineHeight: AppFonts.semibold.lineHeight,
        color: AppColors.textPrimary,
    },

    boldText: {
        fontFamily: AppFonts.bold.family,
        fontSize: AppFonts.bold.size,
        lineHeight: AppFonts.bold.lineHeight,
        color: AppColors.textPrimary,
    },

    hintText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size,
        lineHeight: AppFonts.base.lineHeight,
        color: AppColors.textSecondary,
    },

    secondaryText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size,
        lineHeight: AppFonts.base.lineHeight,
        color: AppColors.gray,
    },

    p: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size,
        lineHeight: AppFonts.base.lineHeight,
        color: AppColors.textPrimary,
    },
    h1: {
        fontFamily: AppFonts.h1.family,
        fontSize: AppFonts.h1.size,
        lineHeight: AppFonts.h1.lineHeight,
        color: AppColors.headingPrimary,
    },
    h2: {
        fontFamily: AppFonts.h2.family,
        fontSize: AppFonts.h2.size,
        lineHeight: AppFonts.h2.lineHeight,
        color: AppColors.headingPrimary,
    },
    h3: {
        fontFamily: AppFonts.h3.family,
        fontSize: AppFonts.h3.size,
        lineHeight: AppFonts.h3.lineHeight,
        color: AppColors.headingPrimary,
    },
    h4: {
        fontFamily: AppFonts.h4.family,
        fontSize: AppFonts.h4.size,
        lineHeight: AppFonts.h4.lineHeight,
        color: AppColors.headingPrimary,
    },
    h5: {
        fontFamily: AppFonts.h5.family,
        fontSize: AppFonts.h5.size,
        lineHeight: AppFonts.h5.lineHeight,
        color: AppColors.brand.secondary,
    },
    strong: {
        fontWeight: '900',
    },
    link: {
        textDecorationLine: 'underline',
        color: AppColors.brand.primary,
    },
    subText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size * 0.8,
        lineHeight: Math.floor(AppFonts.base.lineHeight * 0.8),
        color: AppColors.textSecondary,
    },
    subTextSemibold: {
        fontFamily: AppFonts.semibold.family,
        fontSize: AppFonts.semibold.size * 0.75,
        lineHeight: Math.floor(AppFonts.base.lineHeight * 0.75),
        color: AppColors.textSecondary,
    },
    tinyText: {
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.base.size * 0.55,
        lineHeight: Math.floor(AppFonts.base.lineHeight * 0.55),
        color: AppColors.textSecondary,
    },
    // Helper Text Styles
    textCenterAligned: {
        textAlign: 'center',
    },
    textRightAligned: {
        textAlign: 'right',
    },
    // General HTML-like Elements
    hr: {
        left: 0,
        right: 0,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        height: 1,
        backgroundColor: 'transparent',
        marginTop: AppSizes.padding,
        marginBottom: AppSizes.padding,
    },
    // Grid
    row: {
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    flex3: {
        flex: 3,
    },
    flex4: {
        flex: 4,
    },
    flex5: {
        flex: 5,
    },
    flex6: {
        flex: 6,
    },
    // Navbar
    navbar: {
        backgroundColor: AppColors.navbar.background,
        borderBottomWidth: 0,
        shadowColor: AppColors.border,
        elevation: 1,
        zIndex: 1,
    },
    //searchbar
    searchbar: {
        textInput: {
            fontFamily: AppFonts.base.family,
            // fontSize: AppSizes.fontSearch,
            color: AppColors.searchbar.textInput,
            flex: 1,
            paddingHorizontal: AppSizes.paddingXXSml,
        },

        searchContainer: {
            backgroundColor: AppColors.searchbar.background,
            flexDirection: 'row',
            alignItems: 'center',
            height: AppSizes.navbarHeight
        },

        searchContentContainer: {
            backgroundColor: AppColors.searchbar.backgroundText,
            flex: 1,
            // height: AppSizes.textInputHeight,
            // marginHorizontal: AppSizes.marginSml,
            // borderRadius: AppSizes.roundBorderRadius,
            flexDirection: 'row',
            alignItems: 'center',
        },

        searchIcon: {
            // marginLeft: AppSizes.marginSml,
            // width: AppSizes.imageSizeBase,
            // height: AppSizes.imageSizeBase,
        }
    },

    navbarTitle: {
        color: AppColors.textNavbar,
        fontFamily: AppFonts.base.family,
        fontSize: AppFonts.h3.size,
        fontWeight: '400' as 'bold',
    },
    navbarButton: {
        width: 20,
        height: 20,
    },
    checkIcon: {
        width: 20,
        height: 20,
    },
    // TabBar
    tabbar: {
        backgroundColor: AppColors.tabbar.background,
        borderTopColor: AppColors.border,
        borderTopWidth: 1,
    },
    topTabbar: {
        style: {
            backgroundColor: '#fff',
            ...Platform.select({
                ios: {
                    elevation: 1,
                    shadowColor: '#999',
                    shadowOpacity: 0.5,
                    shadowRadius: 0.5,
                    shadowOffset: {
                        height: 1,
                    },
                },
                android: {
                    elevation: 1,
                    shadowColor: '#333',
                    shadowOpacity: 0.1,
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                }
            }),
        },
        tabStyle: {
            width: 120,
        },
        indicatorStyle: {
            backgroundColor: AppColors.cerulean,
        },
        titleStyle: {
            fontFamily: AppFonts.bold.family,
            fontSize: AppFonts.h2.size,
            margin: 6,
        },
        colors: {
            activeColor: AppColors.cerulean,
            inactiveColor: AppColors.darkgray,
        }
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.divider,
    },
    dividerVertical: {
        width: 1,
        height: '100%',
        backgroundColor: AppColors.divider,
    },
    // More
    title: {},
    nextIcon: {},
    iconImage: {
        width: 20,
        height: 20,
    },
    item: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        padding: 3,
        borderTopColor: '#C9C9C9',
        borderTopWidth: 1,
        borderBottomColor: '#C9C9C9',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },
    viewColumn: {
        flex: 1,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    circleImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        ...appStylesBase.paddingHorizontalSml,
        ...appStylesBase.borderBase,
        // ...appStylesBase.baseText,
        // width: AppSizes.textInputWidth,
        // height: AppSizes.textInputHeight,
        backgroundColor: AppColors.white,
        fontSize: AppSizes.fontBase,
        color: AppColors.textPrimary,
    },
    fabButton: {
        position: 'absolute',
        bottom: 65,
        right: 20,
        width: 50,
        height: 50,
        justifyContent: 'center',
        shadowColor: AppColors.darkgray,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5
    },
    fabUploadingButton: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        width: 60,
        height: 60,
        justifyContent: 'center',
        elevation: 2,
        borderRadius: 30,
        shadowColor: AppColors.darkgray,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },

    buttonDone: {
        backgroundColor: '#00CC14',
        margin: AppSizes.paddingXSml,
        borderRadius: AppSizes.paddingXXSml,
        width: AppSizes.screenWidth - 2 * AppSizes.paddingXSml,
        height: 45
    },
    buttonText: {
        paddingVertical: AppSizes.paddingXXSml,
        paddingHorizontal: AppSizes.paddingMedium,
        // borderRadius: AppSizes.borderRadius,
    },
    textDone: {
        fontFamily: AppFonts.semibold.family,
        fontSize: 16,
        color: 'white'
    },
    textDoneDisable: {
        fontFamily: AppFonts.semibold.family,
        fontSize: 16,
        color: 'rgba(250, 250, 250, 0.5)',
    },
    fabIcon: {
        fontSize: 24,
        color: AppColors.gray,
    },
    noResult: {
        marginTop: AppSizes.paddingXXSml,
        marginBottom: AppSizes.paddingXXSml,
        fontFamily: AppFonts.base.family,
        fontSize: 15,
        color: '#A0ABBE',
        width: '80%',
        textAlign: 'center',
    },
    fullScreen: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ipXNavBarHeight: {
    //     height: 84
    // },
    // ipXNavBarTop: {
    //     top: 40,
    // },
    emptyView: {
        text: {
            fontFamily: AppFonts.base.family,
            fontSize: 15,
            color: '#A0ABBE',
            textAlign: 'center',
        },
        progress: {
            backgroundColor: 'transparent',
            margin: AppSizes.padding
        },
        error: {
            retry: {
                backgroundColor: 'transparent',
                alignSelf: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    },
    searchIcon: {
        // marginLeft: AppSizes.marginSml,
        width: 20,
        height: 20
    },

    authenticateInputContainer: {
        width: AppSizes.screenWidth - AppSizes.paddingXXLarge * 2,
        backgroundColor: 'white',
        paddingVertical: AppSizes.paddingLarge,
        paddingHorizontal: AppSizes.paddingXXLarge,
        borderRadius: AppSizes.paddingXSml,
        borderColor: AppColors.lightGrayTrans,
        borderWidth: AppSizes.paddingMicro,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: AppColors.gray,
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    }
};