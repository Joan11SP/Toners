const { ipcRenderer } = require("electron");
var webix = require("webix");

var aux;

var menu = {
  css: "webix_dark",
  view: "toolbar",
  elements: [
    {
      view: "icon",
      icon: 'mdi mdi-menu',
      click: function () {
        $$("desplegar").toggle();
      }
    },
    {
      view: "label", label: "Opciones"
    },
    //botones al hacer click ejecutan las funciones.
    {
      id: 'btnNuevo', view: 'button', icon: 'mdi mdi-table', label: 'Nuevo', autowidth: true,
      click: openForm
    },
    { id: 'btnEliminar', view: 'button', icon: 'mdi mdi-table', label: 'Eliminar', autowidth: true, click: del },
    { id: 'btnCerrarSesion', view: 'button', icon: 'mdi mdi-table', label: 'Cerrar Sesión', autowidth: true, click: closeWin }
  ]
}
var datos_producto = new webix.DataCollection({
  id: "datos_producto",
  scheme: {
    //Numeración de las columnas
    $init: function (obj) {
      obj.index = this.count();
    }
  }
})
var tabla = {
  view: "datatable",
  id: "datos_pro",
  select: true,
  columns: [
    {
      id: "index",
      header: "",
      sort: "int"
    },
    {
      id: 'cod_pro',
      header: ['Código del Producto', { content: "textFilter" }],
      editor: "text",
      fillspace: 2,
    },
    {
      id: 'nom_pro',
      header: 'nom_pro del Producto',
      editor: "text",
      fillspace: 2
    },
    {
      id: 'mar_pro',
      header: 'Marca del Producto',
      editor: "text",
      fillspace: 2
    }
  ],
  data: datos_producto,
}
var datos_cliente = new webix.DataCollection({
  id: "datos_cliente",
  data: [
    {
      ced_cli: "1150171534",
      nom_cli: "Joan Sebastian",
      apell_cli: "Peña Poma"
    }
  ],
  scheme: {
    //Numeración de las columnas
    $init: function (obj) {
      obj.index = this.count();
    }
  }
})
var tabla_cliente = {
  view: "datatable",
  id: "datos_cli",
  select: true,
  columns: [
    {
      id: "index",
      header: "",
      sort: "int"
    },
    {
      id: 'ced_cli',
      header: 'Cédula del Cliente',
      editor: "text",
      fillspace: 2
    },
    {
      id: 'nom_cli',
      header: 'nom_pro del Cliente',
      editor: "text",
      fillspace: 2
    },
    {
      id: 'apell_cli',
      header: 'Apellidos del CLiente',
      editor: "text",
      fillspace: 2
    }
  ],
  data: datos_cliente
}
//menu para mostrar las tablas.
var opcion_menu = {
  id: "opcion_m",
  data: [
    {
      id: 'id_pro', icon: 'mdi mdi-table', value: 'Producto'
    },
    {
      id: 'id_cli', icon: 'mdi mdi-table', value: 'Clientes'
    },
    {
      id: 'id_fac', icon: 'mdi mdi-table', value: 'Factura'
    }
  ]
};
var sidebar = {
  id: "desplegar",
  collapsed: true,
  view: "sidebar",
  data: opcion_menu,
  on: {
    onAfterSelect: function (id) {
      console.log(this.getItem(id).id)
      if (this.getItem(id).id === "id_cli") $$('datos_cli').show()
      if (this.getItem(id).id === "id_pro") $$('datos_pro').show()
    }
  }
};
function cargar_productos() {
  ipcRenderer.on('get_all_products_reply', (event, rows) => {
    datos_producto.parse(rows)
  });
  ipcRenderer.send('get_all_products', 'ping');

  ipcRenderer.on('get_all_clients_reply', (event, rows) => {
    datos_cliente.parse(rows)
  });
  ipcRenderer.send('get_all_clients', 'ping')
}
//me agrega un nuevo producto a la BDD.
function save_prodcuts() {
  //if ($$('datos_pro').isVisible()) {
  const save = $$("id_formPro").getValues();
  if ($$("id_formPro").validate()) {
    webix.confirm("Guardar nuevo producto ?", "confirm-warning").then(function () {
      ipcRenderer.on('insert_products_reply', (event, arg) => {
        webix.message('Guardado');
        $$("datos_producto").add(save);
        $$("id_formPro").clear();
      });
      ipcRenderer.on('insert_products_unsave', (event, arg) => {
      });
      webix.message({ type: "erro", text: "El código ya existe" });
      var varsave = {
        cod_pro: $$("newCod_pro").getValue(),
        nom_pro: $$("newNom_pro").getValue(),
        mar_pro: $$("newMar_pro").getValue(),
        pre_pro: $$("newPre_pro").getValue(),
        iva_pro: $$("newIva_pro").getValue(),
      }
      ipcRenderer.send('insert_products', varsave)
    })
  }
  else {
    webix.message({ type: "error", text: "Campos Vacios" });
  }
  /*}
  else {
    if ($$('datos_cli').isVisible()) {
      const save = $$("id_formPro_cli").getValues();
      if ($$("id_formPro_cli").validate()) {
        webix.confirm("Guardar nuevo cliente ?", "confirm-warning").then(function () {
          ipcRenderer.on('insert_clients_reply', (event, arg) => {
            webix.message('Guardado');
            $$("id_formPro_cli").clear();
          });
          var varsave = {
            ced_cli: $$("newCed_cli").getValue(),
            nom_cli: $$("newNom_cli").getValue(),
            apell_cli: $$("newApell_cli").getValue()
          }
          ipcRenderer.send('insert_clients', varsave)
          $$("datos_cliente").add(save);
        })
      }
      else {
        webix.message({ type: "error", text: "Campos Vacios" });
      }
    }
  }*/
}
//elimina un producto de la tabla de forma temporal
function del() {
  if ($$('datos_pro').isVisible()) {
    if (!$$("datos_pro").getSelectedId()) {
      webix.message("Producto no seleccionado");
      return;
    }
    webix.confirm("Eliminar producto seleccionado?", "confirm-warning").then(function () {
      ipcRenderer.on('delete_products_reply', (event, arg) => {
      });
      var var_delete = {
        cod_pro: $$("datos_pro").getSelectedItem().cod_pro
      }
      $$("datos_producto").remove($$("datos_pro").getSelectedId());
      ipcRenderer.send('delete_products', var_delete)
    });
  }
  else {
    if ($$('datos_cli').isVisible()) {
      if (!$$("datos_cli").getSelectedId()) {
        webix.message("Cliente no seleccionado");
        return;
      }
      webix.confirm("Eliminar cliente seleccionado?", "confirm-warning").then(function () {
        ipcRenderer.on('delete_clients_reply', (event, arg) => {
        });
        var var_delete = {
          id: $$("datos_cli").getSelectedItem().id
        }
        $$("datos_cliente").remove($$("datos_cli").getSelectedId());
        ipcRenderer.send('delete_clients', var_delete)
      });
    }
  }
}
//dos clicks abrir ventana de informacion de productos.
function openWin() {
  $$("datos_pro").attachEvent("onItemDblClick", function () {
    aux = $$("datos_pro").getSelectedItem().cod_pro;
    show_products().show();
    $$("btnGuardar").disable();
    ipcRenderer.on('search_products_reply', (event, rows) => {
      $$("datos_pro").clearSelection();
      $$("id_formPro").parse(rows)
    });
    var search = {
      cod_pro: $$("datos_pro").getSelectedItem().cod_pro
    }
    ipcRenderer.send('search_products', search)
  })
}
function upd() {
  if ($$('datos_pro').isVisible()) {
    webix.confirm("Actualizar producto seleccionado?", "confirm-warning").then(function () {
      ipcRenderer.on('update_products_reply', (event, arg) => {
        webix.message('Actualizado');
      });
      var var_update = {
        cod_pro: $$("newCod_pro").getValue(),
        nom_pro: $$("newNom_pro").getValue(),
        mar_pro: $$("newMar_pro").getValue(),
        pre_pro: $$("newPre_pro").getValue(),
        iva_pro: $$("newIva_pro").getValue(),
        aux
      }
      ipcRenderer.send('update_products', var_update)
    });
  } else {
    if ($$('datos_cli').isVisible()) {
      webix.confirm("Actualizar cliente seleccionado?", "confirm-warning").then(function () {
        ipcRenderer.on('update_clients_reply', (event, arg) => {
          console.log(arg)
          webix.message('Actualizado');
        });
        var var_update = {
          ced_cli: $$("datos_cli").getSelectedItem().ced_cli,
          nom_cli: $$("datos_cli").getSelectedItem().nom_cli,
          apell_cli: $$("datos_cli").getSelectedItem().apell_cli
        }
        ipcRenderer.send('update_clients', var_update)
      });
    }
  }
}
//cerrar la ventana principal
function closeWin() {
  webix.confirm("Esta seguro de Salir?", "confirm-warning").then(function () {
    ipcRenderer.on('closeWin_reply', (event, arg) => {
    });
    ipcRenderer.send('closeWin')
  })
}
//abrir las ventanas dependiendo de la tabla visible
function openForm() {
  if ($$('datos_pro').isVisible()) {
    show_products().show()
    $$("newCod_pro").focus()
    $$("btnActualizar").disable()
  } else {
    if ($$('datos_cli').isVisible()) {
      show_clients().show()
      $$("newCed_cli").focus()
    }
  }
}

