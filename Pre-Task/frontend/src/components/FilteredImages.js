import React from "react";

const FilteredImages = ({ images }) => {
  if (images.length === 0) {
    return <p>No images found.</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {images.map(image => (
        <img
          key={image.id}
          src={`http://localhost:5000/images/${image.id}.png`} // Replace <port> with your backend port
          alt={`${image.id}`}
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
      ))}
    </div>
  );
};

export default FilteredImages;
