import Link from "next/link";
import React from "react";

import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantCard from "./components/RestaurantCard";
import { PRICE, PrismaClient } from "@prisma/client";

export const metadata = {
  title: "Search Restaurants OpenTable",
  description: "This is an open table clone app",
};

const prisma = new PrismaClient();

interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const fetchRestaurantByCity = async (searchParams: SearchParams) => {
  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }
  // prisma.restaurant.findMany({
  //   where: {
  //     location: {
  //       name: {
  //         equals: "toronto",
  //       },
  //     },
  //     cuisine: {
  //       name: {
  //         equals: "mexican",
  //       },
  //     },
  //     price: {
  //       equals: PRICE.CHEAP,
  //     },
  //   },
  // });
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};
const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};
const Search = async ({ searchParams }: { searchParams: SearchParams }) => {
  const restaurants = await fetchRestaurantByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <Header />

      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          location={locations}
          cuisine={cuisines}
          searchParams={searchParams}
        />

        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <RestaurantCard restaurant={restaurant} />
              ))}
            </>
          ) : (
            <p>Sorry we found no restaurant in this area</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
