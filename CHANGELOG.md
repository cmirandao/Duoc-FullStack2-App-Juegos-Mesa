### BITACORA DE CAMBIOS

### SEMANA 2: Interactividad, Bootstrap y Validaciones

- Framework CSS: Integración de Bootstrap 5 mediante CDN para mejorar la responsividad estructural del sitio. Se reemplazó la grilla manual de CSS por el sistema de grillas de Bootstrap (row, col-*).

- Navegación Responsiva: Refactorización del <nav> manual hacia el componente Navbar de Bootstrap. Se implementó un menú colapsable (tipo hamburguesa) para dispositivos móviles.

- Formulario de Registro: Creación de una nueva sección con un formulario completo para nuevos usuarios, aplicando estilos nativos de Bootstrap.

- Validaciones JavaScript: Desarrollo de lógica en JS para validar el formulario del lado del cliente:

    - Uso de Expresiones Regulares (Regex) para validar formato de correo electrónico y contraseñas seguras (6-18 caracteres, mínimo 1 mayúscula y 1 número).

    - Lógica de cálculo de fechas para asegurar edad mínima de 13 años.

- Manipulación del DOM: Implementación de feedback visual dinámico usando las clases is-valid e is-invalid, y muestra de alertas de éxito temporizadas.

- Mejoras UX/UI:

    - Se agregó un script para cerrar automáticamente el menú hamburguesa al hacer clic en un enlace en versión móvil.

    - Solución al solapamiento de la barra de navegación pegajosa (sticky) implementando la propiedad scroll-padding-top en el CSS.

### SEMANA 1: Estructura HTML5 y Diseño CSS3 Base

- Estructura Semántica: Creación de la maquetación inicial del proyecto "SEV Toys" en formato Landing Page utilizando HTML5 (header, nav, main, section, article, footer).

- Estilos y Variables: Creación del archivo style.css implementando la paleta de colores del proyecto mediante el uso de variables CSS (:root) para mantener consistencia.

- Animaciones CSS: Desarrollo e implementación de 4 animaciones clave mediante @keyframes:

    - Aparición desde abajo (aparecerDesdeAbajo) para el banner principal.

    - Fade-in (aparecerSuave) para la carga de las tarjetas.

    - Zoom interactivo (zoomSuave) para el estado :hover de las categorías.

    - Efecto de latido (latido) para destacar los textos de descuentos.

- Responsividad Base: Uso de Media Queries manuales para adaptar la tipografía y disposición de los elementos en pantallas menores a 900px y 600px.

- Recursos Gráficos:

    - Integración de Google Fonts (tipografía Caveat).

    - Uso de Google Material Symbols para la iconografía del menú.

    - Creación y aplicación de un Favicon SVG transparente y optimizado directamente en el HTML.