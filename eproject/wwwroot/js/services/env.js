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
    ]
}
export { env }