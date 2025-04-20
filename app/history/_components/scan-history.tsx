'use client'
import React, { useEffect, useState } from "react";
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
import { getAllUserReport } from "@/actions/db";

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

// Helper function to serialize MongoDB ObjectId to string
// Interface for MongoDB document structure
interface MongoDocument {
  _id: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  scanDate?: Date;
  [key: string]: unknown;
}

// Interface for serialized document
interface SerializedDocument {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  scanDate?: string;
  productName?: string;
  healthScore?: number;
  country?: string;
  thumbnail?: string;
  [key: string]: unknown;
}

type DateKeys = 'createdAt' | 'updatedAt' | 'scanDate';

const serializeDocument = (doc: MongoDocument | null): SerializedDocument | null => {
  if (!doc) return null;
  
  // Create a new plain object
  const serialized: SerializedDocument = {} as SerializedDocument;
  
  // Convert each property, handling special MongoDB types
  Object.keys(doc).forEach((key: string) => {
    if (key === '_id') {
      serialized._id = doc._id?.toString() || '';
    } else if (key === 'createdAt' || key === 'updatedAt' || key === 'scanDate') {
      // Convert Date objects to ISO strings
      serialized[key as DateKeys] = doc[key] instanceof Date ? doc[key]?.toISOString() : (doc[key] ?? '') as string;
    } else {
      // Copy other properties as is
      serialized[key] = doc[key];
    }
  });
  
  return serialized;
};

const ScanHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date", "score", "name"
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"
  const [scans, setScans] = useState<(SerializedDocument | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllUserReport();
        
        if (response && response.data) {
          // Serialize each document to handle MongoDB specific types
          const serializedData = response.data.map(doc => serializeDocument(doc));
          setScans(serializedData);
        } else {
          setScans([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scan data:", err);
        setError("Failed to load scan history. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter scans based on search query
  const filteredScans = scans.filter(scan => 
    scan?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort scans
  const sortedScans = [...filteredScans].sort((a, b) => {
    if (sortBy === "date") {
      return sortDirection === "asc" 
        ? new Date(a?.scanDate || a?.createdAt || '').getTime() - new Date(b?.scanDate || b?.createdAt || '').getTime()
        : new Date(b?.scanDate || b?.createdAt || '').getTime() - new Date(a?.scanDate || a?.createdAt || '').getTime();
    } else if (sortBy === "score") {
      return sortDirection === "asc" 
        ? ((a?.healthScore || 0) - (b?.healthScore || 0))
        : ((b?.healthScore || 0) - (a?.healthScore || 0));
    } else if (sortBy === "name") {
      return sortDirection === "asc"
        ? ((a?.productName || "").localeCompare(b?.productName || ""))
        : ((b?.productName || "").localeCompare(a?.productName || ""));
    }
    return 0;
  });
  
  // Handle sort change
  type SortByOption = "date" | "score" | "name";

  interface SortHandlerParams {
    newSortBy: SortByOption;
  }

  const handleSort = ({ newSortBy }: SortHandlerParams): void => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
  };

  // Function to handle new scan
  const handleNewScan = () => {
    // Navigate to scan page or trigger scan functionality
    window.location.href = "/scan-product"; // Update this with your scan route
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scan History</h1>
          <p className="text-gray-500 text-sm mt-1">View your previous product scans</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleNewScan}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
          >
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
              onClick={() => handleSort({ newSortBy: "date" })}
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
              onClick={() => handleSort({ newSortBy: "score" })}
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
              onClick={() => handleSort({ newSortBy: "name" })}
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
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Loading products...</h3>
          <p className="text-gray-500">Please wait while we fetch your scan history</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Oops! Something went wrong</h3>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Scan history list */}
      {!loading && !error && (
        <div className="space-y-4">
          {sortedScans.length > 0 ? (
            sortedScans.filter((scan): scan is SerializedDocument => scan !== null).map((scan) => (
              <div key={scan._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="rounded-md overflow-hidden flex-shrink-0">
                    {scan.thumbnail ? (
                      <img 
                        src={scan.thumbnail} 
                        alt={scan.productName} 
                        width={60} 
                        height={60} 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                        <Shield size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{scan.productName}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{formatDate(scan.scanDate || scan.createdAt || new Date().toISOString())}</span>
                          </div>
                          <div className="inline-flex items-center">
                            <Shield size={14} className="mr-1" />
                            <span>Score: <span className="font-medium">{scan.healthScore}</span></span>
                          </div>
                          {scan.country && (
                            <div className="inline-flex items-center">
                              <span>{scan.country}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const status = getStatus(scan.healthScore || 0);
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
                {searchQuery ? "Try adjusting your search terms" : "You haven't scanned any products yet"}
              </p>
              <button 
                onClick={handleNewScan}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Shield size={16} />
                Scan Your First Product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanHistory;