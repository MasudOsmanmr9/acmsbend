/**
 * https://www.npmjs.com/package/mssql
 */

/**
 * let sqlQuery = `Exec [dbo].[saveOrUpdate_Brand] @jsonString=N'${JSON.stringify(data)}'`;
 * let result = await database.putData(sqlQuery);
 */

const sql = require('mssql');

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
    }
}


async function getData(query) {
    try {
        await sql.connect(sqlConfig)
        const result = await sql.query(query);
        if (result.recordset && result.recordset.length > 0 && result.recordset[0].ErrorMessage) {
            return {
                Success: false,
                Message: result.recordset[0].ErrorMessage
            }
        }
        if (result.recordsets) {
            let data = result.recordsets[0];
            return {
                Success: true,
                Data: data
            }
        } else {
            return {
                Success: false,
                Message: result.output
            }
        }

    } catch (err) {
        return {
            Success: false,
            Message: err.message || err
        }
    }
}

async function putData(query, params) {
    try {
        //const request = pool.request()
        // request.input('createdby', sql.NVarChar, 'value')

        /* await sql.connect(sqlConfig)
        sql.query(query, (err, params) => {
            console.dir(result)
        }) */


        await sql.connect(sqlConfig)
        const result = await sql.query(query);
        if (result.recordset && result.recordset.length > 0 && result.recordset[0].ErrorMessage || result.rowsAffected[result.rowsAffected.length - 1] == 0) {
            return {
                Success: false,
                Message: result.recordset[0].ErrorMessage
            }
        }
        if (result.rowsAffected) {
            return {
                Success: true,
                Message: "successfully added"
            }
        } else {
            return {
                Success: false,
                Message: JSON.stringify(result)
            }
        }

    } catch (err) {
        return {
            Success: false,
            Message: err.message || err
        }
    }
}


module.exports = {
    getData,
    putData,
};