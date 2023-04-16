import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'datatables.net-dt'
import 'datatables.net-dt/css/jquery.dataTables.css'

import reportWebVitals from './reportWebVitals'
import Swal from 'sweetalert2'
import axios from 'axios'
import $ from 'jquery'
/* import Pusher from 'pusher'; */

// Inicializar el objeto Pusher con las credenciales de la aplicacion Pusher
/* const pusher = new Pusher({
  appId: '1585339',
  key: '44761fe626c5502f0c7e',
  secret: '01dc2cfb3113a835dd3f',
  cluster: 'us2',
  useTLS: true
}); */

/* // Escuchar el canal address-book
const channel = pusher.subscribe('address-book');

// Agregar un evento para recibir los datos del canal
channel.bind('nuevoContacto', function(data) {
  // data contiene la información del contacto que se ha agregado
  console.log(data);
  // Actualizar el DataTable con los datos del Local Storage
  const tablaContactos = $('#infoContactos').DataTable();
  tablaContactos.clear().rows.add(data).draw();
}); */


axios
  .get('https://618aac0d34b4f400177c480e.mockapi.io/api/v1/contactos')
  .then(response => {
    // Guardar los datos en el Local Storage
    localStorage.setItem('contactos', JSON.stringify(response.data))

    // Crear el DataTable con los datos obtenidos
    $('#infoContactos').DataTable({
      responsive: false,
      data: response.data,
      columns: [
        { data: 'id' },
        { data: 'nombre' },
        { data: 'apellido' },
        { data: 'direccion' },
        { data: 'telefono' },
        {
          data: 'id',
          render: function (data) {
            return crearBotones(data)
          }
        }
      ],
      language: {
        decimal: '',
        emptyTable: 'No hay información',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Registros',
        infoEmpty: 'Mostrando 0 to 0 of 0 Registros',
        infoFiltered: '(Filtrado de _MAX_ total Registros)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ Registros',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: 'Buscar:',
        zeroRecords: 'Sin resultados encontrados',
        paginate: {
          first: 'Primero',
          last: 'Ultimo',
          next: 'Siguiente',
          previous: 'Anterior'
        }
      }
    })
  })
  .catch(error => {
    console.log(error)
  })

// Evento para guardar un nuevo contacto
$('#saveContacto').on('click', function (event) {
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      var nombre = $('#validacionNombre').val()
      var apellido = $('#validacionApellido').val()
      var telefono = $('#validacionTelefono').val()
      var direccion = $('#validacionDireccion').val()
      agregarContacto(nombre, apellido, direccion, telefono)
    }
    form.classList.add('was-validated')
  })
})

// Función para agregar un contacto
function agregarContacto (nombre, apellido, telefono, direccion) {
  const nuevoContacto = { nombre, apellido, telefono, direccion }

  // Verificar si el contacto ya existe en el Local Storage
  const contactos = JSON.parse(localStorage.getItem('contactos')) || []
  const existeContacto = contactos.find(contacto => {
    return (
      contacto.nombre === nombre &&
      contacto.apellido === apellido &&
      contacto.telefono === telefono &&
      contacto.direccion === direccion
    )
  })

  if (existeContacto) {
    // Si el contacto ya existe, mostrar una alerta y no hacer nada
    Swal.fire({
      icon: 'warning',
      title: 'El contacto ya existe',
      showConfirmButton: false,
      timer: 1500
    })
    limpiarform()
    return
  }

  // Si el contacto no existe, agregarlo al API utilizando Axios
  axios
    .post(
      'https://618aac0d34b4f400177c480e.mockapi.io/api/v1/contactos',
      nuevoContacto
    )
    .then(response => {
      // Agregar el nuevo contacto al Local Storage
      contactos.push(response.data)
      localStorage.setItem('contactos', JSON.stringify(contactos))

      // Actualizar el DataTable con los datos del Local Storage
      const tablaContactos = $('#infoContactos').DataTable()
      tablaContactos.clear().rows.add(contactos).draw()

      // Limpiar el formulario y cerrar el modal
      $('.btn-close').trigger('click')
      $('#registroContacto')[0].reset()

      // Mostrar una alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'El contacto ha sido agregado',
        showConfirmButton: false,
        timer: 1500
      })
    })
    .catch(error => {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error',
        text: 'No se ha podido agregar el contacto',
        confirmButtonText: 'Ok'
      })
    })
}

