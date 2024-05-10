import CreateThread from "@/components/forms/CreateThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const userData = await fetchUser(user.id);
  //   check if not onboarded then redirect to onboarding
  if (!userData?.onBoarded) redirect("/onboarding");
  //   We have the user logged in and have his data ..lets create thread form
  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <CreateThread userId={userData._id} />
    </>
  );
};

export default page;
