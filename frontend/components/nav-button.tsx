import { NavButtonProps } from "@/types/button";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NavButton = ({ href, label, icon, isActive }: NavButtonProps) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        "w-full lg:w-auto gap-2 justify-between font-normal hover:bg-primary/20 hover:text-primary border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-primary focus:bg-primary/30 transition duration-300",
        isActive ? "bg-primary/10 text-primary" : "bg-transparent" 
      )}
    >
      <span className='size-4'>{icon}</span>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
