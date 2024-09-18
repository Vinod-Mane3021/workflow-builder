import Navigation from "./navigation";
import Link from "next/link";
import Image from "next/image";
import { Blocks, Loader2 } from "lucide-react";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

const Logo = () => {
  return (
    <Link href="/" className="">
      <div className="items-center flex ">
        <Blocks className="text-primary size-5 lg:size-7" />
        <p className="font-semibold text-primary text-base ;g:text-2xl ml-2.5">
          Workflow Builder
        </p>
      </div>
    </Link>
  );
};

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-gray-200 shadow-md px-4 py-8 lg:px-14">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between ">
          <div className="flex items-center lg:gap-x-16 w-full ">
            <span className="hidden lg:flex">
              <Logo />
            </span>
            <Navigation />
            <span className="flex lg:hidden">
              <Logo />
            </span>
          </div>
          <>
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </ClerkLoading>
          </>
        </div>
      </div>
    </header>
  );
};

export default Header;
