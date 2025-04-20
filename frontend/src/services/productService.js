import axios from "axios";
import { getCurrentUser } from "./authService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get auth header
const getAuthHeader = () => {
  const user = getCurrentUser();
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/products/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/products`,
      productData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(
      `${API_URL}/products/${id}`,
      productData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/products/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
