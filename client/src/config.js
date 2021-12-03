
const config = {
    local: {
        api: 'http://192.168.100.6:5000',       
        static_files: 'http://192.168.100.6:4000' ,
        hubspot: {
            portalId: "25023018",
            formId: "c1929aea-3230-44c9-940c-767fc42acd66"
        }
    },
    dev:{
        api: 'https://snapapic.digital/api',       
        static_files: 'https://snapapic.digital/cad_files',
        hubspot: {
            portalId: "25023018",
            formId: "c1929aea-3230-44c9-940c-767fc42acd66"
        }
    }
    
}
const setConfig = () => {
    console.log(process.NODE_ENV)
    const common = {
        local_cache_name: 'cadbury_local_token' 
    }
    return {...config.dev, ...common}
}
export default setConfig()