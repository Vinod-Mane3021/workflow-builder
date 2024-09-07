import Navigation from "./navigation";
import Link from "next/link";
import Image from "next/image";
import { Blocks } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-gray-200 shadow-md px-4 py-8 lg:px-14">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center lg:gap-x-16">
            {/* logo */}
            <Link href="/">
              <div className="items-center hidden lg:flex">
                <Blocks className="text-primary size-7" />
                <p className="font-semibold text-primary text-2xl ml-2.5">
                  Workflow Builder
                </p>
              </div>
            </Link>
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
