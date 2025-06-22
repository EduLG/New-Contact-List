import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Home = () => {

  const { store, dispatch } = useGlobalReducer();
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

    const getAgendas = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch("https://playground.4geeks.com/contact/agendas/EduLG");
      if (!response.ok) {
        if (response.status === 404) {
          console.log("Couldn't find the agenda. Creating a new one");
          await createAgenda();
          const retryResponse = await fetch("https://playground.4geeks.com/contact/agendas/EduLG");
          if (!retryResponse.ok) {
              throw new Error(`Error loading contacts`);
          }
          const retryData = await retryResponse.json();
          dispatch({ type: "save_contact", payload: retryData.contacts });
          return;
        }
        throw new Error(`Error loading agenda: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Loaded", data);
      dispatch({
        type: "save_contact",
        payload: data.contacts,
      });
    } catch (error) {
      console.error("Can't create the agenda, error: ", error);
      dispatch({ type: "save_contact", payload: [] });
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    getAgendas();
  }, []);

  const createAgenda = async () => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/contact/agendas/EduLG",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) {
        if (response.status === 400) {
            console.log("This agenda already exists.");
        } else {
            throw new Error(`Couldn't create agenda.`);
        }
      } else {
        console.log("Your agenda was created succesfully.");
      }
    } catch (error) {
      console.error("Couldn't create agenda: ", error);
      setApiError("There was a probem trying to create the agenda.");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact from the list?")) {
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/EduLG/contacts/${contactId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      dispatch({
        type: "delete_contact",
        payload: contactId,
      });
    } catch (error) {
      console.error(
        "Couldn't delete contact, error: \n",
        error
      );
      setApiError("Couldn't delete contact.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Contacts</span>
        </div>
        <p className="text-muted mt-2">Loading Contacts</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {apiError && <div className="alert alert-danger mb-3">{apiError}</div>}

      <div className="d-flex justify-content-end mb-4">

        <button
          onClick={() => {
            navigate("/create-contact");
          }}
          className="btn btn-success shadow-sm"
          disabled={isLoading}
        >
          Create Contact
        </button>
      </div>

      {store.contacts.length === 0 ? (
        <div className="text-center p-5 bg-light rounded shadow-sm">
          <h2 className="text-muted mb-3">Your contact list is empty.</h2>
          <p className="lead text-muted">Click on Create Contact to add a new contactto Edu's Contact List.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {store.contacts?.map((contact) => {
            return (
              <div className="col" key={contact.id}>
                <div className="card h-100 shadow-sm border-0 rounded-3">
                  <img
                    src="https://img.freepik.com/premium-vector/social-media-logo_1305298-29989.jpg?semt=ais_hybrid&w=740"
                    className="card-img-top mx-auto mt-3 rounded-circle"
                    alt="Profile Pic"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary mb-3">{contact.name}</h5>
                    <ul className="list-unstyled text-start mb-0">
                      <li className="d-flex align-items-center mb-2">
                        <i className="fas fa-envelope me-2 text-muted"></i>
                        <span>{contact.email}</span>
                      </li>
                      <li className="d-flex align-items-center mb-2">
                        <i className="fas fa-phone me-2 text-muted"></i>
                        <span>{contact.phone}</span>
                      </li>
                      <li className="d-flex align-items-center mb-2">
                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                        <span>{contact.address}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer bg-transparent border-0 d-flex justify-content-center pt-0 pb-3">
                    <button
                      onClick={() => navigate(`/edit-contact/${contact.id}`)}
                      className="btn btn-outline-secondary btn-sm me-2 rounded-pill"
                      title="Editar Contacto"
                    >
                      <i className="fas fa-pencil-alt"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      title="Eliminar Contacto"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};