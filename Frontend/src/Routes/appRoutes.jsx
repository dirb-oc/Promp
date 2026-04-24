import { Routes, Route } from "react-router-dom";
import SetDetailView from "../Views/SetDetailView";
import Launcher from "../Views/LauncherView";
import SaveImage from "../Views/SaveImage";
import SetsView from "../Views/SetsView";
import Gallery from "../Views/Gallery";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SetsView />} />
            <Route path="/sets/:id" element={<SetDetailView />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/launcher" element={<Launcher />} />
            <Route path="/save" element={<SaveImage />} />
        </Routes>
    );
}