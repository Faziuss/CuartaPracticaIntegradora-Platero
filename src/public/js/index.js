const socket = io();

const d = document;

const formProduct = d.getElementById("formProduct");

formProduct.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("holaaaaaaaa")
  try {
    const title = d.getElementById("title").value;
    const description = d.getElementById("description").value;
    const code = d.getElementById("code").value;
    const price = Number(d.getElementById("price").value)
    //const status = d.getElementById("status").value;
    const stock = Number(d.getElementById("stock").value)
    const category = d.getElementById("category").value;
    const thumbnails = d.getElementById("thumbnails").value;
    
    await axios.post("/api/products", {
      title,
      stock,
      description,
      code,
      price,
      //status,
      stock,
      category,
      thumbnails,
    });

    formProduct.reset();
  } catch (error) {
    console.log(error);
  }
});

const productsContainer = d.getElementById("productsContainer");

socket.on("newProduct", (newProduct) => {
  const $element = d.createElement("div");
  $element.dataset.id = newProduct.id;
  $element.innerHTML = `<li>${newProduct.title}</li>
  <li>${newProduct.description}</li>
  <li>${newProduct.code}</li>
  <li>${newProduct.price}</li>
  <li>${newProduct.status}</li>
  <li>${newProduct.stock}</li>
  <li>${newProduct.category}</li>
  <li>${newProduct.thumbnails}</li>
    <button class="delete-btn" data-deleteid=${newProduct.id}>Eliminar Producto</button>`;

  productsContainer.appendChild($element);
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".delete-btn")) {
    await removeProduct(e.target.dataset.deleteid);
  }
});

const removeProduct = async (pid) => {
  await axios.delete(`/api/products/${pid}`);
};

socket.on("deleteProduct", (id) => {
  const $product = d.querySelector(`[data-id="${id}"]`);
  $product.remove();
});
