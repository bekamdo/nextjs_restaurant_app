import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import React from "react";
import Header from "./components/Header";
import Title from "./components/Title";
import Images from "./components/Images";
import RestaurantNavBar from "./components/RestaurantNavBar";
import Ratings from "./components/Ratings";
import Description from "./components/Description";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import { PrismaClient, Review } from "@prisma/client";

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  open_time: string;
  close_time: string;
  slug: string;
  reviews: Review[];
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    throw new Error("Cannot find restaurant");
  }

  return restaurant;
};

export const metadata = {
  title: "MileStones Grill(Toronto) | Open Table ",
  description: "This is an open table clone app",
};

const RestaurantDetails = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Ratings reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={restaurant.slug}
        />
      </div>
    </>
  );
};

export default RestaurantDetails;
