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
          setError(null);
          const data = await getProducts();
          setProducts(data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch products:", error);
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
      setError(null);
      const data = await getProductById(id);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError(error.message || "Failed to fetch product");
      setLoading(false);
      throw new Error(error.message || "Failed to fetch product");
    }
  };

  // Create a product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await createProduct(productData);
      setProducts([...products, newProduct]);
      setLoading(false);
      return newProduct;
    } catch (error) {
      console.error("Failed to create product:", error);
      setError(error.message || "Failed to create product");
      setLoading(false);
      throw new Error(error.message || "Failed to create product");
    }
  };

  // Update a product
  const editProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await updateProduct(id, productData);
      setProducts(products.map((p) => (p._id === id ? updatedProduct : p)));
      setLoading(false);
      return updatedProduct;
    } catch (error) {
      console.error("Failed to update product:", error);
      setError(error.message || "Failed to update product");
      setLoading(false);
      throw new Error(error.message || "Failed to update product");
    }
  };

  // Delete a product
  const removeProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete product:", error);
      setError(error.message || "Failed to delete product");
      setLoading(false);
      throw new Error(error.message || "Failed to delete product");
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

export default ProductContext;
