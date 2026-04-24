import { useScrollTop } from "../Hooks/useScrollTop";
import { FaArrowUp } from "react-icons/fa";
import "./scrollTop.css";

export default function ScrollToTopButton() {
    const { visible, scrollToTop } = useScrollTop();

    if (!visible) return null;

    return (
        <button className="scroll-top-btn" onClick={scrollToTop}>
            <FaArrowUp />
        </button>
    );
}