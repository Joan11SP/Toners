const{ipcMain}=require('electron')
const { connect_db } = require('./db_sqlite')
var connection= connect_db();
//instancia de la conexion
function crud_db(){
//get_all_products
ipcMain.on('get_all_products',(event,arg)=>{
    connection.each("SELECT * FROM productos where estado=1",(err,rows)=>{
        if(err){
            console.log(err);
            throw err;            
        }else{
            event.reply('get_all_products_reply',rows)
        }
    });
})

//get_all_products
ipcMain.on('search_products',(event,search)=>{
    connection.each("SELECT * FROM productos where cod_pro='"+search.cod_pro+"'",(err,rows)=>{
        if(err){
            console.log(err);
            throw err;            
        }else{            
            event.reply('search_products_reply',rows)
        }
    });
})

//inserts in DataBase
ipcMain.on('insert_products', (event,varsave) => {
    connection.serialize(function () {
        var save = connection.prepare("INSERT OR IGNORE INTO productos(cod_pro,nom_pro, mar_pro,pre_pro,iva_pro) VALUES (?,?,?,?,?);", (err) => {
            if (err) {                
                event.reply('insert_products_reply','error conexion');
                console.log(err);
                throw err;
            }                              
            save.run(varsave.cod_pro,varsave.nom_pro,varsave.mar_pro,varsave.pre_pro,varsave.iva_pro); 
            save.finalize(); 
            event.reply('insert_products_reply');
        });
    });
});
//update products.
ipcMain.on('update_products', (event,var_update) => {
    connection.serialize(function () {
            var upd = connection.prepare("UPDATE productos set cod_pro=?,nom_pro=?,mar_pro=?, pre_pro=?,iva_pro=? where cod_pro='"+var_update.aux+"'", (err) => {
            if (err) {
                event.reply('update_products_reply','error conexion');
                console.log(err);
                throw err;
            }                                  
            upd.run(var_update.cod_pro,var_update.nom_pro,var_update.mar_pro,var_update.pre_pro,var_update.iva_pro); 
            upd.finalize();
            event.reply('update_products_reply','ping'); 
        });
    });
});

//delete products.
ipcMain.on('delete_products', (event,var_delete) => {
    connection.serialize(function () {
        var del = connection.prepare("UPDATE productos set estado=0 where cod_pro= ?", (err) => {
            if (err) {                
                event.reply('delete_products_reply','error conexion');
                console.log(err);
                throw err;
            }                                  
            del.run(var_delete.cod_pro); 
            del.finalize(); 
        });
    });
});
}
module.exports.crud_db = crud_db;
