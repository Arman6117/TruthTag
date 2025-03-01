import React from "react";
import DashBoardCard from "./dashboard-card";
import {
  AwardIcon,
  BadgeCheckIcon,
  Cross,
  CrossIcon,
  LucideCamera,
  SquareCheckBig,
  UtensilsCrossedIcon,
  XIcon,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-10 ">
      <div className="flex md:flex-row flex-col flex-wrap  max-w-[2000px] xl:justify-center justify-between md:gap-6 xl:gap-20 gap-16 ">
        <DashBoardCard className="bg-blue-200/40">
          <span className="text-5xl flex gap-2 items-center ">
            <LucideCamera size={35} className="text-neutral-600 mt-1" />
            200
          </span>

          <h1 className="text-xs text-neutral-500">Total Products Scanned</h1>
        </DashBoardCard>
        <DashBoardCard className="bg-green-200/40">
          <span className="text-5xl flex gap-2 items-center">
            <BadgeCheckIcon size={35} className="text-neutral-600 mt-1" /> 100
            <span className="text-xs">/200</span>
          </span>
          <h1 className="text-xs text-neutral-500">Total Safe Products</h1>
        </DashBoardCard>
        <DashBoardCard className="bg-red-200/40">
          <span className="text-5xl flex gap-2 items-center">
            <XIcon size={35} className="text-neutral-600 mt-1" />
            100
          </span>
          <h1 className="text-xs text-neutral-500">Total Unsafe Products</h1>
        </DashBoardCard>
        <DashBoardCard className="bg-yellow-200/40">
          <span className="text-5xl flex gap-2 items-center">
            <AwardIcon size={35} className="text-neutral-600 mt-1" /> 100
            <span className="text-xs">/200</span>
          </span>
          <h1 className="text-xs text-neutral-500">Total Badges Earned</h1>
        </DashBoardCard>
      </div>
      <div className="flex flex-col">
        <h1 className="text-5xl font-bold">Recent Scans</h1>
        <div className="">
          Product List
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
