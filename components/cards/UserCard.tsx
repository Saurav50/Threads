"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const UserCard = ({
  userId,
  userName,
  userImage,
  name,
  personType,
}: {
  userId: string;
  userName: string;
  userImage: string;
  name: string;
  personType: string;
}) => {
  const router = useRouter();
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={userImage}
          alt="user_img"
          height={48}
          width={48}
          className="rounded-full object-contain"
        />
        <div className="flex-1">
          <h1 className="text-light-2 text-heading4-medium">{name}</h1>
          <p className="text-gray-1 text-tiny-medium">@{userName}</p>
        </div>

        <button
          className="user-card_btn p-1"
          onClick={() => router.push(`/profile/${userId}`)}
        >
          view
        </button>
      </div>
    </article>
  );
};

export default UserCard;
