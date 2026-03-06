import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

export const createCommentCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      content: z
        .string()
        .min(1)
        .max(500)
        .describe("评论内容，最少 1 个字，最多 500 字"),
      parent_uuid: z
        .string()
        .describe("父级对象 UUID（作品、角色或元素 UUID）"),
      parent_type: z
        .enum(["collection", "character", "elementum"])
        .describe(
          "父级对象类型：collection-作品，character-角色，elementum-元素",
        ),
      at_users: z
        .string()
        .optional()
        .default("")
        .describe(
          "@的用户 UUID 列表，使用逗号分隔（可选，例如：uuid1,uuid2,uuid3）",
        ),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      comment_uuid: z.string().optional().describe("评论 UUID，发布成功时返回"),
      message: z.string(),
    }),
  },
  async ({ content, parent_uuid, parent_type, at_users }, { apis, log }) => {
    log.debug(
      "create_comment: content: %s, parent_uuid: %s, parent_type: %s, at_users: %s",
      content,
      parent_uuid,
      parent_type,
      at_users,
    );

    log.info(
      "create_comment: 对%s %s 发布评论：%s",
      parent_type,
      parent_uuid,
      content,
    );

    // 将逗号分隔的字符串转换为数组
    const atUsersArray = at_users
      ? at_users
          .split(",")
          .map((uuid) => uuid.trim())
          .filter(Boolean)
      : [];

    const result = await apis.collection.createComment({
      content,
      parent_uuid,
      parent_type,
      at_users: atUsersArray,
    });

    if (!result.success) {
      throw new Error("评论发布失败");
    }

    return {
      success: true,
      comment_uuid: result.comment?.uuid,
      message: "评论发布成功",
    };
  },
);
