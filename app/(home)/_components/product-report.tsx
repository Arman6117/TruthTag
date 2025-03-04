"use client";
import React, { useState } from "react";
import {
  Shield,
  ExternalLink,
  User,
  Calendar,
  Flag,
  Bookmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        No product data available.
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
      </div>

      {/* Product Details */}
      <div className="border-b border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {productData.productName}
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-start gap-2">
            <Flag size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Country</p>
              <p className="text-sm font-medium">{productData.country}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Bookmark size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Net Weight</p>
              <p className="text-sm font-medium">{productData.netWeight}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Scanned By</p>
              <p className="text-sm font-medium">You</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Scan Date</p>
              <p className="text-sm font-medium">{date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <div className="p-4 border-b border-gray-100 bg-blue-50">
        <h3 className="text-sm font-semibold text-gray-700">Health Score</h3>
        <div className="text-2xl font-bold text-blue-600">
          {productData.healthScore}/100
        </div>
      </div>

      {/* Health Risks */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Health Risks</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {productData.healthRisks!.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      </div>

      {/* Consumption Frequency */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">
          Recommended Consumption Frequency
        </h3>
        <p className="text-sm text-gray-600">
          {productData.consumptionFrequency}
        </p>
      </div>

      {/* Alternatives */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">
          Better Alternatives
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {productData.alternatives!.map((alternative, index) => (
            <li key={index}>{alternative}</li>
          ))}
        </ul>
      </div>

      {/* Age Suitability */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Age Suitability</h3>
        <p className="text-sm text-gray-600">{productData.ageSuitability}</p>
      </div>

      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Warning Labels</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {productData.warningLabels!.map((warning, index) => (
            <Badge key={index} className="bg-destructive mt-2">
              {warning}
            </Badge>
          ))}
        </ul>
      </div>
      <div className="p-4 bg-gray-50 flex justify-end">
        <button className="text-sm text-blue-600 flex items-center gap-1">
          Share This Report
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductReport;
