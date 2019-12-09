const { ipcRenderer } = require("electron")
var webix = require("webix");


function validation() {
  if ($$("id_form").validate()) {
    ipcRenderer.on('validation_reply', (event, arg) => {
      webix.message({
        type: "error", text: "Datos Incorrectos"
      });
    });
    var values = {
      cedula: $$("cedula").getValue(),
      contrasena: $$("contrasena").getValue()
    }
    ipcRenderer.send('validation', values)
  }
  else {
    webix.message({ type: "error", text: "Campos Vacios" });
  }
}
webix.ready(function () {
  webix.ui({
    //contenido que va dentro de la ventana.
    view: 'form',
    id: 'id_form',
    elements: [
      {
        id: 'cedula',
        label: 'Usuario',
        value: "1150171534",
        labelPosition: "top",
        view: 'text',
        name: "ced"
      },
      {
        id: 'contrasena',
        view: "text",
        type: "password",
        value: "1234",
        label: 'Contraseña',
        labelPosition: "top",
        name: "pass"
      },
      {
        id: "btnAceptar",
        view: "button",
        label: "Aceptar",
        click: validation
      }
    ],
    rules: {
      "ced": webix.rules.isNotEmpty,
      "pass": webix.rules.isNotEmpty
    }
  })
  $$("cedula").focus();
})