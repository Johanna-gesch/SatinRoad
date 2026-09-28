import "./index.css";
import {useEffect, useState} from "react";
import {Api, type Product} from "@/api/Api.ts";

export const MyApi = new Api();

export function App() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    MyApi.getProducts.productGetProducts().then(r => {
      setProducts(r)
    })
  }, []);

  return (
    <div>
      {products.map(product => (
          <div key={product.productId}>
            {product.productName}
          </div>
      ))}
    </div>
  );
}

export default App;
