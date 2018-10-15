const publicVapidKey = 'BD5Lq_OUjW6Z4ckNCrWDLq75fcT1Nxu3DFDO2cUsmC1PVoyrn9MMXUwoqyCe4F16c1DY_76grVu53UiQZefR0jA'
// Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet - see urlBase64ToUint8Array
const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey)

if ('serviceWorker' in navigator) {
    // Register a Service Worker.
    navigator.serviceWorker.register('service-worker.js')

    navigator.serviceWorker.ready
        .then(function(registration) {
        // Use the PushManager to get the user's subscription to the push service.
        return registration.pushManager.getSubscription()
            .then(async function(subscription) {
                
                if (subscription) { // If a subscription was found, return it.
                    return subscription
                }

                // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to send notifications that don't have a visible effect for the user).
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                })
            })
        })
        .then(function(subscription) {
            console.log('Endpoint URL: ', subscription.endpoint)
            triggerMessageButtonSetup(subscription)
        })
}


function triggerMessageButtonSetup(subscription) {
  document.getElementById('js-trigger-push-msg').onclick = function() {
    const delay = document.getElementById('notification-delay').value
    console.log(subscription)
    fetch("/sendNotification", {
      method: "POST",
      body: JSON.stringify(
        {
          subscription: subscription,
          delay: delay
        }
      ),
      headers: {
        "content-type": "application/json"
      }
    })
  }
}


// Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/")
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
}
