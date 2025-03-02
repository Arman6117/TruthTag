import React from "react";
import { Shield, ShieldAlert, Clock, AlertTriangle, Info, CheckCircle, ExternalLink, ChevronDown, User, Calendar, Flag, Bookmark, BarChart } from "lucide-react";

const ProductReport = ({ productData = null, isLoading = false }) => {
  // Sample data - replace with your actual data
  const report = productData || {
    productName: "Organic Apple Juice",
    netWeight: "750ml",
    country: "India",
    scanDate: "Mar 2, 2025",
    safetyScore: 85,
    ingredients: [
      { name: "Apple juice concentrate", safety: "safe" },
      { name: "Water", safety: "safe" },
      { name: "Citric acid", safety: "moderate" },
      { name: "Ascorbic acid", safety: "safe" },
      { name: "Natural flavor", safety: "safe" }
    ],
    allergens: ["None detected"],
    additives: [
      { name: "Citric acid (E330)", rating: "moderate", detail: "Used as preservative" },
      { name: "Ascorbic acid (E300)", rating: "good", detail: "Vitamin C, used as antioxidant" }
    ],
    summary: "This product is generally safe for consumption with no major concerns. It contains some additives but they are commonly used and generally recognized as safe."
  };

  // Component for ingredient status
  const IngredientStatus = ({ status }) => {
    switch(status) {
      case 'safe':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Safe</span>;
      case 'moderate':
        return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">Moderate</span>;
      case 'unsafe':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Unsafe</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Unknown</span>;
    }
  };
  
  // Rating color based on safety score
  const getSafetyColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };
  
  // Add color and icon to additive ratings
  const AdditiveRating = ({ rating }) => {
    switch(rating) {
      case 'good':
        return <span className="flex items-center text-green-600"><CheckCircle size={14} className="mr-1" /> Good</span>;
      case 'moderate':
        return <span className="flex items-center text-amber-600"><AlertTriangle size={14} className="mr-1" /> Moderate</span>;
      case 'poor':
        return <span className="flex items-center text-red-600"><ShieldAlert size={14} className="mr-1" /> Concern</span>;
      default:
        return <span className="flex items-center text-gray-600"><Info size={14} className="mr-1" /> Unknown</span>;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield size={20} />
          Product Analysis Report
        </h2>
        <p className="text-blue-100 text-sm mt-1">Detailed safety information</p>
      </div>
      
      {/* Product Information */}
      <div className="border-b border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.productName}</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-start gap-2">
            <Flag size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Country</p>
              <p className="text-sm font-medium">{report.country}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Bookmark size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Net Weight</p>
              <p className="text-sm font-medium">{report.netWeight}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <User size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Scanned By</p>
              <p className="text-sm font-medium">You</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Calendar size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Scan Date</p>
              <p className="text-sm font-medium">{report.scanDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Safety Score */}
      <div className="p-4 border-b border-gray-100 bg-blue-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Safety Score</h3>
          <div className={`text-2xl font-bold ${getSafetyColor(report.safetyScore)}`}>
            {report.safetyScore}/100
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              report.safetyScore >= 80 ? 'bg-green-500' : 
              report.safetyScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${report.safetyScore}%` }}
          ></div>
        </div>
      </div>
      
      {/* Ingredient Analysis */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Ingredients Analysis</h3>
          <button className="text-xs text-blue-600 flex items-center">
            View Details
            <ChevronDown size={14} />
          </button>
        </div>
        
        <div className="space-y-2">
          {report.ingredients.map((ingredient, index) => (
            <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
              <span className="text-sm">{ingredient.name}</span>
              <IngredientStatus status={ingredient.safety} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Additives */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Food Additives</h3>
        
        {report.additives.length > 0 ? (
          <div className="space-y-3">
            {report.additives.map((additive, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{additive.name}</span>
                  <AdditiveRating rating={additive.rating} />
                </div>
                <p className="text-xs text-gray-600">{additive.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No additives detected</p>
        )}
      </div>
      
      {/* Allergen Information */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Allergen Information</h3>
        
        {report.allergens.map((allergen, index) => (
          <div key={index} className="flex items-center py-1">
            <AlertTriangle size={16} className="text-amber-500 mr-2" />
            <span className="text-sm">{allergen}</span>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="p-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Safety Summary</h3>
        <p className="text-sm text-gray-600">{report.summary}</p>
        
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-blue-600 flex items-center gap-1">
            View Detailed Report
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReport;