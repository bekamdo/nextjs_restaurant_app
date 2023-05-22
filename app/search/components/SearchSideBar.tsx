import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import React from "react";

const SearchSideBar = ({
  location,
  cuisine,
  searchParams,
}: {
  location: Location[];
  cuisine: Cuisine[];
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) => {
  return (
    <div className="w-1/5">
      <div className="border-b  pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {location.map((loc) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: loc.name,
              },
            }}
            className="font-light text-reg capitalize"
            key={loc.id}
          >
            {loc.name}
          </Link>
        ))}
      </div>
      <div className="border-b  pb-4 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisine.map((cuis) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: cuis.name,
              },
            }}
            className="font-light text-reg capitalize"
            key={cuis.id}
          >
            {cuis.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                price: PRICE.CHEAP,
              },
            }}
            className="border w-full text-reg font-light rounded-l p-2"
          >
            $
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                price: PRICE.REGULAR,
              },
            }}
            className="border-r border-t border-b w-full text-reg font-light  p-2"
          >
            $$
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                price: PRICE.EXPENSIVE,
              },
            }}
            className="border-r border-t border-b w-full text-reg font-light rounded-r p-2"
          >
            $$$
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchSideBar;
