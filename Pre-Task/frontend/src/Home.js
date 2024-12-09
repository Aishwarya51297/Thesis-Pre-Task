import React, { useState, useEffect } from 'react';
import './index.css';

function Home({ filter }) {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/images')
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        setFilteredImages(data); // Initially, no filter applied
      });
  }, []);

  // Apply the filter
  useEffect(() => {
    if (!filter) {
      setFilteredImages(images); // No filter applied, show all images
      return;
    }

    // Filtering based on gender, age, or orientation
    let filtered = images;

    if (filter.category === 'gender') {
      if (filter.value === 'male') {
        filtered = images.filter((img) => img.includes('male'));
      } else if (filter.value === 'female') {
        filtered = images.filter((img) => img.includes('female'));
      }
    }

    if (filter.category === 'age') {
      if (filter.value === 'young') {
        filtered = images.filter((img) => img.includes('young'));
      } else if (filter.value === 'middle age') {
        filtered = images.filter((img) => img.includes('middle'));
      } else if (filter.value === 'old') {
        filtered = images.filter((img) => img.includes('old'));
      }
    }

    if (filter.category === 'orientation') {
      if (filter.value === 'camera_facing') {
        filtered = images.filter((img) => img.includes('camera_facing'));
      } else if (filter.value === 'away_facing') {
        filtered = images.filter((img) => img.includes('away_facing'));
      }
    }

    setFilteredImages(filtered);
  }, [filter, images]);

  const handleImageClick = (e) => {
    e.target.classList.toggle('highlight');
  };

  return (
    <div>
      <div className="grid-container">
        {filteredImages.map((image, index) => (
          <img
            key={index}
            src={`http://127.0.0.1:5000/images/${image}`}
            alt={image}
            className="grid-item"
            onClick={handleImageClick}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
