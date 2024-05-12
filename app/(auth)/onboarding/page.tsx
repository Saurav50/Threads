import Profile from "@/components/forms/Profile";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  // fetch user data from your mongo database
  const userInfo = await fetchUser(user?.id || "");
  if (userInfo && userInfo.onBoarded) {
    redirect("/");
  }

  const userData = {
    id: user?.id || "",
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName,
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };
  return (
    <main className="mx-auto flex flex-col justify-start max-w-3xl px-10 py-20">
      <h1 className="head-text">OnBoarding</h1>
      <p className="text-light-2 text-base-regular mt-3">
        Complete your profile now...
      </p>
      <section className="mt-10 bg-dark-2 p-10">
        <Profile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default page;
