import React from "react";

import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "@/components/cards/CommunityCard";
const page = async () => {
  const allCommunities = await fetchCommunities({
    sortBy: "desc",
    pageNumber: 1,
    searchText: "",
    pageSize: 30,
  });

  return (
    <div>
      <h1 className="text-light-1 text-heading3-bold"> Search community</h1>
      <div className="flex gap-8 mt-10">
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
