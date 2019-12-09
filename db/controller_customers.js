/*const {ipcMain}=require('electron');
const { connect_db } = require('./db_sqlite');

var connection= connect_db();

function customers(){
    ipcMain.on('get_all_customers',(event,arg)=>{
        connection.each("SELECT * FROM cliente",(err,rows)=>{
            if(err){
                console.log(err);
                throw err;            
            }else{
                event.reply('get_all_customers_reply',rows)
            }
    })
    })
//inserts in DataBase
ipcMain.on('insert_clients', (event,varsave) => {
    connection.serialize(function () {
        var save = connection.prepare("INSERT OR IGNORE INTO cliente(ced_cli,nom_cli, apell_cli) VALUES (?,?,?);", (err) => {
            if (err) {
                console.log(err);
                throw err;
            }                                  
            save.run(varsave.ced_cli,varsave.nom_cli,varsave.apell_cli); 
            save.finalize(); 
            event.reply('insert_clients_reply',varsave);
        });
    });
});
//delete products.
ipcMain.on('delete_products', (event,var_delete) => {
    connection.serialize(function () {
        var del = connection.prepare("UPDATE productos set estado=0 WHERE id= ?", (err) => {
            if (err) {
                console.log(err);
                throw err;
            }                                  
            del.run(var_delete.id); 
            del.finalize(); 
            event.reply('delete_products_reply',var_delete);
        });
    });
}); 
//delete clients.
ipcMain.on('delete_clients', (event,var_delete) => {
    connection.serialize(function () {
        var del = connection.prepare("UPDATE productos set estado=0 WHERE id= ?", (err) => {
            if (err) {
                console.log(err);
                throw err;
            }                                  
            del.run(var_delete.id); 
            del.finalize(); 
            event.reply('delete_clients_reply',var_delete);
        });
    });
});
}
module.exports.customers=customers*/