
const config = {
    local: {
        api: 'http://localhost:5000',        
    }
    
}
const setConfig = () => {
    const common = {
        local_cache_name: 'cadbury_local_token' 
    }
    return {...config.local, ...common}
}
export default setConfig()