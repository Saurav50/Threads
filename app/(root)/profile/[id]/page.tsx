import UserProfileHeader from "@/components/shared/UserProfileHeader";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadTabs from "@/components/shared/ThreadTabs";

const page = async ({ params }: { params: { id: string } }) => {
  const toViewUserData = await fetchUser(params.id);
  const loggedInUser = await currentUser();
  console.log(toViewUserData);
  return (
    <div className="text-light-1">
      <UserProfileHeader
        userImage={toViewUserData.image}
        name={toViewUserData.name}
        username={toViewUserData.username}
        userId={toViewUserData.id}
        loggedInUserId={loggedInUser?.id || ""}
        bio={toViewUserData.bio}
      />
      <div className="mt-6 w-full">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger value={tab.value} className="tab items-center">
                <Image
                  src={tab.icon}
                  alt="icon"
                  height={24}
                  width={24}
                  className="object-contain"
                />
                <p className="hidden sm:block"> {tab.label}</p>
                {/* add amount of threads user had posted till now */}
                {tab.label === "Threads" && (
                  <p className="rounded-full bg-purple-900 px-2 py-1 text-tiny-medium ml-2">
                    {toViewUserData.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent value={tab.value}>
              <ThreadTabs
                userId={toViewUserData.id}
                loggedInUserId={loggedInUser?.id || ""}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default page;
