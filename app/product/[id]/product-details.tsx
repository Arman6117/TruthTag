'use client'

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Shield,
  User,
  Calendar,
  Flag,
  Bookmark,
  AlertTriangle,
  Leaf,
  Clock,
  ArrowUpRight,
  Share2,
  ArrowLeft,
  Heart,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getProductById } from "@/actions/db"; // Assuming you have this function

const ProductDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  interface ProductData {
    _id: string;
    productName: string;
    healthScore: number;
    country?: string;
    netWeight?: string;
    scanDate?: string;
    createdAt?: string;
    healthRisks?: string[];
    consumptionFrequency?: string;
    alternatives?: string[];
    ageSuitability?: string;
    warningLabels?: string[];
  }
  
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        // Fetch the product data using the ID from URL params
        const response = await getProductById(id);
        
        if (response && response.data) {
          // Handle MongoDB document serialization
          const serializedData = serializeDocument(response.data as unknown as MongoDocument);
          
          setProductData(serializedData);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Helper function to serialize MongoDB document
interface MongoDocument {
    _id: {
        toString: () => string;
    };
    productName: string;
    healthScore: number;
    country?: string;
    netWeight?: string;
    scanDate?: Date | string;
    createdAt?: Date | string;
    healthRisks?: string[];
    consumptionFrequency?: string;
    alternatives?: string[];
    ageSuitability?: string;
    warningLabels?: string[];
}

interface ProductData {
    _id: string;
    productName: string;
    healthScore: number;
    country?: string;
    netWeight?: string;
    scanDate?: string;
    createdAt?: string;
    healthRisks?: string[];
    consumptionFrequency?: string;
    alternatives?: string[];
    ageSuitability?: string;
    warningLabels?: string[];
}

const serializeDocument = (doc: MongoDocument | null): ProductData | null => {
    if (!doc) return null;
    
    const serialized: ProductData = {
        _id: doc._id.toString(),
        productName: doc.productName,
        healthScore: doc.healthScore,
        country: doc.country,
        netWeight: doc.netWeight,
        scanDate: doc.scanDate instanceof Date ? doc.scanDate.toISOString() : doc.scanDate,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
        healthRisks: doc.healthRisks,
        consumptionFrequency: doc.consumptionFrequency,
        alternatives: doc.alternatives,
        ageSuitability: doc.ageSuitability,
        warningLabels: doc.warningLabels
    };
    
    return serialized;
};

  // Helper function to format date
  const formatDate = (dateString:string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to determine health score info
  const getHealthScoreInfo = (score:number) => {
    if (score >= 80) {
      return { 
        color: "text-green-600", 
        bg: "bg-green-50", 
        text: "Excellent",
        gradient: "from-green-500 to-green-600"
      };
    } else if (score >= 60) {
      return { 
        color: "text-amber-600", 
        bg: "bg-amber-50", 
        text: "Average",
        gradient: "from-amber-500 to-amber-600"
      };
    } else {
      return { 
        color: "text-red-600", 
        bg: "bg-red-50", 
        text: "Poor",
        gradient: "from-red-500 to-red-600"
      };
    }
  };

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  // Handle share click
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Product Analysis: ${productData?.productName || 'Unknown Product'}`,
        text: `Check out the health analysis for ${productData?.productName || 'this product'}.`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Handle save to favorites
  const handleSaveToFavorites = () => {
    // Implement your save to favorites functionality here
    alert("Product saved to favorites!");
  };

  // Handle print report
  const handlePrintReport = () => {
    window.print();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="bg-white rounded-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="h-8 bg-gray-200 rounded-lg w-48 ml-4 animate-pulse"></div>
        </div>
        <div className="w-full bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="w-full h-16 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="bg-white rounded-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">Product Not Found</h1>
        </div>
        <div className="w-full bg-white rounded-xl shadow-md p-12 text-center">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">The product you are looking for might have been removed or does not exist.</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Scan History
          </button>
        </div>
      </div>
    );
  }

  const scoreInfo = getHealthScoreInfo(productData?.healthScore || 0);
  const formattedDate = formatDate(productData?.scanDate || productData?.createdAt || "");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="bg-white rounded-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">Product Details</h1>
      </div>
      
      {/* Quick Actions */}
      <div className="flex justify-end gap-2 mb-6">
        <button 
          onClick={handleSaveToFavorites}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Heart size={16} className="text-pink-500" />
          <span className="hidden md:inline">Save</span>
        </button>
        <button 
          onClick={handlePrintReport}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Printer size={16} className="text-gray-600" />
          <span className="hidden md:inline">Print</span>
        </button>
        <button 
          onClick={handleShare}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Share2 size={16} />
          <span className="hidden md:inline">Share</span>
        </button>
      </div>

      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className={cn("bg-gradient-to-r text-white p-6", `from-blue-600 to-indigo-700`)}>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Shield size={24} className="text-blue-200" />
            {productData?.productName}
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-blue-100">
              Health Score: 
              <span className={cn("text-xl font-bold ml-2", (productData?.healthScore || 0) >= 70 ? "text-white" : "text-yellow-300")}>
                {productData?.healthScore}/100
              </span>
            </p>
            <div className={cn("px-3 py-1 rounded-full bg-white/20 text-white")}>
              <span className="font-medium">{scoreInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Health Score Visualization */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Assessment</h3>
          <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className={cn("h-full rounded-full bg-gradient-to-r", scoreInfo.gradient)} 
              style={{ width: `${productData?.healthScore || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Average</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Flag size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Origin</p>
                <p className="text-base font-semibold">{productData?.country || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Bookmark size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Net Weight</p>
                <p className="text-base font-semibold">{productData?.netWeight || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Scanned By</p>
                <p className="text-base font-semibold">You</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Scan Date</p>
                <p className="text-base font-semibold">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Risks */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-800">Potential Health Risks</h3>
          </div>
          {productData?.healthRisks && productData.healthRisks.length > 0 ? (
            <div className="bg-red-50 rounded-lg p-4">
              <ul className="space-y-3">
                {productData.healthRisks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-500 text-lg leading-none mt-0.5">•</span>
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic bg-green-50 p-4 rounded-lg">No significant health risks identified.</p>
          )}
        </div>

        {/* Consumption Frequency */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Recommended Consumption
            </h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">{productData?.consumptionFrequency || "No specific recommendation available."}</p>
          </div>
        </div>

        {/* Alternatives */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Leaf size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Healthier Alternatives
            </h3>
          </div>
          {productData?.alternatives && productData.alternatives.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {productData.alternatives.map((alternative, index) => (
                <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <ArrowUpRight size={16} className="text-green-600" />
                  <span className="font-medium text-gray-700">{alternative}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">No alternatives suggested.</p>
          )}
        </div>

        {/* Age Suitability */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Age Suitability</h3>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-medium text-gray-700">{productData?.ageSuitability || "Suitable for all ages."}</p>
          </div>
        </div>

        {/* Warning Labels */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Warning Labels</h3>
          </div>
          {productData?.warningLabels && productData.warningLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {productData.warningLabels.map((warning, index) => (
                <Badge 
                  key={index} 
                  className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 text-sm font-medium"
                >
                  {warning}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">No warning labels present.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            This report is generated based on available product data and is for informational purposes only.
            Please consult nutrition experts for personalized advice.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleBack}
              className="text-blue-600 font-medium flex items-center gap-1 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button 
              onClick={handleShare}
              className="bg-blue-600 text-white font-medium flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;