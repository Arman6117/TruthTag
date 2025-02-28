import { cn } from "@/lib/utils";
import React from "react";

const DashBoardCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-blue-200/40 md:w-[450px] flex justify-center items-center flex-col font-bold md:p-24 p-16 rounded-lg"
      , className)}
    >
      {children}
    </div>
  );
};

export default DashBoardCard;
