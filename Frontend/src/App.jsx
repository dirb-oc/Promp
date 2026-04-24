import { BrowserRouter } from "react-router-dom"
import Sidebar from "./Components/Sidebar";
import AppRoutes from "./Routes/appRoutes";

function App() {
    return (
        <BrowserRouter>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                    <AppRoutes />
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;