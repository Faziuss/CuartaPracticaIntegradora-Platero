const d = document

const btn = d.getElementById("addProductToCartBtn")

d.addEventListener("click", async (e) => {

   try {
    if (e.target.matches("#addProductToCartBtn")) {

        const pid = e.target.dataset.btnid
    
        const cid = "65e75ec0b31246f61082cb5f"
    
        await axios.post(`/api/carts/${cid}/product/${pid}`);
        console.log("Producto agregado al carrito exitosamente");
        }
   } catch (error) {
    if(axios.isAxiosError(error)){
        return console.log(error.response.data.message)
      }
      return console.log(error);
   }
})