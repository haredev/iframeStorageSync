const TARGET_SITE_HOST = 'http://localhost:8082'
const MAIN_SITE_HOST = 'http://localhost:8081'
const ALLOWED_HOSTS = [TARGET_SITE_HOST]
const IFRAME_ID = 'iframe_sync_id'

const sendIframeData = host => {
    const iframe = document.getElementById(IFRAME_ID)
    let iframeData = window.localStorage.getItem(`iframeData-${host}`)
    console.log('iframeSync: Sent sync data')
    iframe.contentWindow.postMessage({
            type: 'SYNC_LOCALSTORAGE_GET',
            data: iframeData
          }, TARGET_SITE_HOST);
}

const newIframeData = ({host, data}) => {
    window.localStorage.setItem(`iframeData-${host}`, data)
}

const onOriginDomainError = origin => 
alert(`Message coming from untrusted origin, change TARGET_SITE_HOST and MAIN_SITE_HOST in code.\n 
 Actual Origin: ${origin} \n
 Expecting: ${TARGET_SITE_HOST}
 `)

window.addEventListener(
    'message',
    e => {
        if (ALLOWED_HOSTS.indexOf(e.origin) > -1 && e.data.type !== undefined) {
            switch (e.data.type) {
                case "SYNC_LOCALSTORAGE_DATA_UPDATE":
                    console.log('iframeSync: Received data')
                    newIframeData({host: e.origin, data: e.data.data})
                    break;
                case "SYNC_LOCALSTORAGE_GET": 
                    console.log('iframeSync: Received sync request')
                    sendIframeData(e.origin)
                    break;
                default:
                    break;
            }
        } else {
            onOriginDomainError(e.origin)
        }
    }
)