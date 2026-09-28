import "./index.css";
import {useEffect, useState} from "react";
import {Api, type Product, type Category} from "@/api/Api.ts";

export const MyApi = new Api();

export function App() {

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    MyApi.getProducts.productGetProducts().then(r => {
      setProducts(r)
    })
  }, []);
  
  function handleCreateCategory(){
    MyApi.createCategory.categoryCreateCategory({ categoryName })
        .then(() => alert("Category created"));
  }

  return (
    <div>
      <input
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          placeholder="New category name"
        />
      <button onClick={handleCreateCategory}>Create category</button>
      {products.map(product => (
          <div key={product.productId}>
            {product.productName}
          </div>
      ))}
    </div>
  );
}

export default App;
