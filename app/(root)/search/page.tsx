import { fetchAllUsers } from "@/lib/actions/user.action";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/SearchBar";
const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();

  const allUsers = await fetchAllUsers({
    userId: user ? user.id : "",
    sortBy: "desc",
    pageNumber: 1,
    searchText: searchParams.q ? searchParams.q : "",
    pageSize: 30,
  });

  return (
    <div>
      <h1 className="text-light-1 text-heading3-bold mb-10"> Search User</h1>
      <Searchbar routeType="search" />
      <div className="flex flex-col gap-10 mt-10">
        {allUsers.data.length < 1 ? (
          <p>No user found!</p>
        ) : (
          allUsers.data.map((user) => (
            <UserCard
              key={user.id}
              userId={user.id}
              userName={user.username}
              userImage={user.image}
              name={user.name}
              personType="User"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default page;
