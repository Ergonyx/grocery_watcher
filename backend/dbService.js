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
    // TODO: Implement API key check so I'm not doing a bunch of random shit.
    async addNew(params) {
        try {
            console.log(`
                +----------------------+
                |      Parameters      |
                +----------------------+
                `, params)
            const alreadyExists = await new Promise ((resolve, reject) => {
                const query = `SELECT * FROM products WHERE barcode = '${params.barcode}';`
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message))
                    resolve(results)
                })
            })
            // If the barcode exists in the system, add this entry to the products history.
            if (alreadyExists.length > 0) {
                const response = await new Promise((resolve, reject) => {
                    console.log(alreadyExists)
                    const query = `
                        INSERT INTO product_history(productid, barcode, price, unit_of_measure, unit_of_measure_type, pieces, parent_company)
                        VALUES(${alreadyExists[0].id},'${params.barcode}','${params.price}','${params.unit_of_measure}','${params.unit_of_measure_type}','${params.pieces}','${params.parent_company}');
                    `
                    connection.query(query, (err, results) => {
                        if (err) reject(new Error(err.message))
                        resolve(results)
                    })
                })
                return response
            // If it doesn't exist, add a new product.
            } else {
                const response = await new Promise((resolve, reject) => {
                    const query = `
                        INSERT INTO products(name, barcode, price, unit_of_measure, unit_of_measure_type, pieces, parent_company)
                        VALUES('${params.name}','${params.barcode}','${params.price}','${params.unit_of_measure}','${params.unit_of_measure_type}','${params.pieces}','${params.parent_company}');
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