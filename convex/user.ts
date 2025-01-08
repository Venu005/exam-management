import { v } from "convex/values";
import { mutation } from "./_generated/server";

//mutation
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args_0) => {
    //check for existing user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args_0.clerkId))
      .unique();

    if (existingUser) {
      console.log("User already exists");
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args_0.email,
      name: args_0.name,
      clerkId: args_0.clerkId,
    });

    return userId;
  },
});
