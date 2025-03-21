'use client'
import React, { useState } from "react";
import Link from "next/link";
import { 
  MoreHorizontal, 
  Calendar, 
  Search, 
  Filter, 
  Shield, 
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data
const SAMPLE_SCANS = [
  {
    _id: "1",
    productName: "Organic Valley Whole Milk",
    scanDate: "2025-03-15T15:30:00Z",
    healthScore: 85,
    country: "United States",
    thumbnail: "/api/placeholder/60/60"
  },
  {
    _id: "2",
    productName: "Nature Valley Granola Bars",
    scanDate: "2025-03-14T10:20:00Z",
    healthScore: 65,
    country: "Canada",
  },
  {
    _id: "3",
    productName: "Coca-Cola Classic",
    scanDate: "2025-03-10T08:45:00Z",
    healthScore: 35,
    country: "United States",
  },
  {
    _id: "4",
    productName: "Organic Bananas",
    scanDate: "2025-03-05T14:30:00Z",
    healthScore: 95,
    country: "Ecuador",
  },
  {
    _id: "5",
    productName: "Doritos Nacho Cheese",
    scanDate: "2025-03-01T19:15:00Z",
    healthScore: 40,
    country: "Mexico",
  }
];

// Helper function to determine health score status
const getStatus = (score:number) => {
  if (score >= 80) {
    return { 
      color: "bg-green-100 text-green-800", 
      text: "Excellent",
      icon: <CheckCircle2 size={16} className="text-green-600" />
    };
  } else if (score >= 60) {
    return { 
      color: "bg-amber-100 text-amber-800", 
      text: "Average",
      icon: <AlertCircle size={16} className="text-amber-600" />
    };
  } else {
    return { 
      color: "bg-red-100 text-red-800", 
      text: "Poor",
      icon: <XCircle size={16} className="text-red-600" />
    };
  }
};

// Format date nicely
const formatDate = (dateString:string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const ScanHistory =  () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date", "score", "name"
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"
  
  // Filter scans based on search query
  const filteredScans = SAMPLE_SCANS.filter(scan => 
    scan.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort scans
  const sortedScans = [...filteredScans].sort((a, b) => {
    if (sortBy === "date") {
      return sortDirection === "asc" 
        ? new Date(a.scanDate) - new Date(b.scanDate)
        : new Date(b.scanDate) - new Date(a.scanDate);
    } else if (sortBy === "score") {
      return sortDirection === "asc" 
        ? a.healthScore - b.healthScore
        : b.healthScore - a.healthScore;
    } else if (sortBy === "name") {
      return sortDirection === "asc"
        ? a.productName.localeCompare(b.productName)
        : b.productName.localeCompare(a.productName);
    }
    return 0;
  });
  
  // Handle sort change
  const handleSort = (newSortBy:string) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scan History</h1>
          <p className="text-gray-500 text-sm mt-1">View your previous product scans</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-1 hover:bg-blue-700 transition-colors">
            <Shield size={16} />
            New Scan
          </button>
        </div>
      </div>
      
      {/* Search and filter bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Sort by:</span>
            <button 
              onClick={() => handleSort("date")}
              className={cn(
                "px-3 py-1 rounded-md flex items-center gap-1 border",
                sortBy === "date" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <Calendar size={14} />
              Date
              {sortBy === "date" && (
                <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />
              )}
            </button>
            <button 
              onClick={() => handleSort("score")}
              className={cn(
                "px-3 py-1 rounded-md flex items-center gap-1 border",
                sortBy === "score" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <Shield size={14} />
              Score
              {sortBy === "score" && (
                <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />
              )}
            </button>
            <button 
              onClick={() => handleSort("name")}
              className={cn(
                "px-3 py-1 rounded-md flex items-center gap-1 border",
                sortBy === "name" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <Filter size={14} />
              Name
              {sortBy === "name" && (
                <ArrowUpDown size={14} className={sortDirection === "asc" ? "rotate-180" : ""} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Scan history list */}
      <div className="space-y-4">
        {sortedScans.length > 0 ? (
          sortedScans.map((scan) => (
            <div key={scan._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="rounded-md overflow-hidden flex-shrink-0">
                  {/* <img src={scan.thumbnail} alt={scan.productName} width={60} height={60} className="object-cover" /> */}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{scan.productName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatDate(scan.scanDate)}</span>
                        </div>
                        <div className="inline-flex items-center">
                          <Shield size={14} className="mr-1" />
                          <span>Score: <span className="font-medium">{scan.healthScore}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const status = getStatus(scan.healthScore);
                        return (
                          <span
                            className={cn('px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1', status.color)}
                          >
                            {status.icon}
                            {status.text}
                          </span>
                        );
                      })()}
                      <div className="relative">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MoreHorizontal size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link href={`/product/${scan._id}`}>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your search or scan a new product
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;