import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cerousel.css'

const Carousel = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/restaurants/'); 
                const data = await response.json();

                // Use slice to get the first five images directly
                setImages(data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <>
        <div id="restaurantCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                {images.map((image, index) => (
                    <div className={`carousel-item `} >
                        <img src={image.url} className="d-block w-100" alt={image.name} />
                    </div>
                ))}
            </div>
            <a className="carousel-control-prev" href="#restaurantCarousel" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#restaurantCarousel" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
        </>  
    );
};

export default Carousel;
