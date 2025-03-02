'use client'
import React from "react";
import Webcam from "react-webcam";
import { useState, useRef } from "react";
import { Camera, Upload, RotateCcw, Check, Loader2 } from "lucide-react";

const ScanProduct = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setSelectedImage('');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setCapturedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImages = () => {
    setCapturedImage('');
    setSelectedImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle success logic here
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Product Scanner</h2>
      
      {/* Camera/Preview Container */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg border border-blue-300 shadow-md mb-6">
        <div className="relative rounded-lg overflow-hidden bg-blue-900/5">
          {!capturedImage && !selectedImage ? (
            <Webcam 
              ref={webcamRef} 
              screenshotFormat="image/jpeg" 
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <img
              src={capturedImage || selectedImage}
              alt="Selected"
              className="w-full h-64 object-contain rounded-lg"
            />
          )}
          
          {/* Camera control buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            {!capturedImage && !selectedImage ? (
              <button
                onClick={capture}
                className="bg-blue-600 p-3 rounded-full text-white shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <Camera size={24} />
              </button>
            ) : (
              <button
                onClick={resetImages}
                className="bg-blue-600 p-3 rounded-full text-white shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <RotateCcw size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls Section */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Upload Section */}
        <div className="bg-white p-4 rounded-lg border border-blue-300 shadow-md">
          <p className="text-blue-800 font-medium mb-3">Or upload an image from your device</p>
          <div className="flex gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-800 font-medium rounded-lg hover:bg-blue-200 transition-all border border-blue-200"
            >
              <Upload size={18} />
              Browse Files
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        {(capturedImage || selectedImage) && (
          <div className="bg-white p-4 rounded-lg border border-blue-300 shadow-md">
            <div className="flex gap-4">
              <button
                onClick={resetImages}
                className="flex-1 py-3 px-4 bg-blue-50 text-blue-800 font-medium rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Analyze Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Info */}
      <div className="w-full max-w-md mt-4">
        <p className="text-blue-600 text-sm text-center">
          Position your product in the center of the frame for best results
        </p>
      </div>
    </div>
  );
};

export default ScanProduct;