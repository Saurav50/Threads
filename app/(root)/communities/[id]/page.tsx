import UserProfileHeader from "@/components/shared/UserProfileHeader";

import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import Image from "next/image";
import ThreadTabs from "@/components/shared/ThreadTabs";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import UserCard from "@/components/cards/UserCard";

const page = async ({ params }: { params: { id: string } }) => {
  const toCommunityDetail = await fetchCommunityDetails(params.id);
  const loggedInUser = await currentUser();

  return (
    <div className="text-light-1">
      <UserProfileHeader
        userImage={toCommunityDetail.image}
        name={toCommunityDetail.name}
        username={toCommunityDetail.username}
        userId={toCommunityDetail.id}
        loggedInUserId={loggedInUser?.id || ""}
        bio={toCommunityDetail.bio}
      />
      <div className="mt-6 w-full">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
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
                    {toCommunityDetail.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads">
            <ThreadTabs
              userId={toCommunityDetail._id}
              loggedInUserId={loggedInUser?.id || ""}
              personType="COMMUNITY"
            />
          </TabsContent>
          <TabsContent value="members">
            <section className="mt-9 flex flex-col gap-10">
              {toCommunityDetail.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  userId={member.id}
                  userName={member.username}
                  name={member.name}
                  userImage={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
          <TabsContent value="requests">
            <ThreadTabs
              userId={toCommunityDetail._id}
              loggedInUserId={loggedInUser?.id || ""}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
