"use client";
import Image from "next/image";
import { likeThread, unlikeThread } from "@/lib/actions/thread.action";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Heart = ({
  isLikedByUser,
  userId,
  threadId,
}: {
  isLikedByUser: boolean;
  userId: string;
  threadId: string;
}) => {
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const path = usePathname();

  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        const response = await unlikeThread(userId, threadId, path);
        if (response?.success) {
          setIsLiked(false);
        } else {
          console.error(response?.message);
        }
      } else {
        const response = await likeThread(userId, threadId, path);
        if (response?.success) {
          setIsLiked(true);
        } else {
          console.error(response?.message);
        }
      }
    } catch (error: any) {
      console.error("Error toggling like:", error?.message);
    }
  };

  return (
    <Image
      src={isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={handleToggleLike}
    />
  );
};

export default Heart;
