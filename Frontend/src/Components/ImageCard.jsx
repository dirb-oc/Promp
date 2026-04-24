import { useState } from "react";
import { getImageUrl } from "../Services/images";
import './ImageCard.css';

export default function ImageCard({ img, index, onSelect }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div 
            className="image-card"
            onClick={() => onSelect(index)}
        >
            {!loaded && <div className="image-skeleton" />}

            <img
                loading="lazy"
                src={getImageUrl(img)}
                alt="output"
                onLoad={() => setLoaded(true)}
                className={`image-img ${loaded ? "loaded" : ""}`}
            />
        </div>
    );
}