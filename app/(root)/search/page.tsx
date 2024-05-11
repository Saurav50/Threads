import { fetchAllUsers } from "@/lib/actions/user.action";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import UserCard from "@/components/cards/UserCard";
const page = async () => {
  const user = await currentUser();

  const allUsers = await fetchAllUsers({
    userId: user ? user.id : "",
    sortBy: "desc",
    pageNumber: 1,
    searchText: "s",
    pageSize: 30,
  });

  return (
    <div>
      <h1 className="text-light-1 text-heading3-bold"> Search User</h1>
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
