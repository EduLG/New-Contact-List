export const initialStore = () => {
  return {
    message: null,
    contacts: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    
    case "save_contact":
      return {
        ...store,
        contacts: action.payload,
      };

    case "delete_contact":
      return {
        ...store,
        contacts: store.contacts.filter(contact => contact.id !== action.payload)
      };

    default:
      throw Error("Unknown action.");
  }
}