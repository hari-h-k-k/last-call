import Image from "next/image";
import BiddingPlatform from "@/app/BiddingPlatform";
import AppRouter from "@/routes/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import {AuthProvider} from "@/routes/AuthContext";

export default function Home() {
    return (
      // <BiddingPlatform />
        <AuthProvider>
            <Router>
                <AppRouter />
            </Router>
        </AuthProvider>
    );
}
