const TARGET_SITE_HOST = 'http://localhost:8082'
const MAIN_SITE_HOST = 'http://localhost:8081'

let lastStorageData = '{}'

var requestStorageData = function (e) { 
    window.parent? window.parent.postMessage({
        type: 'SYNC_LOCALSTORAGE_GET',
      }, MAIN_SITE_HOST) : null 
};

var onStorageChange = function (e) { 
    lastStorageData = e
    window.parent? window.parent.postMessage({
        type: 'SYNC_LOCALSTORAGE_DATA_UPDATE',
        data: e
      }, MAIN_SITE_HOST) : null 
};

const setStorageData = (data) => {
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            localStorage.setItem(key, data[key]);
        }
     }
}

const aggregatedStorageData = () => {
    data = {}
    for (var i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i)
        data[key] = localStorage.getItem(key)
    }
    return data
}

const init = () => {
    window.addEventListener(
        'message',
        e => {
            if (e.origin === MAIN_SITE_HOST) {
                switch (e.data.type) {
                    case "SYNC_LOCALSTORAGE_GET":
                        console.log('SYNC_LOCALSTORAGE_GET: Received data')
                        if (e.data.data) {
                            setStorageData(JSON.parse(e.data.data))
                        }
                        break;
                    default:
                        break;
                }
            } else {
                onOriginDomainError(e.origin)
            }
        }
    )

    requestStorageData()
    // TODO: Optimize and only fire when an element is changed
    // For now triggered every 500 ms
    setInterval(() => {
        const newData = JSON.stringify(aggregatedStorageData())
        lastStorageData !== newData ? onStorageChange(newData) : null
    }, 500)    
}

init()
