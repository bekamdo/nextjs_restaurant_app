import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import React from "react";
import Header from "../components/Header";
import RestaurantNavBar from "../components/RestaurantNavBar";
import Title from "../components/Title";
import Ratings from "../components/Ratings";
import Description from "../components/Description";
import Menu from "../components/Menu";
import { PrismaClient } from "@prisma/client";

export const metadata = {
  title: "Menu of MileStones Grill(Toronto) | Open Table ",
  description: "This is an open table clone app",
};

const prisma = new PrismaClient();

const fetchRestuarantMenu = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant.items;
};

const RestaurantMenu = async ({ params }: { params: { slug: string } }) => {
  const menu = await fetchRestuarantMenu(params.slug);
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        <Menu menu={menu} />
      </div>
    </>
  );
};

export default RestaurantMenu;
