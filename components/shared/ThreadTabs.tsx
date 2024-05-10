import { userThreads } from "@/lib/actions/user.action";
import ThreadCard from "../cards/ThreadCard";

const ThreadTabs = async ({
  userId,
  loggedInUserId,
}: {
  userId: string;
  loggedInUserId: string;
}) => {
  // fetch user threads
  const data = await userThreads(userId);
  console.log("hi");
  console.log(data);

  return (
    <section className="mt-6 flex flex-col gap-8">
      {data.threads.map((thread: any) => (
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
