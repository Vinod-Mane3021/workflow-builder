"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const CustomBreadcrumb = () => {
  const pathname = usePathname();

  const currentPathname = pathname.split("/").slice(-1)[0]; // current page pathname

  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Construct URL segments
  const constructUrl = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  if (pathname == "/") {
    return null;
  }

  return (
    <div className="flex flex-row">
      <Breadcrumb aria-label="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={cn(
                    currentPathname == segment && "font-semibold text-gray-700"
                  )}
                  href={constructUrl(index)}
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CustomBreadcrumb;
