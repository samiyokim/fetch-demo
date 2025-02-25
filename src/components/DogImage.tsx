import React, { useState, useEffect } from 'react';

interface DogImageProps {
  src: string;
  alt: string;
}

const DogImage: React.FC<DogImageProps> = React.memo(({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  return (
    <div className="relative w-12 h-12">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-600 rounded-full border-t-transparent" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-sm text-gray-500">Error</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover rounded ${isLoading ? 'invisible' : 'visible'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
});

DogImage.displayName = 'DogImage';

export default DogImage;
