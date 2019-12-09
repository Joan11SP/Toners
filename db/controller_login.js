/*const { ipcMain } = require('electron');
const { connect_db } = require('./db_sqlite');
var connection = connect_db();


function login_vali() {
    ipcMain.on('validation', (event, values) => {
        connection.serialize(function () {
            connection.each("SELECT cedula,contrasena FROM usuarios where tipo=1", (err, cols) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                else {
                    event.reply('validation_reply', values);
                }
                if (cols.cedula === values.cedula && cols.contrasena === values.contrasena) {
                    console.log("Correcto")
                    return true;
                }
                    else {
                        console.log('Incorreto')
                        return false;
                    }
            });
        })
    });
}
module.exports.login_vali = login_vali;*/