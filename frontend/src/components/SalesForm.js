import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const SalesForm = ({ productId, productName, onSaleRecorded }) => {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState("10"); // Default to 10 for testing
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get today's date in YYYY-MM-DD format for default date value
  const today = new Date().toISOString().split("T")[0];

  // Set default date to today if not already set
  useEffect(() => {
    if (!date) {
      setDate(today);
    }
  }, [date, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with quantity:", quantity, "date:", date);

    if (!quantity || parseInt(quantity) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const saleData = {
        productId,
        quantity: parseInt(quantity),
        notes,
      };

      if (date) {
        saleData.date = date;
      }

      console.log("Submitting sale data:", saleData);

      const response = await axios.post(
        "http://localhost:5001/api/sales",
        saleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Sale recorded successfully:", response.data);

      setQuantity("");
      setDate("");
      setNotes("");
      setLoading(false);

      if (onSaleRecorded) {
        onSaleRecorded();
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      setError(error.response?.data?.message || "Failed to record sale");
      setLoading(false);
    }
  };

  return (
    <div className="sales-form-container">
      <h3>Record Sale for {productName}</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quantity">Quantity Sold*</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Sale Date*</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <small>Select a date to record historical sales data</small>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Enter any additional information about this sale"
          ></textarea>
        </div>

        <button type="submit" className="btn-save">
          {loading ? "Recording..." : "Record Sale"}
        </button>
      </form>
    </div>
  );
};

export default SalesForm;
