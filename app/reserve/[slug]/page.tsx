import React from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { parse } from "url";
import { NextRequest } from "next/server";

export const metadata = {
  title: "Reserve at MileStones Grill(Toronto) | Open Table ",
  description: "This is an open table clone app",
};

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }
  return restaurant;
};
const RestaurantReserve = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) => {
  const { date, partySize } = searchParams;

  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={date}
          partySize={partySize}
        />
        <Form date={date} partySize={partySize} slug={params.slug} />
      </div>
    </div>
  );
};

export default RestaurantReserve;
