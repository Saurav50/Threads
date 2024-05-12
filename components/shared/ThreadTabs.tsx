import { userThreads } from "@/lib/actions/user.action";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

const ThreadTabs = async ({
  userId,
  loggedInUserId,
  personType,
}: {
  userId: string;
  loggedInUserId: string;
  personType: string;
}) => {
  // fetch user threads

  let data;
  if (personType === "USER") data = await userThreads(userId);
  if (personType === "COMMUNITY") data = await fetchCommunityPosts(userId);
  console.log(data);

  return (
    <section className="mt-6 flex flex-col gap-8">
      {data &&
        data.threads.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={loggedInUserId || ""}
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))}
    </section>
  );
};

export default ThreadTabs;
