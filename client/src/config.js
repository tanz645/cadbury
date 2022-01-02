
const config = {
    local_mob: {
        api: 'http://192.168.100.6:5000/api',       
        static_files: 'http://192.168.100.6:4000',
        domain: 'http://192.168.100.6:5000',
        hubspot: {
            portalId: "25023018",
            formId: "c1929aea-3230-44c9-940c-767fc42acd66"
        }
    },
    local: {
        api: 'http://localhost:5000/api',       
        static_files: 'http://localhost:4000',
        domain: 'http://localhost:5000',
        hubspot: {
            portalId: "25023018",
            formId: "c1929aea-3230-44c9-940c-767fc42acd66"
        }
    },
    dev:{
        api: 'https://snapapic.digital/api',       
        static_files: 'https://snapapic.digital/cad_files',
        domain: 'https://snapapic.digital',
        hubspot: {
            portalId: "25023018",
            formId: "c1929aea-3230-44c9-940c-767fc42acd66"
        }
    },
    prod:{
        api: '/api',       
        static_files: '/cad_files',
        domain: 'https://cadbury.cnygiftfromtheheart.com',
        hubspot: {
            portalId: "19533831",
            formId: "8c89f4f6-4682-4979-9308-ce73d40a1c53"
        }
    },
    staging:{
        api: 'https://cadbury.cnygiftfromtheheart.com/api',       
        static_files: 'https://cadbury.cnygiftfromtheheart.com/cad_files',
        domain: 'https://cadbury.cnygiftfromtheheart.com',
        hubspot: {
            portalId: "25023018",
            formId: "c1929aea-3230-44c9-940c-767fc42acd66"
        }
    }
    
}
const setConfig = () => {
    const common = {
        local_cache_name: 'cadbury_local_token' 
    }
    return {...config.prod, ...common}
}
export default setConfig()