import "./index.css";
import {useEffect, useState} from "react";
import {Api, type Product, type Category} from "@/api/Api.ts";

export const MyApi = new Api();

export function App() {

    const [products, setProducts] = useState<Product[]>([]);
    const [productNameField, setProductNameField] = useState("");
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productNameField, setProductNameField] = useState("");
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r)
        })
    }, []);
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
            Create Product:
            <input placeholder={"Product Name"} value={productNameField}
                   onChange={e => setProductNameField(e.target.value)}></input>
            <button onClick={() => {
                MyApi.createProduct.productCreateProduct({ProductName: productNameField})
                    .then(r => {
                        setProductNameField("")
                    })
                    .then(r => {
                        MyApi.getProducts.productGetProducts().then(r => {
                            setProducts(r)
                        })
                    })
            }}>Create
            </button>
            {products.map(product => (
                // if editingBookId matches the id of the book that is currently being mapped
                // - then make an input field with the books current name
                // - else just put the books title as text
                <div key={product.productId}>
                    {editingProductId === product.productId ? (
                        <>
                            <input
                                value={product.productName}
                                // ...p means: copy all properties from p into the new object
                                // {...p, productName: e.target.value} means copy p, but change the productName to the new value
                                onChange={e => {
                                    setProducts(products.map(p => p.productId === product.productId
                                        ? {...p, productName: e.target.value}
                                        : p
                                    ))
                                }}
                            />
                        </>
                    ) : (
                        <>
                            {product.productName}
                        </>
                    )}
                    <button onClick={() => {
                        // if editingBookId is null or a different books id from previous click without save
                        // - set the editingBookId to the id of the book from the edit button you clicked on.
                        if(editingProductId === product.productId) {
                            MyApi.updateProduct.productUpdateProduct({
                                ProductId: product.productId,
                                ProductName: product.productName
                            }).then(() => {
                                setEditingProductId(null);
                            }).then(r => {
                                MyApi.getProducts.productGetProducts().then(r => {
                                    setProducts(r)
                                })
                            })
                        } else {
                            setEditingProductId(product.productId);
                        }
                    }}>{editingProductId === product.productId ? "Save" : "Edit"}</button>
                </div>
            ))}
        </div>
    );
  return (
    <div>
      <input
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          placeholder="New category name"
        />
      <button onClick={handleCreateCategory}>Create category</button>
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
