"use client";
import React, { useState } from "react";
import ScanProduct from "../_components/scan-product";
import ProductReport from "../_components/product-report";
import { HealthReport, analyzeImage } from "@/actions";
import Placeholder from "../_components/placeholder";

const ProductScannerPage: React.FC = () => {
  const [productData, setProductData] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState("");

  const handleProductSubmit = async (formData: {
    productName: string;
    netWeight: string;
    country: string;
    image: string;
  }) => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("productName", formData.productName);
      data.append("netWeight", formData.netWeight);
      data.append("country", formData.country);


      const blob = await fetch(formData.image).then((res) => res.blob());
      data.append("file", blob, "image.jpg");

      const result = await analyzeImage(data);
      const currentDate = new Date();
      const date = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      setDate(date);
      setProductData(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Product Safety Scanner
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:sticky lg:top-4 self-start">
          <ScanProduct onSubmit={handleProductSubmit} />

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

        <div>
          {productData || isLoading ? (
            <ProductReport
              date={date}
              productData={productData}
              isLoading={isLoading}
            />
          ) : (
            <Placeholder />
          )}

          {!isLoading && (
            <div className="mt-6 bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Recently Scanned
              </h3>
              {productData ? (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-.6.4-1 1-1h4l2-4h6c1 0 2 .4 2 1v3"></path>
                      <path d="M20 14v3"></path>
                      <path d="M20 20v.01"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {productData.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {productData.scanDate}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        productData.healthScore! >= 80
                          ? "bg-green-100 text-green-800"
                          : productData.healthScore! <= 60
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {productData.healthScore}/100
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
