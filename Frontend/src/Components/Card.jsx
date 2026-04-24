import "./Card.css"

export default function Card({ title, image, date, status, onClick, innerRef }) {
    return (
        <div
            ref={innerRef}
            onClick={onClick}
            className="card"
        >
            <div className="card-image">
                <div className="card-image-wrapper">
                    {image ? (
                        <img src={image} alt={title} loading="lazy"/>
                    ) : (
                        <div className="card-placeholder">Sin imagen</div>
                    )}
                </div>

                <span className={`card-status status-${status}`}>
                    {status}
                </span>
            </div>
            <div className="card-info">
                <h3>{title}</h3>
                <p>{date}</p>
            </div>
        </div>
    );
}