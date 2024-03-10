let env = {
    api_endpoint:"/Api/",

    panelPartials: "/lib/partialHtmlparts/panelpartials/",

    authPartials: "/lib/partialHtmlparts/authpartials/",

    sharedPartials: "/lib/partialHtmlparts/sharedpartials/",

    floatPartials: "/lib/partialHtmlparts/floatpartials/",
    
    panelPartialsStyles: "/css/PanelStyling/",
    
    authPartialsStyles: "/css/AuthStyling/",
    
    sharedPartialsStyles: "/css/sharedStyling/",

    floatPartialsStyles: "/css/FloatStyling/",

    defaultUserImage: "/lib/images/static/user.jpg",

    profileImageLoc: "/lib/images/profileImage/",
    
    links: {
        panel: '/Panel',
        home: '/'
    },
    
    adminRoleLinks: [
        {
            link: "dashboard",
            icon: {
                class: "fa-table-cells-large",
                type: "solid"
            }
        },
        {
            link: "airports",
            icon: {
                class: "fa-city",
                type: "solid"
            }
        },
        {
            link: "planes",
            icon: {
                class: "fa-plane",
                type: "solid"
            }
        },
        {
            link: "flights",
            icon: {
                class: "fa-plane-departure",
                type: "solid"
            }
        },
        {
            link: "bookings",
            icon: {
                class: "fa-book",
                type: "solid"
            }
        }
    ],
    userRoleLinks: [
        {
            link: "dashboard",
            icon: {
                class: "fa-table-cells-large",
                type: "solid"
            }
        }
    ],
    locations: [
        "abuja",
        "lagos",
        "osun",
        "akwa ibom",
        "kaduna",
        "kogi",
        "bauchi",
        "ogun",
        "borno",
        "calabar"
    ],
    years: [
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021
    ],
    planeStates: [
        "on stanby",
        "in flight",
        "unavailable"
    ],
    nairaSign: "₦"
}
export { env }