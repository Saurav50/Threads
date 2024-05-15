import Image from "next/image";
import Link from "next/link";

const UserProfileHeader = ({
  userImage,
  name,
  username,
  userId,
  loggedInUserId,
  bio,
}: {
  userImage: string;
  name: string;
  username: string;
  userId: string;
  loggedInUserId: string;
  bio: string;
}) => {
  return (
    <div className="flex flex-col w-full justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20  object-cover">
            <Image
              src={userImage}
              alt="user_img"
              fill
              className="rounded-full  shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className=" text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-gray-1 font-medium">{`@${username}`}</p>
          </div>
        </div>
        {userId === loggedInUserId && (
          <Link href="/profile/edit">
            <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
              <Image
                src="/assets/edit.svg"
                alt="logout"
                width={16}
                height={16}
              />

              <p className="text-light-2 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
      </div>

      <p className="mt-6 text-light-2 max-w-lg text-base-regular">{bio}</p>
      <div className="h-0.5 mt-12 w-full bg-dark-3"></div>
    </div>
  );
};

export default UserProfileHeader;
