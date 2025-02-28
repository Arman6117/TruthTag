import React from "react";
import DashBoardCard from "./dashboard-card";
import { LucideCamera } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col  ">
      <div className="flex md:flex-row flex-col flex-wrap  max-w-[2000px] xl:justify-center justify-between md:gap-6 xl:gap-20 gap-16 ">
        <DashBoardCard className="bg-blue-200/40">
          <span className="text-5xl flex gap-2 items-center ">
            
            <LucideCamera size={35} className="text-neutral-600" />
            200
          </span>

          <h1 className="text-xs text-neutral-500">Total Products Scanned</h1>
        </DashBoardCard>
        <DashBoardCard className="bg-green-200/40">
          <span className="text-5xl">
            100<span className="text-xs">/200</span>
          </span>
          <h1 className="text-xs text-neutral-500">Total Safe Products</h1>
        </DashBoardCard>
        <DashBoardCard className="bg-red-200/40">
          <span className="text-5xl">
            100<span className="text-xs">/200</span>
          </span>
          <h1 className="text-xs text-neutral-500">Total Unsafe Products</h1>
        </DashBoardCard>
      </div>
    </div>
  );
};

export default Dashboard;
