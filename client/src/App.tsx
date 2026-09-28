import "./index.css";
import {useEffect, useState} from "react";
import {Api, type Product} from "@/api/Api.ts";

export const MyApi = new Api();

export function App() {

  const [products, setProducts] = useState<Product[]>([]);
  const [productNameField, setProductNameField] = useState("");

  useEffect(() => {
    MyApi.getProducts.productGetProducts().then(r => {
      setProducts(r)
    })
  }, []);

  return (
    <div>
      Create Product:
      <input placeholder={"Product Name"} value={productNameField} onChange={e => setProductNameField(e.target.value)}></input>
      <button onClick={() => {
        MyApi.createProduct.productCreateProduct({ProductName: productNameField})
            .then(r => {setProductNameField("")})
            .then(r => {
              MyApi.getProducts.productGetProducts().then(r => {
                setProducts(r)
              })
            })
      }}>Create</button>
      {products.map(product => (
          <div key={product.productId}>
            {product.productName}
          </div>
      ))}
    </div>
  );
}

export default App;
