"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

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
      likes: [],
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
      .populate({ path: "likes", model: User, select: "id" })
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
          { path: "likes", model: User, select: "id" },
        ],
      })
      .populate({ path: "likes", model: User, select: "id" })
      .populate({ path: "community", model: Community });
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

export const likeThread = async (
  userId: string,
  threadId: string,
  path: string
) => {
  try {
    connectToDB();
    // Check if the user exists
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Update the thread's likes array to include the user's id
    thread.likes.push(user._id);
    await thread.save();
    revalidatePath(path);
    return { success: true, message: "Thread liked successfully" };
  } catch (error: any) {
    console.log(error.message);
  }
};
export const unlikeThread = async (
  userId: string,
  threadId: string,
  path: string
) => {
  try {
    connectToDB();

    // Check if the user exists
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Check if the user has liked the thread
    const userIndex = thread.likes.indexOf(user._id);
    if (userIndex === -1) {
      throw new Error("User has not liked this thread");
    }

    // Remove the user's id from the thread's likes array
    thread.likes.splice(userIndex, 1);
    await thread.save();
    revalidatePath(path);
    return { success: true, message: "Thread unliked successfully" };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
};
