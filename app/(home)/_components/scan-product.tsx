'use client'
import React from "react";
import Webcam from "react-webcam";
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, RotateCcw, Check, Loader2, X, Globe, Package2, ShoppingBag } from "lucide-react";

const ScanProduct = ({ onSubmit }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState('pending');
  
  // Form state
  const [productName, setProductName] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [country, setCountry] = useState('India');
  
  // Check camera permission when camera is shown
  useEffect(() => {
    if (showCamera) {
      const checkCameraPermission = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraPermission('granted');
        } catch (err) {
          setCameraPermission('denied');
          setShowCamera(false);
        }
      };
      
      checkCameraPermission();
    }
  }, [showCamera]);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCamera(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare form data
    const formData = {
      productName,
      netWeight,
      country,
      image: capturedImage || selectedImage
    };
    
    // Call the provided onSubmit handler
    if (onSubmit) {
      onSubmit(formData);
      
      // Reset form after submission
      setTimeout(() => {
        setLoading(false);
        setProductName('');
        setNetWeight('');
        setCountry('India');
        resetImages();
      }, 2000);
    } else {
      // If no onSubmit handler is provided, just log and reset loading
      console.log("Submitting form data:", formData);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Camera size={20} />
          Product Scan Form
        </h2>
        <p className="text-blue-100 text-sm mt-1">Add product details and image</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        {/* Camera/Preview Container */}
        {showCamera ? (
          <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-4">
            {cameraPermission === 'granted' ? (
              <Webcam 
                ref={webcamRef} 
                screenshotFormat="image/jpeg" 
                className="w-full h-64 object-cover"
                videoConstraints={{
                  facingMode: "environment"
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-100 text-gray-500">
                <p className="text-center px-4">
                  {cameraPermission === 'denied' 
                    ? "Camera access was denied. Please enable camera permissions and refresh." 
                    : "Initializing camera..."}
                </p>
              </div>
            )}
            
            {/* Camera controls */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setShowCamera(false)}
                className="bg-white p-3 rounded-full text-red-500 shadow-md"
              >
                <X size={24} />
              </button>
              
              <button
                type="button"
                onClick={capture}
                className="bg-blue-600 p-4 rounded-full text-white shadow-md"
              >
                <Camera size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            {(capturedImage || selectedImage) ? (
              <div className="relative">
                <img
                  src={capturedImage || selectedImage}
                  alt="Selected product"
                  className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                />
                <button
                  type="button"
                  onClick={resetImages}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full text-gray-600 shadow-sm hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex-1 py-3 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100"
                >
                  <Camera size={20} />
                  Open Camera
                </button>
                
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200"
                  >
                    <Upload size={20} />
                    Upload Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Product Information */}
        {!showCamera && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  Product Name*
                </div>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Package2 size={16} />
                  Net Weight*
                </div>
              </label>
              <input
                type="text"
                value={netWeight}
                onChange={(e) => setNetWeight(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 250g, 1kg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  Country of Origin
                </div>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading || (!capturedImage && !selectedImage) || !productName || !netWeight}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Submit Product
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ScanProduct;