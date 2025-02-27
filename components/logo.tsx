import { TagIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className="flex  gap-2 items-center ">
      <h1 className="font-bold text-2xl">
        Truth<span className="text-blue-600 ">Tag</span>
      </h1>
      <TagIcon className="text-blue-600 " size={25} />
    </Link>
  );
};

export default Logo;
