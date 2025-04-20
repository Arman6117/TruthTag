import React from "react";
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
  Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductReportProps {
  productData: {
    productName?: string;
    netWeight?: string;
    country?: string;
    scanDate?: string;
    healthScore?: number;
    healthRisks?: string[];
    consumptionFrequency?: string;
    alternatives?: string[];
    ageSuitability?: string;
    warningLabels?: string[];
  } | null;
  isLoading: boolean;
  date: string;
}

const ProductReport: React.FC<ProductReportProps> = ({
  productData,
  isLoading,
  date,
}) => {
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

  if (!productData) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        <AlertTriangle className="mx-auto mb-4 text-amber-500" size={32} />
        <p className="font-medium">No product data available.</p>
        <p className="text-sm mt-2">Try scanning another product or check your connection.</p>
      </div>
    );
  }

  // Helper function to determine health score color and text
  const getHealthScoreInfo = (score: number) => {
    if (score >= 80) {
      return { 
        color: "text-green-600", 
        bg: "bg-green-50", 
        text: "Excellent" 
      };
    } else if (score >= 60) {
      return { 
        color: "text-amber-600", 
        bg: "bg-amber-50", 
        text: "Average" 
      };
    } else {
      return { 
        color: "text-red-600", 
        bg: "bg-red-50", 
        text: "Poor" 
      };
    }
  };

  const scoreInfo = getHealthScoreInfo(productData.healthScore || 0);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield size={22} className="text-blue-200" />
            Product Analysis Report
          </h2>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {date}
          </span>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Health analysis and recommendations
        </p>
      </div>

      {/* Product Details */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {productData.productName}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Flag size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Origin</p>
              <p className="text-sm font-semibold">{productData.country}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Bookmark size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Net Weight</p>
              <p className="text-sm font-semibold">{productData.netWeight}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Scanned By</p>
              <p className="text-sm font-semibold">You</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Scan Date</p>
              <p className="text-sm font-semibold">{date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <div className={cn("p-5 border-b border-gray-100", scoreInfo.bg)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Health Score</h3>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-3xl font-bold", scoreInfo.color)}>
                {productData.healthScore}
              </span>
              <span className="text-gray-500 text-sm">/100</span>
            </div>
          </div>
          <div className={cn("px-4 py-2 rounded-full", scoreInfo.bg, scoreInfo.color, "border border-current")}>
            <span className="font-semibold">{scoreInfo.text}</span>
          </div>
        </div>
      </div>

      {/* Health Risks */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-700">Potential Health Risks</h3>
        </div>
        {productData.healthRisks && productData.healthRisks.length > 0 ? (
          <ul className="space-y-2">
            {productData.healthRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 text-lg leading-none mt-0.5">•</span>
                <span className="text-sm text-gray-600">{risk}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No significant health risks identified.</p>
        )}
      </div>

      {/* Consumption Frequency */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-700">
            Recommended Consumption
          </h3>
        </div>
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          {productData.consumptionFrequency}
        </p>
      </div>

      {/* Alternatives */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={18} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-700">
            Healthier Alternatives
          </h3>
        </div>
        {productData.alternatives && productData.alternatives.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2">
            {productData.alternatives.map((alternative, index) => (
              <li key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <ArrowUpRight size={14} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">{alternative}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No alternatives suggested.</p>
        )}
      </div>

      {/* Age Suitability */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-700">Age Suitability</h3>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700">{productData.ageSuitability}</p>
        </div>
      </div>

      {/* Warning Labels */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="text-sm font-semibold text-gray-700">Warning Labels</h3>
        </div>
        {productData.warningLabels && productData.warningLabels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {productData.warningLabels.map((warning, index) => (
              <Badge 
                key={index} 
                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 text-xs font-medium"
              >
                {warning}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No warning labels present.</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 bg-gray-50 flex justify-between items-center">
        <p className="text-xs text-gray-500">This report is for informational purposes only.</p>
        <button className="text-sm text-blue-600 font-medium flex items-center gap-1 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm hover:bg-blue-50 transition-colors">
          <Share2 size={16} />
          Share Report
        </button>
      </div>
    </div>
  );
};

export default ProductReport;