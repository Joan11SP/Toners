const { app, BrowserWindow, ipcMain } = require('electron')
const { connect_db } = require('./db/db_sqlite')
const { login_vali } = require('./db/controller_login');
const { crud_db } = require('./db/controller_products');
//const { customers } = require('./db/controller_customers');

// Mantén una  global del objeto window, si no lo haces, la ventana 
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.

let connection
let win
let crud
//crea la ventana principal

function createLogin() {
    // Crea la ventana del navegador.
    win = new BrowserWindow({
        width: 300,
        height: 260,
        center: true,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    // win.loadURL(`file://${__dirname}/index.html`);
    win.loadURL(`file://${__dirname}/src/renderer/Login/index.html`);
    // win.loadFile('index.html')


    // Emitido cuando la ventana es cerrada.
    win.on('closed', () => {
        //borra instancia de base datos
        connection.close()
        connection = null
        // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
        // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
        // en el que deberías borrar el elemento correspondiente.
        win = null
    })
    //Instancia de la Base de Datos
    connection = connect_db();
    //login = login_vali();
    crud = crud_db();
  //  custom=customers()
}


// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
    // En macOS es común para las aplicaciones y sus barras de menú
    // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', function () {
    createLogin()
})

app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.    
    if (win === null) {
        createLogin()
    }
})

/*ipcMain.on('crear', (event, arg) => {
    if (login_vali()===true) {
        win.setBounds({ x: 0, y: 0, width: 1380, height: 750 })
        win.loadURL(`file://${__dirname}/src/renderer/navegador/index.html`);
    
        event.reply('crear_reply', 'ping')
    }
})*/

//validar Login
ipcMain.on('validation', (event, values) => {
    connection.serialize(function () {
        connection.each("SELECT cedula,contrasena FROM usuarios where tipo=1", (err, cols) => {
            if (err) {
                console.log(err);
                event.reply('validation_reply', 'error ');
                throw err;
            }
            else {
                if (cols.cedula === values.cedula && cols.contrasena === values.contrasena) {                
                    win.setResizable(true);                
                    win.center();
                    win.maximize()
                    win.loadURL(`file://${__dirname}/src/renderer/navegador/index.html`);
                }
                else {
                    console.log('Incorreto')
                    event.reply('validation_reply','error')
                }

            }
            
        });
    })
});

//cerrar ventana principal
ipcMain.on('closeWin', (event, arg) => {
    win.setMaximizable(false)
    win.setBounds({ x: 0, y: 0, width: 300, height: 260 })
    win.center();
    win.loadURL(`file://${__dirname}/src/renderer/Login/index.html`);
    event.reply('closeWin_reply');
})