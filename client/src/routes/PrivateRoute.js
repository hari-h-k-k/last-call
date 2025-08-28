import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const isAuthenticated = true; // replace with real auth logic

    return isAuthenticated ? children : <Navigate to="/login" />;
}
