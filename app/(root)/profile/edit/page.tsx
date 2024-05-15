import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.action";
import Profile from "@/components/forms/Profile";

// Copy paste most of the code as it is from the /onboarding

async function Page() {
  const user = await currentUser();
  // fetch user data from your mongo database
  const userInfo = await fetchUser(user?.id || "");
  if (userInfo && !userInfo.onBoarded) {
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
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12">
        <Profile user={userData} btnTitle="Continue" />
      </section>
    </>
  );
}

export default Page;
