'use client';
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, X, Check, Loader2 } from "lucide-react";

interface ScanProductProps {
  onSubmit?: (data: {
    productName: string;
    netWeight: string;
    country: string;
    image: string;
  }) => void;
}

const ScanProduct: React.FC<ScanProductProps> = ({ onSubmit }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [productName, setProductName] = useState<string>("");
  const [netWeight, setNetWeight] = useState<string>("");
  const [country, setCountry] = useState<string>("India");

  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission("granted"))
        .catch(() => {
          setCameraPermission("denied");
          setShowCamera(false);
        });
    }
  }, [showCamera]);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) setCapturedImage(imageSrc);
      setShowCamera(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => typeof reader.result === "string" && setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetImages = () => {
    setCapturedImage("");
    setSelectedImage("");
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (onSubmit) {
      onSubmit({ productName, netWeight, country, image: capturedImage || selectedImage });
      setTimeout(() => {
        setLoading(false);
        setProductName("");
        setNetWeight("");
        setCountry("India");
        resetImages();
      }, 2000);
    } else {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Camera size={20} /> Product Scan Form
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {showCamera ? (
          <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-4">
            {cameraPermission === "granted" ? (
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-64 object-cover" videoConstraints={{ facingMode: "environment" }} />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-500 text-center px-4">
                {cameraPermission === "denied" ? "Camera access denied. Enable permissions and refresh." : "Initializing camera..."}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-4">
              <button type="button" onClick={() => setShowCamera(false)} className="bg-white p-3 rounded-full text-red-500 shadow-md"><X size={24} /></button>
              <button type="button" onClick={capture} className="bg-blue-600 p-4 rounded-full text-white shadow-md"><Camera size={24} /></button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            {capturedImage || selectedImage ? (
              <div className="relative">
                <img src={capturedImage || selectedImage} alt="Selected product" className="w-full h-48 object-contain bg-gray-100 rounded-lg" />
                <button type="button" onClick={resetImages} className="absolute top-2 right-2 bg-white p-1 rounded-full text-gray-600 shadow-sm hover:bg-gray-100"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <button type="button" onClick={() => setShowCamera(true)} className="flex-1 py-3 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100">
                  <Camera size={20} /> Open Camera
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200">
                  <Upload size={20} /> Upload Image
                </button>
              </div>
            )}
          </div>
        )}
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required placeholder="Product Name" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <input type="text" value={netWeight} onChange={(e) => setNetWeight(e.target.value)} required placeholder="Net Weight (e.g., 250g)" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="China">China</option>
          <option value="Japan">Japan</option>
        </select>
        <button type="submit" disabled={loading || (!capturedImage && !selectedImage) || !productName || !netWeight} className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <><Check size={20} /> Submit Product</>}
        </button>
      </form>
    </div>
  );
};

export default ScanProduct;