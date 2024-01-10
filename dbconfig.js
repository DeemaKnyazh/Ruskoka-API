require('dotenv').config()

const config = {
    user : process.env.AZURE_SQL_USERNAME || process.env.USER,
    password: process.env.PASSWORD || process.env.AZURE_SQL_PASSWORD,
    server: process.env.SERVER || process.env.AZURE_SQL_SERVER,
    port: parseInt(process.env.PORT, 10) || parseInt(process.env.AZURE_SQL_PORT, 10),
    database: process.env.DATABASE || process.env.AZURE_SQL_DATABASE,
    options:{
        trustedconnection: true,
        trustservercertificate: false,
        enableArithAbort: true,
        encrypt: true
    },
    authentication: {
        type: 'default'
    }
}


module.exports = config;