var sqlite3 = require('sqlite3').verbose();

function connect_db() {
    var connection;
    connection = new sqlite3.Database('./db/base_test.db', (err) => {
        if (err) {
            console.error(err.message);
            connection = null;
        }
        console.log('Conectado base_test.');
    });
    validate_db(connection)
    return connection;
}

function validate_db(connection) {

    if (connection != null) {
        console.log("seriales database")
        connection.serialize(() => {
            connection.run("CREATE TABLE IF NOT EXISTS productos ( `cod_pro` TEXT, `nom_pro` TEXT, `mar_pro` TEXT,`pre_pro` REAL,`iva_pro` REAL, PRIMARY KEY(`cod_pro`) )");
        }, (err) => {
            if (err) {
                console.log("db serialize error: ", err)
            } else {
                console.log("db serialize good")
            }
        })

    }

}

module.exports.connect_db = connect_db;