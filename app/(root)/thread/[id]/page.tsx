import ThreadCard from "@/components/cards/ThreadCard";
import CommentForm from "@/components/forms/CommentForm";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  const userData = await fetchUser(user.id);
  //   check if not onboarded then redirect to onboarding
  if (!userData?.onBoarded) redirect("/onboarding");
  //   fetch thread data

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
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
          likes={thread.likes}
        />
      </div>
      <div className="mt-7 text-light-1">
        <CommentForm
          threadId={thread._id}
          currentUserImage={userData.image}
          currentUserId={JSON.stringify(userData._id)}
        />
      </div>
      <div>
        {/* fetch comments */}
        {thread.children.map((child: any) => (
          <ThreadCard
            key={child._id}
            id={child._id}
            currentUserId={user?.id || ""}
            parentId={child.parentId}
            content={child.text}
            author={child.author}
            community={child.community}
            createdAt={child.createdAt}
            comments={child.children}
            isComment
            likes={child.likes}
          />
        ))}
      </div>
    </section>
  );
};
export default page;
