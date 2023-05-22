import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import { PrismaClient, Cuisine, Location, PRICE, Review } from "@prisma/client";

const prisma = new PrismaClient();

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review;
}

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      slug: true,
      location: true,
      price: true,
      reviews: true,
    },
  });
  return restaurants;
};

const Home = async () => {
  const restaurant = await fetchRestaurants();
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap">
        {restaurant.map((restaurant) => (
          <RestaurantCard restaurant={restaurant} />
        ))}
      </div>
    </main>
  );
};

export default Home;
