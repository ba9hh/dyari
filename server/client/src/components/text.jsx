import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Text = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      // Fetch images from backend
      axios
        .get('https://dyari.onrender.com/images')
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => {
          console.error('Error fetching images:', error);
        });
    }, []);
  
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5">Uploaded Images</h1>
        {images.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.name} className="border p-2">
                <img src={image.url} alt={image.name} className="w-full h-auto" />
                <p className="text-sm mt-2">{image.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

export default Text