// Evento para editar un contacto
$(document).on('click', '.editar', function () {
  const id = $(this).data('id')
  $('#newContact').trigger('click')
  // mostrar titulos
  $('#nuevoC').addClass('visually-hidden')
  $('#editarC').removeClass('visually-hidden')
  // mostrar botones
  $('#saveContacto').addClass('visually-hidden')
  $('#actContacto').removeClass('visually-hidden')

  // Obtener los datos del contacto seleccionado del Local Storage
  const contactos = JSON.parse(localStorage.getItem('contactos'))
  const contactoSeleccionado = contactos.find(c => c.id === id)

  // Cargar los datos del contacto en el formulario del modal
  $('#validacionNombre').val(contactoSeleccionado.nombre)
  $('#validacionApellido').val(contactoSeleccionado.apellido)
  $('#validacionTelefono').val(contactoSeleccionado.telefono)
  $('#validacionDireccion').val(contactoSeleccionado.direccion)

  // Agregar evento de click al botón de guardar cambios
  $('#actContacto').on('click', function () {
    // Obtener los datos del formulario
    const nombre = $('#validacionNombre').val()
    const apellido = $('#validacionApellido').val()
    const direccion = $('#validacionDireccion').val()
    const telefono = $('#validacionTelefono').val()

    // Crear objeto con los datos actualizados
    const contactoActualizado = { nombre, apellido, telefono, direccion }

    // Enviar solicitud PUT al API para actualizar el contacto
    axios
      .put(
        `https://618aac0d34b4f400177c480e.mockapi.io/api/v1/contactos/${id}`,
        contactoActualizado
      )
      .then(response => {
        // Actualizar el contacto en el Local Storage
        const contactos = JSON.parse(localStorage.getItem('contactos'))
        const contactoActualizado = response.data
        const indice = contactos.findIndex(c => c.id === id)
        contactos[indice] = contactoActualizado
        localStorage.setItem('contactos', JSON.stringify(contactos))

        // Actualizar la tabla de contactos
        const tablaContactos = $('#infoContactos').DataTable()
        tablaContactos.clear().rows.add(contactos).draw()

        // Cerrar el modal y mostrar una alerta de éxito
        $('.btn-close').trigger('click')
        $('#registroContacto')[0].reset()
        $('#newContact').trigger('click')
        $('#nuevoC').removeClass('visually-hidden')
        $('#editarC').addClass('visually-hidden')
        $('#saveContacto').removeClass('visually-hidden')
        $('#editarC').addClass('visually-hidden')
        Swal.fire({
          icon: 'success',
          title: 'El contacto ha sido actualizado',
          showConfirmButton: false,
          timer: 1500
        })
      })
      .catch(error => {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: 'No se ha podido actualizar el contacto',
          confirmButtonText: 'Ok'
        })
      })
  })
})

// Evento para eliminar un contacto (OK)
$(document).on('click', '.eliminar', function () {
  const id = $(this).data('id')

  Swal.fire({
    title: 'Estas seguro de eliminar el contacto?',
    text: 'Luego de eliminarlo no podra revertirlo!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminalo!'
  }).then(result => {
    if (result.isConfirmed) {
      axios
        .delete(
          `https://618aac0d34b4f400177c480e.mockapi.io/api/v1/contactos/${id}`
        )
        .then(() => {
          // Eliminar el contacto del Local Storage
          let contactos = JSON.parse(localStorage.getItem('contactos')) || []
          contactos = contactos.filter(contacto => contacto.id !== id)
          localStorage.setItem('contactos', JSON.stringify(contactos))

          // Eliminar el contacto de la tabla
          const tablaContactos = $('#infoContactos').DataTable()
          tablaContactos.row($(this).parents('tr')).remove().draw()

          // Mostrar la alerta de éxito
          Swal.fire({
            icon: 'success',
            title: 'Contacto eliminado exitosamente',
            showConfirmButton: false,
            timer: 1500
          })
        })
        .catch(error => {
          console.error(error)
        })
    }
  })
})

// Función para crear los botones de editar y eliminar
function crearBotones (id) {
  return `<button type="button" class="btn btn-warning me-2 editar" data-id="${id}"><i class="bi bi-pencil-square"></i> Editar</button>
          <button type="button" class="btn btn-danger eliminar" data-id="${id}"><i class="bi bi-trash"></i> Eliminar</button>`
}

function limpiarform () {
  $('#validacionNombre').val('')
  /* $('#validacionNombre').removeClass('needs-validation') */
  $('#validacionNombre').addClass('needs-validation')
  $('#validacionApellido').val('')
  $('#validacionTelefono').val('')
  $('#validacionDireccion').val('')
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
