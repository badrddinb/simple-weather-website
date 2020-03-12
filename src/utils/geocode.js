const https = require('https')

const geocode = (address, callback) => {

    const req = https.request({
        headers: {
            'Content-Type': 'application/json'
        },
        host: 'api.mapbox.com',
        path: `/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoibHVmbyIsImEiOiJjazdmaXphNGIwMzRqM2xtODltamNrYzQwIn0.hM6PYt-1JdZ8qdwzN6mnag&limit=1`,
        method: 'GET'
    }, res => {
        let data = ''

        res.on('data', (chunk) => {
            data += chunk
        });

        res.on('end', () => {
            try {
                const {
                    features,
                    features: [{
                        center: [longitude, latitude],
                        place_name: location
                    }]
                } = JSON.parse(data)

                if (features.length === 0) {
                    callback('Error: Unable to find location! Try another search.', undefined)
                } else {
                    callback(undefined, {
                        latitude: latitude,
                        longitude: longitude,
                        location
                    })
                }
            } catch (error) {
                callback('Unable to find data!', undefined)
            }
        })
    });

    req.on('error', _ => {
        callback('Error: Unable to connect to location services! Try again.', undefined)
    });

    req.end();
}

module.exports = geocode