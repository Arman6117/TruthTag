import React from "react";
import {
  Camera,
  Clock,
  MoreHorizontal,
  AlertTriangle,
  ChartBar
} from "lucide-react";
import DashBoardCard from "./dashboard-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllUserReport } from "@/actions/db";
import { cn } from "@/lib/utils";

const getStatus = (score: number) => {
  if (score >= 80) {
    return {
      color: "text-green-600",
      text: "Safe",
    };
  } else if (score >= 60) {
    return {
      color: "text-amber-600",
      text: "Average",
    };
  } else {
    return {
      color: "text-red-600",
      text: "Poor",
    };
  }
};

const Dashboard = async () => {
  const data = await getAllUserReport();
  const products = data.data || [];
  
  
  const totalProducts = products.length;
  
  
  const safeProducts = products.filter(product => product.healthScore >= 80).length;
  const poorProducts = products.filter(product => product.healthScore < 60).length;
  

  const safePercentage = totalProducts > 0 ? (safeProducts / totalProducts) * 100 : 0;
  const poorPercentage = totalProducts > 0 ? (poorProducts / totalProducts) * 100 : 0;
  
  
  const averageHealthScore = totalProducts > 0 
    ? products.reduce((sum, product) => sum + product.healthScore, 0) / totalProducts 
    : 0;
  
  return (
    <div className="flex flex-col gap-10 p-6">
      <div className="flex justify-between items-center">
        <h1 className="md:text-3xl text-wrap text-xl font-bold text-gray-800">
          Your Product Safety Dashboard
        </h1>
        <Link href={"/scan-product"}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
            <Camera size={20} />
            <span className="hidden md:flex">Scan New Product</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap md:flex-row flex-col gap-4">
        <DashBoardCard className="bg-blue-50 rounded-lg hover:shadow-md transition-all h-40">
          <span className="text-5xl font-semibold text-blue-700">{totalProducts}</span>
          <div>
            <h2 className="text-sm font-medium text-gray-600">
              Total Products Scanned
            </h2>
          </div>
        </DashBoardCard>

        <DashBoardCard className="bg-green-50 rounded-lg hover:shadow-md transition-all h-40">
          <div className="flex items-baseline">
            <span className="text-5xl font-semibold text-green-700">{safeProducts}</span>
            <span className="text-sm text-green-600 ml-2">/{totalProducts}</span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">Safe Products</h2>
            <div className="mt-2 bg-gray-200 h-1 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{ width: `${safePercentage}%` }}
              ></div>
            </div>
          </div>
        </DashBoardCard>

        <DashBoardCard className="bg-red-50 rounded-lg hover:shadow-md transition-all h-40">
          <div className="flex items-baseline">
            <span className="text-5xl font-semibold text-red-700">{poorProducts}</span>
            <span className="text-sm text-red-600 ml-2">/{totalProducts}</span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">
              Unsafe Products
            </h2>
            <div className="mt-2 bg-gray-200 h-1 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{ width: `${poorPercentage}%` }}
              ></div>
            </div>
          </div>
        </DashBoardCard>

        <DashBoardCard className="bg-purple-50 rounded-lg hover:shadow-md transition-all h-40">
          <div className="flex items-center">
            <span className="text-5xl font-semibold text-purple-700">{averageHealthScore.toFixed(1)}</span>
            <ChartBar size={28} className="text-purple-600 ml-2" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">Average Health Score</h2>
            <div className="text-xs text-purple-600 mt-1 flex items-center">
              <AlertTriangle className={cn("mr-1", averageHealthScore < 60 ? "text-red-500" : averageHealthScore < 80 ? "text-amber-500" : "text-green-500")} size={12} />
              <span className={cn(averageHealthScore < 60 ? "text-red-500" : averageHealthScore < 80 ? "text-amber-500" : "text-green-500")}>
                {averageHealthScore < 60 ? "Poor" : averageHealthScore < 80 ? "Average" : "Good"} overall health
              </span>
            </div>
          </div>
        </DashBoardCard>
      </div>

      {products.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((scan) => (
                  <tr
                    key={scan._id?.toString()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                          <Clock size={18} className="text-gray-500" />
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          {scan.productName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scan.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const status = getStatus(scan.healthScore);
                        return (
                          <span
                            className={cn('px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full', status.color)}
                          >
                            {status.text}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/product/${scan._id}`}>
                        <button className="text-blue-600 hover:text-blue-800">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {products.map((scan) => (
              <div
                key={scan._id?.toString()}
                className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Clock size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {scan.productName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(scan.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const status = getStatus(scan.healthScore);
                      return (
                        <span
                          className={cn('px-3 py-1 text-xs font-medium rounded-full', status.color)}
                        >
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
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Camera size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">No Products Scanned Yet</h3>
          <p className="mt-2 text-sm text-gray-500">Start by scanning a product to track its safety information</p>
          <Link href="/scan-product">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-all">
              <Camera size={18} />
              Scan Your First Product
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;