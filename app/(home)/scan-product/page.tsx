'use client'
import React, { useState } from "react";
import ScanProduct from "../_components/scan-product";
import ProductReport from "../_components/product-report";


const ProductScannerPage = () => {
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handler for when a product is submitted
  const handleProductSubmit = (formData) => {
    setIsLoading(true);
    
    // Simulate API call to analyze product
    setTimeout(() => {
      // Create product report data based on submitted form
      const reportData = {
        productName: formData.productName,
        netWeight: formData.netWeight,
        country: formData.country,
        scanDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        safetyScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        ingredients: [
          { name: "Main ingredient", safety: "safe" },
          { name: "Secondary ingredient", safety: "safe" },
          { name: "Preservative", safety: "moderate" },
        ],
        allergens: ["None detected"],
        additives: [
          { name: "Preservative (E211)", rating: "moderate", detail: "Common preservative used in many products" },
          { name: "Color enhancer (E160)", rating: "good", detail: "Natural color enhancer derived from plants" }
        ],
        summary: `${formData.productName} is generally safe for consumption with no major concerns. Contains common additives that are generally recognized as safe.`
      };
      
      setProductData(reportData);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Safety Scanner</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Scanner */}
        <div className="lg:sticky lg:top-4 self-start">
          <ScanProduct onSubmit={handleProductSubmit} />
          
          {/* Instructions card */}
          <div className="bg-white rounded-xl shadow-md p-4 mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">How to use</h3>
            <ol className="text-sm text-gray-600 space-y-2 pl-5 list-decimal">
              <li>Take a photo or upload an image of the product</li>
              <li>Fill in product details (name, weight, country)</li>
              <li>Submit to analyze product safety</li>
              <li>Review the detailed report</li>
            </ol>
          </div>
        </div>
        
        {/* Right column - Report */}
        <div>
          {productData || isLoading ? (
            <ProductReport productData={productData} isLoading={isLoading} />
            // <div></div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center h-64">
              <div className="text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v2"></path>
                  <path d="M18.4 5.6l-1.4 1.4"></path>
                  <path d="M21 12h-2"></path>
                  <path d="M18.4 18.4l-1.4-1.4"></path>
                  <path d="M12 19v2"></path>
                  <path d="M5.6 18.4l1.4-1.4"></path>
                  <path d="M3 12h2"></path>
                  <path d="M5.6 5.6l1.4 1.4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No Product Scanned</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Scan or upload a product to see its safety analysis report</p>
            </div>
          )}
          
          {/* Recently scanned products - can be expanded in a real app */}
          {!isLoading && (
            <div className="mt-6 bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Recently Scanned</h3>
              
              {productData ? (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-.6.4-1 1-1h4l2-4h6c1 0 2 .4 2 1v3"></path>
                      <path d="M20 14v3"></path>
                      <path d="M20 20v.01"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{productData.productName}</p>
                    <p className="text-xs text-gray-500">{productData.scanDate}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      productData.safetyScore >= 80 ? 'bg-green-100 text-green-800' : 
                      productData.safetyScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {productData.safetyScore}/100
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent scans</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScannerPage;