/* ============================ */
/*        VARIABLES GLOBALES    */
/* ============================ */
let carrito = [];
let productos = [];
const carritoNav = document.getElementById('carritoNav');
const resumenCarritoDiv = document.getElementById("resumenCarrito");
const listaProductosDiv = document.getElementById('listaProductos');
const subtotalP = document.getElementById('subtotal');
const ivaP = document.getElementById('iva');
const totalP = document.getElementById('total');
// No necesitamos productosGrid global si manejamos multiples grids
// const productosGrid = document.querySelector('.productos-grid');


/* ============================ */
/*        PERSISTENCIA          */
/* ============================ */
// Cargar carrito desde localStorage al iniciar
const carritoGuardado = localStorage.getItem('carrito');
if (carritoGuardado) {
  carrito = JSON.parse(carritoGuardado);
  actualizarContador();
}

/* ============================ */
/*        FETCH PRODUCTOS       */
/* ============================ */
// Simula una API local, puedes cambiar la URL por una real si tienes endpoint
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    renderizarProductosPorSeccion(); // Llamar a la nueva función para renderizar por sección
    populateDropdownMenu(); // Llamar a la función para poblar el submenú
  })
  .catch(() => {
    // Fallback si no hay productos.json
    productos = [
      {
        id: 1,
        nombre: "BUZO ESCOLAR", // Corregido nombre para coincidir con la asignación
        precio: 150.00,
        imagen: "img/uniforme1.jpeg",
        descripcion: "Buzo escolar cómodo y resistente",
        categoria: "Uniformes Escolares y Corporativos"
      },
      {
        id: 2,
        nombre: "UNIFORME CORPORATIVO", // Corregido nombre
        precio: 250.00,
        imagen: "img/uniforme5.jpeg",
        descripcion: "Elegante uniforme para empresas",
        categoria: "Uniformes Escolares y Corporativos"
      },
       {
        id: 3,
        nombre: "VESTIDO DE DANZA CLÁSICA",
        precio: 180.00,
        imagen: "img/carrusel2.jpg",
        descripcion: "Vestido ligero para danza",
        categoria: "Vestuario para Danza"
      },
      {
        id: 4,
        nombre: "ZAPATILLAS DE BALLET",
        precio: 90.00,
        imagen: "img/carrusel3.jpg",
        descripcion: "Zapatillas profesionales de ballet",
        categoria: "Vestuario para Danza"
      },
      {
        id: 5,
        nombre: "CAMISA CASUAL CABALLERO",
        precio: 120.00,
        imagen: "img/carrusel1.jpg",
        descripcion: "Camisa moderna para caballero",
        categoria: "Indumentaria para Damas, Caballeros y Niños"
      },
      {
        id: 6,
        nombre: "PANTALÓN DAMA",
        precio: 100.00,
        imagen: "img/carrusel4.jpg",
        descripcion: "Pantalon comodo y versatil para dama",
        categoria: "Indumentaria para Damas, Caballeros y Niños"
      },
      {
        id: 7,
        nombre: "BUFANDA DE LANA",
        precio: 40.00,
        imagen: "img/carrusel5.jpg",
        descripcion: "Bufanda abrigadora",
        categoria: "Accesorios"
      },
      {
        id: 8,
        nombre: "GORRO TEJIDO",
        precio: 30.00,
        imagen: "img/carrusel6.jpg",
        descripcion: "Gorro comodo para el frio",
        categoria: "Accesorios"
      }
    ];
     renderizarProductosPorSeccion(); // Llamar para el fallback
     populateDropdownMenu(); // Llamar para el fallback
  });

/* ============================ */
/*        SUBMENU NAVBAR        */
/* ============================ */
function populateDropdownMenu() {
  // Seleccionar el ul.dropdown-menu dentro del li.dropdown de Productos
  const dropdownMenu = document.querySelector('.navbar-menu li.dropdown .dropdown-menu');
  if (!dropdownMenu) return;

  dropdownMenu.innerHTML = ''; // Limpiar el menú existente
  // Crear un conjunto de categorías únicas para el submenú
  const categoriasUnicas = [...new Set(productos.map(prod => prod.categoria))].filter(categoria => categoria); // Filtrar categorías vacías

  categoriasUnicas.forEach(categoria => {
    const listItem = document.createElement('li');
    // Enlazar a la sección de productos correspondiente usando el ID generado
    const seccionId = generarIdSeccion(categoria);
    // Aseguramos que el texto de la categoría esté dentro del enlace
    listItem.innerHTML = `<a href="#${seccionId}">${categoria}</a>`;
    dropdownMenu.appendChild(listItem);
  });

  // Añadir event listeners para desplazamiento suave a los nuevos enlaces del submenú
  addSmoothScrollToSubmenuLinks();
}


// Función auxiliar para generar IDs de sección basados en la categoría
function generarIdSeccion(categoria) {
  // Convertir a minúsculas, reemplazar espacios y caracteres especiales por guiones
  // y eliminar guiones al inicio o final
  return categoria.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '').replace(/^-+|-+$/g, '');
}


