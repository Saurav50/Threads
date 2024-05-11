import ThreadCard from "@/components/cards/ThreadCard";
import { getThreads } from "@/lib/actions/thread.action";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const response = await getThreads(1, 30);

  return (
    <>
      <h1 className="head-text text-left text-white">Home</h1>
      <section className="mt-10 flex flex-col gap-9">
        {response?.data.length === 0 ? (
          <p className="no-result">No threads have been posted yet!</p>
        ) : (
          response?.data.map((thread) => (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={user?.id || ""}
              parentId={thread.parentId}
              content={thread.text}
              author={thread.author}
              community={thread.community}
              createdAt={thread.createdAt}
              comments={thread.children}
            />
          ))
        )}
      </section>
    </>
  );
}
