import { fetchUser, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  const userData = await fetchUser(user.id);
  //   check if not onboarded then redirect to onboarding
  if (!userData?.onBoarded) redirect("/onboarding");
  //   get activity of ur account
  const activities = await getActivity(userData._id);

  return (
    <section>
      <h1 className="head-text">Activity</h1>
      <div className="mt-10 flex flex-col gap-5">
        {activities && activities.length < 1 ? (
          <p>No activities found...</p>
        ) : (
          activities &&
          activities.map((activity) => (
            <Link
              href={`/thread/${activity.parentId}`}
              className="activity-card"
            >
              <div key={activity.id} className="relative h-12 w-12">
                <Image
                  src={activity.author.image}
                  alt="user_img"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex ">
                <h1 className="text-primary-500 ml-2 mr-2">
                  {activity.author.name}
                </h1>
                <p className="text-light-2">replied to your thread</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default page;
