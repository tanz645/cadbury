
const config = {
    local: {
        api: 'http://192.168.100.6:5000',       
        static_files: 'http://192.168.100.6:4000' 
    },
    dev:{
        api: 'https://165.232.169.146/api',       
        static_files: 'https://165.232.169.146/cad_files'
    }
    
}
const setConfig = () => {
    console.log(process.NODE_ENV)
    const common = {
        local_cache_name: 'cadbury_local_token' 
    }
    return {...config.prod, ...common}
}
export default setConfig()