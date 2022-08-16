import { google } from "googleapis";
const playintegrity = google.playintegrity('v1');


const packageName = process.env.PACKAGE_NAME
// const privatekey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)


async function getTokenResponse(token) {
    
    console.log(token)

//     let jwtClient = new google.auth.JWT(
//         privatekey.client_email,
//         null,
//         privatekey.private_key,
//         ['https://www.googleapis.com/auth/playintegrity']);
    
    const googleAuth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/playintegrity'],
        });

    google.options({ auth: googleAuth });

    const res = await playintegrity.v1.decodeIntegrityToken(
        {
            packageName: packageName,
            requestBody:{
                "integrityToken": token
            }
        }

    );


    console.log(res.data.tokenPayloadExternal);

    return res.data.tokenPayloadExternal
}

module.exports = async (req, res) => {

    const { token = 'none' } = req.query

    if (token == 'none') {
        res.status(400).send({ 'error': 'No token provided' })
        return
    }

    getTokenResponse(token)
        .then(data => {
            res.status(200).send(data)
            return
        })
        .catch(e => {
            console.log(e)
            res.status(400).send({ 'error': 'Google API error. Google said: ' + e.message })
            return
        });
}
