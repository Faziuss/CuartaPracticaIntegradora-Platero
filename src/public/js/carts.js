const d = document;

d.addEventListener("click", async (e) => {
  try {
    if (e.target.matches("#buyCartBtn")) {
      const cid = e.target.dataset.cartid;
      console.log(cid)
      await axios.post(`/api/carts/${cid}/purchase`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return console.log(error.response.data.message);
    }
    return console.log(error);
  }
});
