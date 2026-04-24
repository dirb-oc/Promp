import { useState } from "react";
import { useImages } from "../Hooks/useImages";
import ImageCard from "../Components/ImageCard";

import ImageModal from "../Components/ImageModal";
import ScrollToTopButton from "../Components/ScrollToTopButton";

export default function Gallery() {
    const { images } = useImages();
    const [selectedIndex, setSelectedIndex] = useState(null);

    return (
        <div className="General">
            <h2 style={{ color: "#fff" }}>Gallery</h2>
            <ScrollToTopButton />

            <div className="grid grid-auto grid-gap-sm" style={{ "--min": "320px" }}>
                {images.map((img, index) => (
                    <ImageCard
                        key={img.id}
                        img={img}
                        index={index}
                        onSelect={setSelectedIndex}
                    />
                ))}
            </div>

            <ImageModal
                images={images}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
            />
        </div>
    );
}