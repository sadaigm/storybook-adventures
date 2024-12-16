import React, { useState } from 'react';
import { getAppUrl } from '../../const';

interface CustomImageProps {
  src: string; // Image source URL
  alt: string; // Image alt text
  className?: string; // Optional styling class
  defaultSrc?: string; // Optional default image to fall back to
  title?: string; // Optional title to display in the overlay
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  className,
  defaultSrc = `${getAppUrl()}/defaultImage.jpeg`, // Default fallback image
  title = 'No Image Available', // Default title for overlay
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src); // Set the initial image source to the provided `src`
  const [isDefault, setIsDefault] = useState<boolean>(false); // To track if the default image is shown

  const handleError = () => {
    setImageSrc(defaultSrc); // Change to the fallback image on error
    setIsDefault(true); // Mark the image as default to show the overlay
  };

  return (
    <div className="relative">
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} w-full h-auto object-cover`} // Custom class for styling
        onError={handleError} // Handle the error and change the source to the default image
      />
      
      {/* Overlay Text (only visible if the default image is shown) */}
      {isDefault && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-center p-6">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default CustomImage;
