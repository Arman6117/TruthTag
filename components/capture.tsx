import { CameraIcon, ScanIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const Capture = () => {
  return (
    <button  className="absolute size-16 bottom-20 right-20  rounded-md bg-blue-500 flex items-center justify-center">
      <CameraIcon className="text-white  " size={35} />
    </button>
  );
};

export default Capture;
