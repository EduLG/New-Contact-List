import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const EditContact = () => {
  const { IdUser } = useParams();
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});


  const contact = store.contacts?.find((item) => item.id === Number(IdUser));

  const [formData, setFormData] = useState({
    name: contact?.name || "",
    phone: contact?.phone || "",
    email: contact?.email || "",
    address: contact?.address || "",
  });


  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!contact) {
      setApiError("Contact not found for update.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/EduLG/contacts/${contact.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.statusText}`);
      }

      navigate("/");
    } catch (error) {
      console.error("Error updating contact:", error);
      setApiError(error.message || "Failed to update contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!contact && !isLoading) {
    return (
      <div className="container text-center py-5 my-5">
        <h2 className="text-danger">Contact not found!</h2>
        <Link to="/" className="btn btn-primary mt-3">Back to Contacts</Link>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center py-5 my-5">
      <form
        onSubmit={handleSubmit}
        style={{ width: "700px" }}
        className="p-4 border border-dark rounded shadow bg-dark d-flex flex-column gap-3"
      >
        <h2 className="text-center mb-4 text-white">Edit Contact</h2>

        <div className="form-group">
          <label htmlFor="fullNameInput" className="text-white">Name</label>
          <input
            type="text"
            className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
            id="fullNameInput"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="emailInput" className="text-white">Email</label>
          <input
            type="email"
            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
            id="emailInput"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneInput" className="text-white">Phone Number</label>
          <input
            type="text"
            className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
            id="phoneInput"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {validationErrors.phone && <div className="invalid-feedback">{validationErrors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="addressInput" className="text-white">Address</label>
          <input
            type="text"
            className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
            id="addressInput"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {validationErrors.address && <div className="invalid-feedback">{validationErrors.address}</div>}
        </div>

        {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

        <button
          type="submit"
          className="btn btn-success w-100 me-1 mb-2"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Save Contact"}
        </button>

        <Link to="/" className="text-white">Back</Link>
      </form>
    </div>
  );
};

export default EditContact;