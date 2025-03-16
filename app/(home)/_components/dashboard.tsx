import React from "react";
import {
  AwardIcon,
  Camera,
  ArrowUpRight,
  ChevronRight,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import DashBoardCard from "./dashboard-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dbConnect from "@/lib/db";
import { getAllUserReport } from "@/actions/db";

// Assuming DashboardCard is a simple wrapper component
// const DashBoardCard = ({ children, className }) => {
//   return (
//     <div className={`p-6 flex-1 flex flex-col justify-between ${className}`}>
//       {children}
//     </div>
//   );
// };

const Dashboard =async () => {
  // Sample recent scans data
  // await dbConnect().then(()=> console.log("COnnected"))
// console.log(res)
  // const recentScans = [
  //   { id: 1, name: "Organic Apple Juice", date: "Mar 1, 2025", status: "safe" },
  //   {
  //     id: 2,
  //     name: "Chocolate Cookies",
  //     date: "Feb 28, 2025",
  //     status: "unsafe",
  //   },
  //   { id: 3, name: "Almond Milk", date: "Feb 27, 2025", status: "safe" },
  //   { id: 4, name: "Granola Bar", date: "Feb 26, 2025", status: "unsafe" },
  // ];
const data = await getAllUserReport()
console.log(data.data)
  return (
    <div className="flex flex-col gap-10 p-6">
      <div className="flex justify-between items-center">
        <h1 className="md:text-3xl text-wrap text-xl  font-bold text-gray-800">
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
          <span className="text-5xl font-semibold text-blue-700">200</span>
          <div>
            <h2 className="text-sm font-medium text-gray-600">
              Total Products Scanned
            </h2>
            <div className="text-xs text-blue-600 mt-1 flex items-center">
              <ArrowUpRight size={14} />
              <span>12% from last month</span>
            </div>
          </div>
        </DashBoardCard>

        <DashBoardCard className="bg-green-50 rounded-lg hover:shadow-md transition-all h-40">
          <div className="flex items-baseline">
            <span className="text-5xl font-semibold text-green-700">100</span>
            <span className="text-sm text-green-600 ml-2">/200</span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">Safe Products</h2>
            <div className="mt-2 bg-gray-200 h-1 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
        </DashBoardCard>

        <DashBoardCard className="bg-red-50 rounded-lg hover:shadow-md transition-all h-40">
          <div className="flex items-baseline">
            <span className="text-5xl font-semibold text-red-700">100</span>
            <span className="text-sm text-red-600 ml-2">/200</span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">
              Unsafe Products
            </h2>
            <div className="mt-2 bg-gray-200 h-1 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
        </DashBoardCard>

        <DashBoardCard className="bg-amber-50 rounded-lg hover:shadow-md transition-all h-40">
          <div className="flex items-center">
            <span className="text-5xl font-semibold text-amber-700">15</span>
            <AwardIcon size={28} className="text-amber-600 ml-2" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">Badges Earned</h2>
            <div className="text-xs text-amber-600 mt-1">
              <span>3 new badges this month</span>
            </div>
          </div>
        </DashBoardCard>
      </div>

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
              {data.data?.map((scan) => (
                <tr
                  key={scan._id as string}
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
                    {/* {scan.createdAt} */}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {scan.status === "safe" ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                        Safe
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
                        Unsafe
                      </span>
                    )}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {data.data?.map((scan) => (
            <div
              key={scan._id as string}
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
                    <div className="text-xs text-gray-500">{scan.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* {scan.status === "safe" ? (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Safe
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Unsafe
                    </span>
                  )} */}
                  <div className="relative">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {false && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Camera size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">No Products Scanned Yet</h3>
          <p className="mt-2 text-sm text-gray-500">Start by scanning a product to track its safety information</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-all">
            <Camera size={18} />
            Scan Your First Product
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