webix.ready(function () {
  webix.ui({
    rows: [
      menu,
      {
        type: "space",
        cols: [
          sidebar,
          {
            id: "table_multiview",
            cells: [
              tabla,
              tabla_cliente
            ]
          }
        ]
      }
    ]
  })
  openWin();
  cargar_productos();
})
//form de productos
function show_products() {
  return webix.ui({
    view: 'window',
    id: "new_pro",
    head: 'Información completa del Producto',
    position: "center",
    modal: true,
    body: {
      //contenido que va dentro de la ventana.
      view: 'form',
      id: 'id_formPro',
      elements: [
        {
          id: 'newCod_pro',
          label: 'Código del Producto',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          view: 'text',
          name: "cod_pro",
        },
        {
          id: 'newNom_pro',
          view: 'text',
          label: 'Nombre del Producto',
          aling: "left",
          labelWidth: 150,
          width: 350,
          name: "nom_pro"
        },
        {
          id: 'newMar_pro',
          view: 'text',
          label: 'Marca del Producto',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          name: "mar_pro"
        },
        {
          id: 'newPre_pro',
          view: 'text',
          label: 'Precio',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          name: "pre_pro"
        },
        {
          id: 'newIva_pro',
          view: 'text',
          label: 'Iva',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          name: "iva_pro"
        },
        {
          id: "btnGuardar",
          view: "button",
          value: "Guardar",
          width: 150,
          align: "right",
          click: save_prodcuts
        },
        {
          id: "btnActualizar",
          view: "button",
          value: "Actualizar",
          width: 150,
          align: "right",
          click: upd
        },
        {
          id: "btnSalir",
          view: "button",
          value: "Salir",
          position: "right",
          align: "right",
          width: 150,
          click: function () { $$("new_pro").close() }
        },
      ],
      rules: {
        "cod_pro": webix.rules.isNotEmpty,
        "nom_pro": webix.rules.isNotEmpty
      }
    }
  })
}
//form de clientes
function show_clients() {
  return webix.ui({
    view: 'window',
    id: "new_cli",
    head: 'Nuevo Cliente',
    position: "center",
    modal: true,
    body: {
      //contenido que va dentro de la ventana.
      view: 'form',
      id: 'id_formPro_cli',
      elements: [
        {
          id: 'newCed_cli',
          label: 'Cedula del Cliente',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          view: 'text',
          name: "ced_cli"
        },
        {
          id: 'newNom_cli',
          view: 'text',
          label: 'Nombre del Cliente',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          name: "nom_cli"
        },
        {
          id: 'newApell_cli',
          view: 'text',
          label: 'Apellido del Cliente',
          labelPosition: "left",
          labelWidth: 150,
          width: 350,
          name: "apell_cli"
        },
        {
          id: "btnAceptar",
          view: "button",
          label: "Aceptar",
          align: "right",
          width: 150,
          click: save_prodcuts
        },
        {
          id: "btnSalir",
          view: "button",
          label: "Salir",
          align: "right",
          width: 100,
          click: function () { $$("new_cli").close() }
        }
      ],
      rules: {
        "ced_cli": webix.rules.isNotEmpty,
        "nom_cli": webix.rules.isNotEmpty
      },
      template: "#ced_cli# #nom_cli# #apell_cli#"
    }
  })
}


