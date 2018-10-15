self.addEventListener('push', event => {
    const data = event.data.json()
    console.log('Got push', data)

    event.waitUntil(
        self.registration.showNotification(data.title || data.notification.title, data.notification)
    )
})
