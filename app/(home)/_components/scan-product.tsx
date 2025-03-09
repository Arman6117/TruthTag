'use client';
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Loader2, 
  ShoppingBag, 
  Weight, 
  Globe, 
  AlertTriangle,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react";

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
  const [formErrors, setFormErrors] = useState<{
    image?: string;
    productName?: string;
    netWeight?: string;
  }>({});


  const countries = [
    "India", 
    "United States", 
    "China", 
    "Japan", 
    "Australia", 
    "Canada", 
    "United Kingdom", 
    "Germany", 
    "France", 
    "Brazil", 
    "South Korea"
  ].sort();

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
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setFormErrors(prev => ({ ...prev, image: undefined }));
      }
      setShowCamera(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
          setFormErrors(prev => ({ ...prev, image: undefined }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImages = () => {
    setCapturedImage("");
    setSelectedImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = (): boolean => {
    const errors: {
      image?: string;
      productName?: string;
      netWeight?: string;
    } = {};
    
    if (!capturedImage && !selectedImage) {
      errors.image = "Please capture or upload a product image";
    }
    
    if (!productName.trim()) {
      errors.productName = "Product name is required";
    }
    
    if (!netWeight.trim()) {
      errors.netWeight = "Net weight is required";
    } else if (!/^\d+(\.\d+)?\s*(g|kg|ml|l)$/i.test(netWeight)) {
      errors.netWeight = "Please enter weight with unit (e.g., 250g, 1kg, 500ml)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    if (onSubmit) {
      onSubmit({ productName, netWeight, country, image: capturedImage || selectedImage });
      setTimeout(() => {
        setLoading(false);
        setProductName("");
        setNetWeight("");
        setCountry("India");
        resetImages();
        setFormErrors({});
      }, 2000);
    } else {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Camera size={24} className="text-blue-200" /> 
          Product Scan Form
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          Scan or upload a product image to analyze
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {showCamera ? (
          <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-4">
            {cameraPermission === "granted" ? (
              <Webcam 
                ref={webcamRef} 
                screenshotFormat="image/jpeg" 
                className="w-full h-72 object-cover" 
                videoConstraints={{ facingMode: "environment" }} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-72 bg-gray-100 text-gray-500 text-center px-4 gap-2">
                {cameraPermission === "denied" ? (
                  <>
                    <AlertTriangle size={32} className="text-amber-500" />
                    <p className="font-medium">Camera access denied</p>
                    <p className="text-sm">Please enable camera permissions in your browser settings and refresh the page</p>
                  </>
                ) : (
                  <>
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <p>Initializing camera...</p>
                  </>
                )}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-4">
              <button 
                type="button" 
                onClick={() => setShowCamera(false)} 
                className="bg-white p-3 rounded-full text-red-500 shadow-lg hover:bg-red-50 transition-colors"
              >
                <X size={24} />
              </button>
              <button 
                type="button" 
                onClick={capture} 
                className="bg-blue-600 p-4 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Camera size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {capturedImage || selectedImage ? (
              <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                <img 
                  src={capturedImage || selectedImage} 
                  alt="Selected product" 
                  className="w-full h-64 object-contain p-4" 
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/70 to-transparent p-4 pt-8">
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm font-medium">Product Image</p>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowCamera(true)} 
                        className="bg-blue-600 p-2 rounded-full text-white shadow-sm hover:bg-blue-700"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={resetImages} 
                        className="bg-white p-2 rounded-full text-gray-700 shadow-sm hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 border-dashed">
                <div className="flex flex-col items-center justify-center text-center gap-3">
                  <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                    <ImageIcon size={28} />
                  </div>
                  <h3 className="font-medium text-gray-800">Add Product Image</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Take a photo of the product or upload an existing image to analyze
                  </p>
                  <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowCamera(true)} 
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                      <Camera size={18} /> Take Photo
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                      <Upload size={18} /> Upload Image
                    </button>
                  </div>
                </div>
              </div>
            )}
            {formErrors.image && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle size={14} /> {formErrors.image}
              </p>
            )}
          </div>
        )}

        <div className="space-y-5 mt-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <ShoppingBag size={16} /> Product Name
            </label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => {
                setProductName(e.target.value);
                if (e.target.value.trim()) {
                  setFormErrors(prev => ({ ...prev, productName: undefined }));
                }
              }} 
              placeholder="Enter product name" 
              className={`w-full px-4 py-3 border ${formErrors.productName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`} 
            />
            {formErrors.productName && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle size={14} /> {formErrors.productName}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <Weight size={16} /> Net Weight
            </label>
            <input 
              type="text" 
              value={netWeight} 
              onChange={(e) => {
                setNetWeight(e.target.value);
                if (e.target.value.trim()) {
                  setFormErrors(prev => ({ ...prev, netWeight: undefined }));
                }
              }} 
              placeholder="e.g., 250g, 1kg, 500ml" 
              className={`w-full px-4 py-3 border ${formErrors.netWeight ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`} 
            />
            {formErrors.netWeight && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle size={14} /> {formErrors.netWeight}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <Globe size={16} /> Country of Origin
            </label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-no-repeat transition-all"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 1rem center", backgroundSize: "1.5em 1.5em" }}
            >
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Processing...</>
            ) : (
              <><Check size={20} /> Analyze Product</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScanProduct;