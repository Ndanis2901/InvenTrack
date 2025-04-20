import { createContext, useState, useEffect, useContext } from "react";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { AuthContext } from "./AuthContext";

// Create context
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Load products on initial render and when user changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getProducts();
          setProducts(data);
          setLoading(false);
        } catch (error) {
          setError(error.message || "Failed to fetch products");
          setLoading(false);
        }
      } else {
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // Get a single product
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message || "Failed to fetch product");
      setLoading(false);
      throw error;
    }
  };

  // Create a product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const newProduct = await createProduct(productData);
      setProducts([...products, newProduct]);
      setLoading(false);
      return newProduct;
    } catch (error) {
      setError(error.message || "Failed to create product");
      setLoading(false);
      throw error;
    }
  };

  // Update a product
  const editProduct = async (id, productData) => {
    try {
      setLoading(true);
      const updatedProduct = await updateProduct(id, productData);
      setProducts(products.map((p) => (p._id === id ? updatedProduct : p)));
      setLoading(false);
      return updatedProduct;
    } catch (error) {
      setError(error.message || "Failed to update product");
      setLoading(false);
      throw error;
    }
  };

  // Delete a product
  const removeProduct = async (id) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to delete product");
      setLoading(false);
      throw error;
    }
  };

  // Get low stock products
  const getLowStockProducts = () => {
    return products.filter((p) => p.quantity < p.lowStockThreshold);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProductById,
        addProduct,
        editProduct,
        removeProduct,
        getLowStockProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
