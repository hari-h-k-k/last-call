import { Routes, Route } from "react-router-dom";
import LoginPage from "@/auth/LoginPage";
import RegisterPage from "@/auth/RegisterPage";
import HomePage from "@/home/HomePage";
import PrivateRoute from "@/routes/PrivateRoute";

export default function AppRouter() {
    return (
        <Routes>
            {/*<Route path="/login" element={<LoginPage />} />*/}
            {/*<Route path="/register" element={<RegisterPage />} />*/}
            {/*<Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />*/}

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />

        </Routes>
    );
}