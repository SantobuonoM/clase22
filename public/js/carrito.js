const productosApi = {
    get: () => {
        return fetch('/api/products')
            .then(data => data.json())
    }
}

const carritosApi = {
    crearCarrito: () => {
        const options = { method: "POST" }
        return fetch('/api/carts', options)
            .then(data => data.json())
    },
    deleteCart: (idCarrito) =>{
        const options = {
            method: 'DELETE',
        }
        return fetch(`/api/carts/${idCarrito}`, options)
    },
    getIds: () => {
        return fetch('/api/carts')
            .then(data => data.json())
    },
    postProd: (idCarrito, idProd) => {
        const data = { id: idProd }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        return fetch(`/api/carts/${idCarrito}/products`, options)
    },
    getProds: async idCarrito => {
        const prodsInCart = await fetch(`/api/carts/${idCarrito}/products`).then(data => data.json())
        const _prodsInCart = Promise.all(prodsInCart.map((prod)=>{
            return fetch(`/api/products/${prod.id}`).then(data => data.json())
        }))
        const finalProds = _prodsInCart.then(data => data)
        return finalProds
    },
    deleteProd: (idCarrito, idProducto) => {
        const options = {
            method: 'DELETE',
        }
        return fetch(`/api/carts/${idCarrito}/products/${idProducto}`, options)
    }
}

const ordersApi = {
    get: () => {
        return fetch('/api/orders')
            .then(data => data.json())
    },
    createOrder: async (idCart) => {
        const cartData = await carritosApi.getIds().then(carts => {
            const cart = carts.filter(cart => cart.id===parseInt(idCart))[0]
            return cart
        })
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartData)
        }
        return fetch('/api/orders', options)
            .then(data => data.json())
    }
}

loadComboProductos()
loadComboCarrito()

document.getElementById('btnAgregarAlCarrito').addEventListener('click', () => {
    const idCarrito = document.getElementById('comboCarritos').value
    const idProd = document.getElementById('comboProductos').value
    if (idCarrito && idProd) {
        agregarAlCarrito(idCarrito, idProd)
    } else {
        alert('debe seleccionar un carrito y un producto')
    }
})

document.getElementById('btnCrearCarrito').addEventListener('click', () => {
    carritosApi.crearCarrito()
        .then(({ id }) => {
            loadComboCarrito().then(() => {
                const combo = document.getElementById('comboCarritos')
                combo.value = `${id}`
                combo.dispatchEvent(new Event('change'));
            })
        })
})

document.getElementById('comboCarritos').addEventListener('change', () => {
    const idCarrito = document.getElementById('comboCarritos').value
    actualizarListaCarrito(idCarrito)
})

document.getElementById('btnNewOrder').addEventListener('click', () => {
    const idCarrito = document.getElementById('comboCarritos').value
    ordersApi.createOrder(idCarrito)
    .then((data) => {
        if(data.state=='success'){
            carritosApi.deleteCart(idCarrito)
            .then(async (data) => {
                const resp = await data.json()
                if(resp.deleted){
                    loadComboCarrito()
                    makeHtmlTable([]).then(html => {
                        document.getElementById('carrito').innerHTML = html
                    })
                    alert('Se genero correctamente su pedido!')
                }
            })
        }
    })
})


function agregarAlCarrito(idCarrito, idProducto) {
    return carritosApi.postProd(idCarrito, idProducto).then(() => {
        actualizarListaCarrito(idCarrito)
    })
}

function quitarDelCarrito(idProducto) {
    const idCarrito = document.getElementById('comboCarritos').value
    return carritosApi.deleteProd(idCarrito, idProducto).then(() => {
        actualizarListaCarrito(idCarrito)
    })
}

async function actualizarListaCarrito(idCarrito) {
    return await carritosApi.getProds(idCarrito)
        .then(prods => makeHtmlTable(prods))
        .then(html => {
            document.getElementById('carrito').innerHTML = html
        })
}

document.getElementById('btnDeleteCarrito').addEventListener('click', () => {
    const idCarrito = document.getElementById('comboCarritos').value
    carritosApi.deleteCart(idCarrito)
    .then(() => {
        loadComboCarrito()
        makeHtmlTable([]).then(html => {
            document.getElementById('carrito').innerHTML = html
        })
    })
})

function makeHtmlTable(productos) {
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`

    if (productos.length > 0) {
        html += `
        <h2>Lista de Productos</h2>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>`
        for (const prod of productos) {
            html += `
                    <tr>
                    <td>${prod.nombre}</td>
                    <td>$${prod.precio}</td>
                    <td><img width="50" src=${prod.foto} alt="not found"></td>
                    <td><a type="button" onclick="quitarDelCarrito('${prod.id}')">borrar</a></td>
                    </tr>`
        }
        html += `
            </table>
        </div >`
    } else {
        html += `<br><h4>carrito sin productos</h2>`
    }
    return Promise.resolve(html)
}

function crearOpcionInicial(leyenda) {
    const defaultItem = document.createElement("option")
    defaultItem.value = ''
    defaultItem.text = leyenda
    defaultItem.hidden = true
    defaultItem.disabled = true
    defaultItem.selected = true
    return defaultItem
}

function loadComboProductos() {
    return productosApi.get()
        .then(productos => {
            const combo = document.getElementById('comboProductos');
            combo.appendChild(crearOpcionInicial('elija un producto'))
            for (const prod of productos) {
                const comboItem = document.createElement("option");
                comboItem.value = prod.id;
                comboItem.text = prod.nombre;
                combo.appendChild(comboItem);
            }
        })
}

function vaciarCombo(combo) {
    while (combo.childElementCount > 0) {
        combo.remove(0)
    }
}

function loadComboCarrito() {
    return carritosApi.getIds()
        .then(carts => {
            const combo = document.getElementById('comboCarritos');
            vaciarCombo(combo)
            combo.appendChild(crearOpcionInicial('elija un carrito'))
            for (const cart of carts) {
                const comboItem = document.createElement("option");
                comboItem.value = cart.id;
                comboItem.text = cart.id;
                combo.appendChild(comboItem);
            }
        })
}