const d = document;

d.addEventListener("click", async (e) => {
  try {
    if (e.target.matches("#addProductToCartBtn")) {
      const pid = e.target.dataset.btnid;

      const cid = e.target.dataset.cartid;

      await axios.post(`/api/carts/${cid}/product/${pid}`);
      console.log("Producto agregado al carrito exitosamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return console.log(error.response.data.message);
    }
    return console.log(error);
  }
});
