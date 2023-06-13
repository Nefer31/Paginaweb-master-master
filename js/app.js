// funcionalidad del carrito
const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonVaciar = document.getElementById('vaciar-carrito');
const compra2 = document.getElementById('compra2');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito(); // Cargar el carrito desde el almacenamiento local
  actualizarCarrito();
});

botonVaciar.addEventListener('click', () => {
  vaciarCarrito();
});

compra2.addEventListener('click', () => {
  if (carrito.length > 0) {
    const nombreCompleto = prompt('Ingrese su nombre completo:');
    const numeroContacto = prompt('Ingrese su número de contacto:');

    if (nombreCompleto && numeroContacto) {
      const confirmarCompra = confirm('¿Está seguro de realizar la compra?');

      if (confirmarCompra) {
        const productos = carrito.map((prod) => {
          return `${prod.nombre}: ${prod.cantidad} unidad(es) - $${prod.precio}`;
        }).join('\n');
        const total = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0);

        const templateParams = {
          to_name: nombreCompleto,
          from_name: 'Nefer',
          message: `Productos:\n${productos}\n\nTotal: $${total}\n\nNombre completo: ${nombreCompleto}\nNúmero de contacto: ${numeroContacto}`,
        };

        emailjs.send('service_ja9mpkr', 'template_yn2fv6t', templateParams)
          .then((response) => {
            console.log('Correo enviado exitosamente', response);
            vaciarCarrito();
            alert('El correo ha sido enviado exitosamente.');
          })
          .catch((error) => {
            console.error('Error al enviar el correo', error);
            alert('Ocurrió un error al enviar el correo. Por favor, inténtalo nuevamente.');
          });
      } else {
        alert('La compra ha sido cancelada.');
      }
    } else {
      alert('Por favor, ingrese su nombre completo y número de contacto.');
    }
  } else {
    alert("El carrito está vacío. No se puede procesar la compra.");
  }
  actualizarCarrito();
});


/*compra2.addEventListener('click', () => {
  if (carrito.length > 0) {
    // Redirect to the desired HTML page
    window.location.href = 'Formulario.html';
  } else {
    alert("El carrito está vacío. No se puede procesar la compra.");
  }
  actualizarCarrito();
});*/



stockProductos.forEach((producto) => {
  const div = document.createElement('div');
  div.classList.add('producto');
  div.innerHTML = `
  
    <img src=${producto.img} alt="">
    <h3>${producto.nombre}</h3>
    <p>${producto.desc}</p>
    <p class="precioProducto">Precio: $ ${producto.precio.toLocaleString('es-CO')} ${producto.peso}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
  `;
  contenedorProductos.appendChild(div);

  const boton = document.getElementById(`agregar${producto.id}`);

  boton.addEventListener('click', () => {
    agregarAlCarrito(producto.id);
  });
});

const cargarCarrito = () => {
  const carritoString = localStorage.getItem('carrito');
  carrito = JSON.parse(carritoString) ?? [];
};

const inicializarCarrito = () => {
  cargarCarrito();
  actualizarCarrito();
};

document.addEventListener('DOMContentLoaded', inicializarCarrito);


const guardarCarrito = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

const agregarAlCarrito = (prodId) => {
  const existe = carrito.some((prod) => prod.id === prodId);

  if (existe) {
    carrito = carrito.map((prod) => {
      if (prod.id === prodId) {
        prod.cantidad++;
      }
      return prod;
    });
  } else {
    const item = stockProductos.find((prod) => prod.id === prodId);
    item.cantidad = 1;
    carrito.push(item);
  }

  guardarCarrito();
  actualizarCarrito();
};

const eliminarDelCarrito = (prodId) => {
  const producto = carrito.find((prod) => prod.id === prodId);

  if (producto) {
    producto.cantidad--;
    if (producto.cantidad === 0) {
      carrito = carrito.filter((prod) => prod.id !== prodId);
    }
  }

  guardarCarrito();
  actualizarCarrito();
};

const vaciarCarrito = () => {
  carrito = [];
  localStorage.removeItem('carrito');
  actualizarCarrito();
};

const actualizarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = "No tiene productos en el carrito.";
    contenedorCarrito.appendChild(mensaje);
  } else {
    carrito.forEach((prod) => {
      const div = document.createElement('div');
      div.className = 'productoEnCarrito';
      div.innerHTML = `

      <div>
        <p name="producto">${prod.nombre}</p>
      </div>
      <div>
        <p name="precio">$${prod.precio.toLocaleString('es-CO')}</p>
      </div>
      
      <div class="botones-carrito">
      <p name="cantidad"><span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar">-<i class="fas fa-trash-alt"></i></button>
        <button onclick="agregarAlCarrito(${prod.id})" class="boton-mas">+<i class="fas fa-shopping-cart"></i></button>
      </div>
      `;
      contenedorCarrito.appendChild(div);
    });
  }
    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = ` ${carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0).toLocaleString('es-CO')} COP`;
  
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  const buscarProducto = (termino) => {
    const resultado = stockProductos.filter((producto) => {
      const nombre = producto.nombre.toLowerCase();
      const terminoMinuscula = termino.toLowerCase();
      return nombre.includes(terminoMinuscula);
    });
  
    return resultado;
  };
  
  const mostrarResultadoBusqueda = (resultados) => {
    contenedorProductos.innerHTML = "";
  
    if (resultados.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.textContent = "No se encontraron productos.";
      contenedorProductos.appendChild(mensaje);
    } else {
      resultados.forEach((producto) => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
          <img src=${producto.img} alt="">
          <h3 name="producto">${producto.nombre}</h3>
          <p>${producto.desc}</p>
          <p class="precioProducto" name="precio">Precio: $ ${producto.precio.toLocaleString('es-CO')} ${producto.peso}</p>
          <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
        `;
        contenedorProductos.appendChild(div);
  
        const boton = document.getElementById(`agregar${producto.id}`);
  
        boton.addEventListener('click', () => {
          agregarAlCarrito(producto.id);
        });
  
        boton.addEventListener('keyup', (event) => {
          if (event.key === "Enter") {
            agregarAlCarrito(producto.id);
          }
        });
      });
    }
  };
  
  const inputBusqueda = document.getElementById('searchbar');
  
  inputBusqueda.addEventListener('keyup', () => {
    const terminoBusqueda = inputBusqueda.value.trim();
    const resultados = buscarProducto(terminoBusqueda);
    mostrarResultadoBusqueda(resultados);
  });

 