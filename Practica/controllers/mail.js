const { sendEmail } = require('../utils/handleEmail')

const { matchedData } = require('express-validator')


const send = async (req, res) => {
    try {
        const info = matchedData(req)
        const data = await sendEmail(info)
        res.send(data)
    } catch (err) {
        //console.log(err)
        res.status(500).send(e)
    }
}


module.exports = send 
