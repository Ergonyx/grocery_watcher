const mysql = require('mysql');
require('dotenv').config()

let instance = null

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    console.log(`DB ${connection.state}`)
})

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService()
    }
    
    async addNew(params) {
        try {
            console.log(params)
            const alreadyExists = await new Promise ((resolve, reject) => {
                const query = `SELECT * FROM products WHERE barcode = ${params.barcode};`
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message))
                    resolve(results)
                })
            })
            console.log(alreadyExists)
            if (alreadyExists.length > 0) {
                return `Error: Product already exists with this barcode.`
            } else {
                const response = await new Promise((resolve, reject) => {
                    const query = `
                        INSERT INTO products(date_created,name,barcode)
                        VALUES('${params.date_created}','${params.name}',${params.barcode});
                    `
                    connection.query(query, (err, results) => {
                        if (err) reject(new Error(err.message))
                        resolve(results)
                    })
                })
                return response;
            }
        } catch (err) {console.log(err)}
    }
}

module.exports = DbService;