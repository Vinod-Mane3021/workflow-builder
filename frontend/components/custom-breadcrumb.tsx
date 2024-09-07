"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Props = {
  skipLast?: number;
};

const CustomBreadcrumb = ({ skipLast }: Props) => {
  const pathname = usePathname();

  const currentPathname = pathname.split("/").slice(-1)[0]; // current page pathname

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const filteredPathSegments = pathSegments.slice(0, skipLast && -1 * skipLast);

  const path = skipLast && skipLast > 0 ? filteredPathSegments : pathSegments;

  // Construct URL segments
  const constructUrl = (index: number) => {
    if (skipLast && skipLast > 0 && index === path.length - 1) return;
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
          {path.map((segment, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={cn(
                    index === path.length - 1 && "font-semibold text-gray-700"
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
