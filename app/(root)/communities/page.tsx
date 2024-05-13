import React from "react";

import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "@/components/cards/CommunityCard";
import Searchbar from "@/components/shared/SearchBar";
const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const allCommunities = await fetchCommunities({
    sortBy: "desc",
    pageNumber: 1,
    searchText: searchParams.q ? searchParams.q : "",
    pageSize: 30,
  });

  return (
    <div>
      <h1 className="text-light-1 text-heading3-bold mb-10">
        {" "}
        Search community
      </h1>
      <Searchbar routeType="communities" />

      <div className="flex flex-wrap gap-8 mt-10">
        {allCommunities.communities.length < 1 ? (
          <p>No community found!</p>
        ) : (
          allCommunities.communities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              username={community.username}
              imgUrl={community.image}
              name={community.name}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default page;