/* ============================ */
/*        RENDERIZAR PRODUCTOS POR SECCIÓN */
/* ============================ */
function renderizarProductosPorSeccion() {
  // Mapear nombres de categoría a IDs de sección en tu HTML
  // Estos IDs deben coincidir con los generados por generarIdSeccion
  const secciones = {
    "Uniformes Escolares y Corporativos": "uniformes-escolares-y-corporativos",
    "Vestuario para Danza": "vestuario-para-danza",
    "Indumentaria para Damas, Caballeros y Niños": "indumentaria-para-damas-caballeros-y-ni-os", // <-- Corregido el ID aquí
    "Accesorios": "accesorios" // Asegúrate de que este ID exista en tu HTML
  };

  for (const categoria in secciones) {
    const seccionId = secciones[categoria];
    const seccionElement = document.getElementById(seccionId);

    if (seccionElement) {
      const productosGrid = seccionElement.querySelector('.productos-grid');
      if (productosGrid) {
        productosGrid.innerHTML = ''; // Limpiar el grid existente

        // Filtrar productos por categoría
        const productosFiltrados = productos.filter(prod => prod.categoria === categoria);

        productosFiltrados.forEach(prod => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
            <div class="card-body">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text">$${prod.precio}</p>
              <button class="btn btn-primary" onclick="abrirModalDesdeAPI(${prod.id})">Agregar al Carrito</button>
              <p class="mensaje-carrito" style="color:green; margin-top: 10px; display:none;">Producto agregado al carrito</p>
            </div>
          `;
          productosGrid.appendChild(card);
        });
      }
    }
  }
}


/* ============================ */
/*        MODAL DE PRODUCTO     */
/* ============================ */
function abrirModalDesdeAPI(id) {
  const prod = productos.find(p => p.id === id);
  if (!prod) return;
  document.getElementById('modalName').textContent = prod.nombre;
  document.getElementById('modalPrice').textContent = `$${prod.precio}`;
  document.getElementById('modalImage').src = prod.imagen;
  document.getElementById('modalDescription').textContent = prod.descripcion || '';
  document.getElementById('productModal').setAttribute('data-id', prod.id);
  const modal = document.getElementById('productModal');
  modal.classList.remove('hidden');
  modal.style.display = "block";
}

function cerrarModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = "none";
  }
}

/* ============================ */
/*        CARRITO DE COMPRAS    */
/* ============================ */
function agregarAlCarritoModal() {
  const id = parseInt(document.getElementById('productModal').getAttribute('data-id'));
  const prod = productos.find(p => p.id === id);
  if (!prod) return;

  // Si ya está en el carrito, suma cantidad
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();

  const mensaje = document.getElementById('mensajeCarrito');
  if (mensaje) {
    mensaje.style.display = 'block';
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 3000);
  }
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
  if (cartCount) {
    let total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    cartCount.textContent = total;
  }
}

function mostrarResumenCarrito() {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  resumenCarritoDiv.classList.remove('hidden');
  resumenCarritoDiv.style.display = "block";
  listaProductosDiv.innerHTML = '';

  let subtotal = 0;
  carrito.forEach((prod, idx) => {
    let totalProducto = prod.precio * prod.cantidad;
    subtotal += totalProducto;

    const prodDiv = document.createElement('div');
    prodDiv.innerHTML = `
      <span>${prod.nombre} - </span>
      <span>Cantidad:
        <button onclick="cambiarCantidad(${prod.id}, -1)">-</button>
        <span>${prod.cantidad}</span>
        <button onclick="cambiarCantidad(${prod.id}, 1)">+</button>
      </span>
      <span> - Precio unitario: $${prod.precio.toFixed(2)}</span>
      <span> - Total: $${totalProducto.toFixed(2)}</span>
      <button onclick="eliminarDelCarrito(${prod.id})" style="color:red; margin-left:10px;\">Eliminar</button>
    `;
    listaProductosDiv.appendChild(prodDiv);
  });

  const iva = subtotal * 0.21;
  const totalConIva = subtotal + iva;

  subtotalP.textContent = `Subtotal (sin IVA): $${subtotal.toFixed(2)}`;
  ivaP.textContent = `IVA (21%): $${iva.toFixed(2)}`;
  totalP.textContent = `Total con IVA: $${totalConIva.toFixed(2)}`;
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad < 1) item.cantidad = 1;
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();
}

/* ============================ */
/*        RESUMEN Y EVENTOS     */
/* ============================ */
function actualizarResumenCarrito() {
  // Solo actualiza si el resumen está abierto
  if (resumenCarritoDiv && resumenCarritoDiv.style.display === "block") {
    mostrarResumenCarrito();
  }
}

function cerrarResumen() {
  resumenCarritoDiv.classList.add('hidden');
  resumenCarritoDiv.style.display = "none";
}

/* ============================ */
/*        EVENTOS               */
/* ============================ */
if (carritoNav) {
  carritoNav.style.cursor = 'pointer';
  carritoNav.addEventListener('click', () => {
    mostrarResumenCarrito();
  });
}

// Dropdown menu functionality (Click event on "Productos")
document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar el li.dropdown que contiene el enlace "Productos"
  const dropdownParent = document.querySelector('.navbar-menu li.dropdown');
  // Seleccionar tanto el enlace "Productos" como el submenú
  const dropdownToggle = dropdownParent ? dropdownParent.querySelector('a[href="#productos"]') : null;
  const dropdownMenu = dropdownParent ? dropdownParent.querySelector('.dropdown-menu') : null;


  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (event) => {
      event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
      dropdownMenu.classList.toggle('visible'); // Alternar la clase 'visible'
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
      // Verificar si el clic no fue dentro del li.dropdown completo
      if (dropdownParent && !dropdownParent.contains(event.target)) {
        dropdownMenu.classList.remove('visible');
      }
    });
  }

  // Añadir desplazamiento suave a los enlaces del menú principal (excepto el dropdown)
  document.querySelectorAll('.navbar-menu li a:not(.dropdown-toggle)').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          // Evitar desplazamiento para enlaces vacíos o el enlace del dropdown
          const dropdownToggle = document.querySelector('.navbar-menu li.dropdown a[href="#productos"]');
          if (href === '#' || (dropdownToggle && this === dropdownToggle)) {
              return;
          }
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
              const navbarHeight = document.querySelector('.navbar').offsetHeight;
              const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
});

// Función para añadir desplazamiento suave a los enlaces del submenú
function addSmoothScrollToSubmenuLinks() {
    const dropdownMenu = document.querySelector('.navbar-menu li.dropdown .dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault(); // Prevenir el comportamiento por defecto del enlace

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight; // Obtener la altura de la navbar
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight; // Ajustar la posición

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth' // Desplazamiento suave
                    });

                    // Opcional: Cerrar el submenú después de hacer clic
                     const dropdownMenu = document.querySelector('.navbar-menu li.dropdown .dropdown-menu');
                     if (dropdownMenu) {
                         dropdownMenu.classList.remove('visible');
                     }
                }
            });
        });
    }
}


/* ============================ */
/*        FINALIZAR COMPRA      */
/* ============================ */
function finalizarCompra() {
  alert('¡Gracias por tu compra! ');
  carrito = [];
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();
  cerrarResumen();
}

// Exponer funciones globales para los botones generados dinámicamente
window.abrirModalDesdeAPI = abrirModalDesdeAPI;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cerrarModal = cerrarModal;
window.finalizarCompra = finalizarCompra;
window.agregarAlCarritoModal = agregarAlCarritoModal;

/* ============================ */
/*        CARRUSEL BANNER       */
/* ============================ */
const carouselInner = document.querySelector('.carousel-inner');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

function showSlide(index) {
  if (index < 0) {
    currentIndex = carouselItems.length - 1; // Ir al último slide si se pasa del inicio
  } else if (index >= carouselItems.length) {
    currentIndex = 0; // Ir al primer slide si se pasa del final
  } else {
    currentIndex = index;
  }

  // La visibilidad de los captions ahora se maneja completamente con CSS y la clase 'active'
  // Se eliminó el código JavaScript que manipulaba directamente la opacidad y pointer-events.

  const offset = -currentIndex * 100;
  carouselInner.style.transform = `translateX(${offset}%)`;

  // Opcional: Actualizar clases 'active' si las usas para estilos o indicadores
  carouselItems.forEach((item, i) => {
    if (i === currentIndex) {
      item.classList.add('active');
      // Ya no manipulamos la opacidad o pointer-events aquí con JavaScript
    } else {
      item.classList.remove('active');
    }
  });
}


// Funciones para botones de navegación (si los añades en HTML)
function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

// Inicializar el carrusel (mostrar el primer slide al cargar la página)
showSlide(0);

// Auto-reproducción:
setInterval(nextSlide, 5000); // Cambiar de slide cada 5 segundos

/* ============================ */
/*        INICIALIZACIÓN DEL CARRUSEL AL CARGAR EL DOM */
/* ============================ */
document.addEventListener('DOMContentLoaded', () => {
  const carouselBanner = document.querySelector('.carousel-banner');
  if (carouselBanner) {
    // Llamar a la función showSlide(0) que ya existe
    showSlide(0);
  }

  // Esta parte ya no es necesaria aquí porque addSmoothScrollToSubmenuLinks se llama después de populateDropdownMenu
  // y populateDropdownMenu se llama después de cargar los productos.

  // Desplazamiento suave para los enlaces del menú principal (excepto el dropdown)
  document.querySelectorAll('.navbar-menu li a:not(.dropdown-toggle)').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          // Evitar desplazamiento para enlaces vacíos o el enlace del dropdown
          const dropdownToggle = document.querySelector('.navbar-menu li.dropdown a[href="#productos"]');
          if (href === '#' || (dropdownToggle && this === dropdownToggle)) {
              return;
          }
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
              const navbarHeight = document.querySelector('.navbar').offsetHeight;
              const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
});
