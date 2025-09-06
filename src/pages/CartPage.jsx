import { useCart } from '../context/CartContext';
import { useState } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CartPage(){
  const { cart, removeFromCart, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [phoneError, setPhoneError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function handleChange(e){
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCheckout(e){
    e.preventDefault();

    // Validate phone (must be exactly 10 digits)
    const digitsOnly = form.phone.replace(/\D/g, ""); // remove + and spaces
    if (digitsOnly.length !== 12) {
      setPhoneError("Phone number must be exactly 11 digits.");
      return;
    }
    setPhoneError("");

    // Build products string
    const productsList = cart.map(item => `${item.name} (x${item.qty})`).join(', ');

    // Build form data for Google Form
    const formData = new FormData();
    formData.append('entry.1756456303', form.name);        // Name
    formData.append('entry.1808647065', form.address);     // Address
    formData.append('entry.214111143', form.phone);        // Phone
    formData.append('entry.1893890607', productsList);     // Products
    formData.append('entry.366099728', total.toFixed(2));  // Total cost

    try {
      await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSdT_D55rImciXunkcKSmZMJbikqyScpe6WVRzW7ULW5sxiI5A/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors", // Required for Google Forms
      });

      clearCart();
      setForm({ name: '', address: '', phone: '' });
    } catch (err) {
      console.error("Error submitting order:", err);
    }
  }

  return (
    <div>
      <h2 className="mb-3">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>${(item.price * item.qty).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={()=>removeFromCart(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total: ${total.toFixed(2)}</h4>

          <h3 className="mt-4">Checkout</h3>
          <form onSubmit={handleCheckout} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone (WhatsApp)</label>
              <PhoneInput
                country={"eg"}
                value={form.phone}
                onChange={(phone) => setForm({ ...form, phone })}
                inputClass={`form-control ${phoneError ? "is-invalid" : ""}`}
                inputStyle={{ width: "100%" }}
                specialLabel=""
              />
              {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
            </div>
            <button className="btn btn-dark" type="submit">Place Order</button>
          </form>
        </>
      )}
    </div>
  );
}
