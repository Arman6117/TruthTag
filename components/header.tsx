import React from "react";
import Logo from "./logo";
import SearchInput from "./search-input";
import UserAvatar from "./user-avatar";

import Navbar from "./navbar";

const Header = () => {
  return (
    <div className="flex flex-col gap-5 ">
      <div className="flex w-full justify-between">
        <Logo />
        <div className="flex gap-2 items-center">
          <SearchInput />
        </div>
        <UserAvatar />
      </div>

      <Navbar />
    </div>
  );
};

export default Header;
