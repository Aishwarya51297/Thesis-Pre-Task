import React, { useState, useEffect } from 'react';
import './index.css';

function Home({ filter }) {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:5000/images')
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        setFilteredImages(data); // Initially, no filter applied
      });
  }, []);

  useEffect(() => {
    if (!filter) {
      setFilteredImages(images);
      return;
    }

    let filtered = images;

    if (filter.category === 'gender') {
      filtered = images.filter((img) => img.filename.includes(filter.value));
    }

    if (filter.category === 'age') {
      filtered = images.filter((img) => img.filename.includes(filter.value));
    }

    if (filter.category === 'orientation') {
      filtered = images.filter((img) => img.filename.includes(filter.value));
    }

    setFilteredImages(filtered);
  }, [filter, images]);

  const fetchDescription = async (imageId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/describe-image/${imageId}`, {
        method: 'POST',
      });
      const data = await response.json();
      setDescriptions((prev) => ({ ...prev, [imageId]: data.description }));
    } catch (error) {
      console.error('Error fetching description:', error);
    }
  };

  const handleImageClick = (imageId,index) => {
    console.log(`Image ${imageId} clicked`); // For debugging
    
    const imgElement = document.getElementById(`image-${index}`);
    if (imgElement) {
      imgElement.classList.toggle('highlight');
    }

    if (!descriptions[imageId]) {
      fetchDescription(imageId);
    }
  };

  return (
    <div>
      <div className="grid-container">
        {filteredImages.map((image, index) => (
          <div key={index} className="image-item">
            <img
              id={`image-${index + 1}`}
              src={`http://127.0.0.1:5000/static/images/${image}`}
              alt={image.filename}
              className="grid-item"
              onClick={() => handleImageClick(image,index+1)}
            />
            <p>
              {descriptions[image]
                ? descriptions[image]
                : 'Click to get description'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
