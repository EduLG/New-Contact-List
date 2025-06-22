import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const CreateContact = () => {

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!inputs.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!inputs.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "El formato del email no es válido.";
    }
    if (!inputs.phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    if (!inputs.address.trim()) newErrors.address = "La dirección es obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        "https://playground.4geeks.com/contact/agendas/EduLG/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al crear el contacto: ${response.status}`);
      }

      await response.json();
      navigate("/");
    } catch (error) {
      console.error("Error creating contact:", error);
      setApiError(error.message || "Hubo un problema al crear el contacto. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-5 my-5">
      <form
        onSubmit={handleSubmit}
        style={{ width: "700px" }}
        className="p-4 border border-dark rounded shadow bg-dark d-flex flex-column gap-3"
      >
        <h1 className="text-center mb-4 text-white">Add a new contact</h1>

        <div className="form-group">
          <label htmlFor="fullNameInput" className="text-white">Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="fullNameInput"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={inputs.name}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="emailInput" className="text-white">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="emailInput"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            value={inputs.email}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneInput" className="text-white">Phone Number</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            id="phoneInput"
            name="phone"
            placeholder="Enter phone"
            onChange={handleChange}
            value={inputs.phone}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="addressInput" className="text-white">Address</label>
          <input
            type="text"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="addressInput"
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
            value={inputs.address}
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 me-1 mb-2"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Save Contact"}
        </button>

        {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}
        
        <Link to="/" className="text-white">Cancel</Link>
      </form>
    </div>
  );
};

export default CreateContact;