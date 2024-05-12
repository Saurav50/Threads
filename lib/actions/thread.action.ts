"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import path from "path";
import { useOrganization } from "@clerk/nextjs";
import Community from "../models/community.model";

export const createThreadDB = async ({
  text,
  author,
  communityId,
  path,
}: {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}) => {
  connectToDB();

  try {
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );
    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });
    // update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    console.log(error.message);
  }
};

// implementing pagination also
export const getThreads = async (pageNumber = 1, pageSize = 20) => {
  connectToDB();
  const skipPage = (pageNumber - 1) * pageSize;
  try {
    const data = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipPage)
      .limit(pageSize)
      .populate({ path: "author", model: "User" })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      })
      .populate({ path: "community", model: Community });
    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts
    const isNext = totalPostsCount > skipPage + data.length;
    return { data, isNext };
  } catch (error: any) {
    console.log(error.message);
  }
};

export const fetchThreadById = async (id: string) => {
  connectToDB();
  try {
    const fetchedThread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      });
    return fetchedThread;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const postComment = async (
  threadId: string,
  userID: string,
  commentText: string,
  path: string
) => {
  connectToDB();
  try {
    const ParentThread = await Thread.findById(threadId);
    if (!ParentThread) return null;
    // create comment thread
    const createdThread = await Thread.create({
      text: commentText,
      author: userID,
      parentId: threadId,
    });

    // update original threads children

    ParentThread.children.push(createdThread._id);
    await ParentThread.save();
    revalidatePath(path);
  } catch (error: any) {
    console.log(error.message);
  }
};
