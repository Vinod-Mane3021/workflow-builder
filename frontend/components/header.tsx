import Navigation from "./navigation";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center lg:gap-x-16">
            {/* logo */}
            <Link href="/">
              <div className="items-center hidden lg:flex">
                <Image src="/logo.svg" alt="logo" height={28} width={28} />
                <p className="font-semibold text-white text-2xl ml-2.5">
                  Finance
                </p>
              </div>
            </Link>
            <Navigation />
          </div>
          <p>Use Button</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
