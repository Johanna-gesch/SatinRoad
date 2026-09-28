import "./index.css";
import {useEffect, useState} from "react";
import {Api, type Product, type User} from "@/api/Api.ts";

export const MyApi = new Api();

export function App() {

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    MyApi.getUsers.userGetUsers().then(r => {
      setUsers(r);
    })
  }, []);

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
      {users.map(user => (
          <div key={user.userId}>
            {user.userName}
            </div>
      ))}
    </div>
  );
}

export default App;
