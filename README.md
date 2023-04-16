# Address Book
Este código es una aplicación para la creación de contactos en una libreta de direcciones utilizando diversas tecnologías como Axios para realizar peticiones HTTP a una API, SweetAlert para mostrar alertas al usuario, Bootstrap para estilos y DataTables para la visualización de los datos. También se encuentra comentado el uso de Pusher para la comunicación en tiempo real entre los usuarios de la aplicación.

# Instalación
1. Clonar el repositorio:
    git clone https://github.com/JhiannM/adress-book.git
2. Instalar las dependencias:
    ejecutando el siguiente comando: npm install
3. Iniciar la aplicacion:
    ejecutando el siguiente comando: npm start

# Librerías utilizadas
bootstrap: se utiliza para los estilos de la aplicación.
bootstrap-icons: se utiliza para incluir iconos en la interfaz de usuario.
axios: se utiliza para realizar peticiones HTTP a una API.
jquery: se utiliza para el manejo de eventos y el acceso al DOM.
datatables.net-dt: se utiliza para la visualización de los datos.
sweetalert2: se utiliza para mostrar alertas al usuario.
Funcionalidad
La aplicación realiza una petición HTTP a una API, utilizando Axios, para obtener los contactos guardados en el servidor. Estos contactos se guardan en el Local Storage del navegador para poder acceder a ellos posteriormente sin necesidad de hacer una petición HTTP cada vez que se necesiten.

Una vez cargados los datos, se utiliza DataTables para mostrarlos en una tabla. Además, se incluye la posibilidad de agregar nuevos contactos a través de un formulario.

Al agregar un nuevo contacto, se verifica si el contacto ya existe en el Local Storage. Si el contacto ya existe, se muestra una alerta al usuario y no se hace nada. Si el contacto no existe, se agrega a la API utilizando Axios y se actualiza el Local Storage.

# Comentarios adicionales
En el código se incluye el uso de Pusher para la comunicación en tiempo real entre los usuarios de la aplicación, pero se encuentra comentado debido a que se necesita configurar una cuenta de Pusher para utilizarlo. Si se desea utilizar esta funcionalidad, se debe descomentar el código y agregar las credenciales de la aplicación Pusher correspondiente.

# La estructura de directorios de la aplicación es la siguiente:

src: Contiene los archivos de código fuente de la aplicación.
components: Contiene los componentes de React utilizados en la aplicación.
services: Contiene el archivo para consumir la API utilizando Axios y almacenar los datos en localStorage.
websocket: Contiene el archivo para conectarse al WebSocket utilizando Pusher y escuchar los eventos.

# Estructura de direcctorios de la aplicacion 

address-book/
├── node_modules/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Contact.js
│   │   ├── ContactForm.js
│   │   ├── ContactList.js
│   │   └── WebSocket.js
│   ├── App.js
│   ├── index.js
│   └── serviceWorker.js
├── .gitignore
├── package.json
├── README.md
└── yarn.lock

# Los tipos de eventos recibidos por el WebSocket son los siguientes:

pusher:subscription_succeeded: Este evento se recibe cuando se ha suscrito correctamente a un canal de Pusher.
pusher:subscription_error: Este evento se recibe cuando ocurre un error al suscribirse a un canal de Pusher.
address-book: Este evento se recibe cuando se actualiza la libreta de direcciones en el servidor.
