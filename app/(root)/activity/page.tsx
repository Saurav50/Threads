import {
  fetchUser,
  getActivity,
  getLikeActivity,
} from "@/lib/actions/user.action";
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
  const Likeactivities = await getLikeActivity(userData._id);
  console.log(Likeactivities[0]);

  return (
    <section>
      <h1 className="head-text">Activity</h1>
      <h1 className="text-light-1 mt-5">Replies</h1>
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

      <h1 className="text-light-1 mt-10">Likes</h1>
      <div className="mt-10 flex flex-col gap-5">
        {Likeactivities && Likeactivities.length < 1 ? (
          <p className="text-light-1">No activities found...</p>
        ) : (
          Likeactivities &&
          Likeactivities.map((activity) => {
            const filteredLikedBy = activity.likedBy.filter(
              (likedBy: any) => likedBy.id !== userData.id
            );
            if (filteredLikedBy.length === 0) return; // Skip this activity if all likes are from the user
            return (
              <Link
                key={activity.threadId}
                href={`/thread/${activity.threadId}`}
                className="activity-card"
              >
                {filteredLikedBy.map((likedBy: any) => (
                  <div key={likedBy.id} className="flex items-center">
                    <div className="relative h-12 w-12">
                      <Image
                        src={likedBy.image}
                        alt="user_img"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex ml-2">
                      <h1 className="text-primary-500 mr-2">{likedBy.name}</h1>
                      <p className="text-light-2"> liked your thread</p>
                    </div>
                  </div>
                ))}
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
};

export default page;
