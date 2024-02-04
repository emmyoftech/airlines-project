let env = {
    api_endpoint:"/Api/",

    panelPartials: "/lib/partialHtmlparts/panelpartials/",

    authPartials: "/lib/partialHtmlparts/authpartials",

    sharredPartials: "/lib/partialHtmlparts/sharedpartials",
    
    panelPartialsStyles: "/css/PanelStyling/",
    
    authPartialsStyles: "/css/AuthStyling/",
    
    sharedPartialsStyles: "/css/sharedStyling/",
    
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
            link: "planes",
            icon: {
                class: "fa-plane",
                type: "solid"
            }
        }
    ],
    userRoleLinks: [
        {
            link: "dashboard",
            icon: {
                class: "dashboard",
                type: "solid"
            }
        }
    ]
}
export { env }