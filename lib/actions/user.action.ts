"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import path from "path";
import { SortOrder } from "mongoose";
import Community from "../models/community.model";

export const updateUser = async ({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: {
  userId: String;
  username: String;
  name: String;
  image: String;
  bio: String;
  path: string;
}): Promise<void> => {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onBoarded: true,
      },
      {
        upsert: true,
      }
    );
    if (path === "/profile/edit") revalidatePath(path);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const fetchUser = async (userId: string) => {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // later will populate communities
  } catch (error: any) {
    console.log(error.message);
  }
};

export const userThreads = async (userId: string) => {
  try {
    connectToDB();
    return await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "id name image",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
        {
          path: "community",
          model: Community,
        },
      ],
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const fetchAllUsers = async ({
  userId,
  searchText,
  sortBy = "desc",
  pageNumber = 1,
  pageSize,
}: {
  userId: string;
  searchText: string;
  sortBy: SortOrder;
  pageNumber: number;
  pageSize: number;
}) => {
  const skipUsers = (pageNumber - 1) * pageSize;
  const data = await User.find({
    $and: [
      { id: { $ne: userId } },
      searchText
        ? {
            $or: [{ username: { $regex: new RegExp(searchText, "i") } }],
          }
        : {},
    ],
  })
    .sort({ createdAt: sortBy })
    .skip(skipUsers)
    .limit(pageSize);
  return { data };
};

export const getActivity = async (userId: string) => {
  try {
    connectToDB();
    // get all threads created by the user
    const userThreads = await Thread.find({ author: userId });
    // Merge all children IDs into one array
    const allCommentsIds = userThreads.reduce((acc, thread) => {
      acc.push(...thread.children);
      return acc;
    }, []);
    // Get all children threads excluding comments made by the user
    const allChildrenThreads = await Thread.find({
      _id: { $in: allCommentsIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "_id id image name username",
    });
    return allChildrenThreads;
  } catch (error: any) {
    console.log(error.message);
  }
};
