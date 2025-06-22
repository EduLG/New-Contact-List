import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import CreateContact from "./pages/CreateContact";
import EditContact from "./pages/EditContact";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/edit-contact/:IdUser" element={<EditContact />} />
      <Route path="/create-contact" element={<CreateContact />} />
      <Route path="/single/:IdUser" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/" element={<Home />} />
    </Route>
  )
);