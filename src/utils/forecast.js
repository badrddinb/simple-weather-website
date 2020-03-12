const https = require('https')

const forecast = (latitude, longitude, callback) => {

    const req = https.request({
        headers: {
            'Content-Type': 'application/json'
        },
        host: 'api.darksky.net',
        path: `/forecast/934f2b739e20f8e961d1f7515f4ed1a1/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}?units=si&lang=en`,
        method: 'GET'
    }, res => {
        let data = ''

        res.on('data', (chunk) => {
            data += chunk
        });

        res.on('end', () => {
            try {
                const {
                    error: bodyError,
                    daily: {
                        data: [{
                            summary
                        }]
                    },
                    currently: {
                        temperature,
                        precipProbability: rainProbability
                    }
                } = JSON.parse(data)
    
                if (bodyError) {
                    callback('Error: Unable to find coordinate! Try another search.', undefined)
                } else {
                    callback(undefined, `${summary} It is currently ${temperature} degress out. There is a ${rainProbability}% change of rain.`)
                }
            } catch (error) {
                callback('Unable to find data!', undefined)
            }
        })
    });

    req.on('error', _ => {
        callback('Error: Unable to connect to weather services! Try again.', undefined)
    });

    req.end();
}

module.exports = forecast