import { getImageUrl } from "../Services/images";
import "./PreviewImage.css";

export default function PreviewImage({ image }) {
    if (!image) return null;

    return (
        <div className="preview-panel">
            <div className="preview-image-wrapper">
                <img
                    src={getImageUrl(image)}
                    alt="preview"
                    className="preview-image"
                />
            </div>

            <div className="preview-content">
                <div className="preview-section">
                    <span className="preview-label">Prompt</span>
                    <p className="preview-text">{image.positive}</p>
                </div>

                <div className="preview-section">
                    <span className="preview-label negative">Negative</span>
                    <p className="preview-text negative">{image.negative}</p>
                </div>
            </div>
        </div>
    );
}