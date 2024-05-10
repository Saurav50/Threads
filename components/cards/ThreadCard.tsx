import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string;
  content: string | null;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    image: string;
    name: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}
const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`text-light-1 flex  gap-3 p-5  rounded-md ${
        isComment ? "px-0 sm:px-7 " : "bg-dark-2"
      } `}
    >
      <div className="flex items-start justify-between ">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="author"
                fill
                className="rounded-full"
              />
            </Link>
            <div className="thread-card_bar"></div>
          </div>
          <div className="flex flex-col w-full ">
            <span className="text-base-semibold text-light-1">
              <Link
                href={`/profile/${author.id}`}
                className="relative h-11 w-11"
              >
                {" "}
                {author.name}
              </Link>
            </span>
            <span className="text-small-regular text-light-2">{content}</span>
            <div className="mt-5 flex flex-col gap-3.5">
              <div className="flex gap-3">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
            </div>
          </div>
          {isComment && comments.length > 0 && (
            <Link href={`thread/${id}`}>
              <p className="mt-1 text-gray-1 text-subtle-medium">
                {comments.length} replies
              </p>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
