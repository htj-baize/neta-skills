import { Type } from "@sinclair/typebox";
import type { FeedMainList } from "../../apis/collection.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
  }),
  import.meta,
);

export const requestCommunityFeedInputSchema = Type.Object({
  page_index: Type.Integer({
    minimum: 0,
    default: 0,
    description: "Page index, starting from 0.",
  }),
  page_size: Type.Integer({
    minimum: 1,
    maximum: 40,
    default: 20,
    description: "Page size, between 1 and 40.",
  }),
  theme: Type.Union(
    [Type.Literal("关注"), Type.Literal("热门"), Type.Literal("最新")],
    {
      default: "热门",
      description:
        "Home feed theme. 关注 = followed creators, 热门 = hot recommendations, 最新 = latest works.",
    },
  ),
  biz_trace_id: Type.Optional(
    Type.String({
      description:
        "Trace ID returned by the previous page for consistent pagination.",
    }),
  ),
});

export const requestCommunityFeed = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: requestCommunityFeedInputSchema,
  },
  async (params, { apis }) => {
    const result: FeedMainList = await apis.feeds.homeList({
      page_index: params.page_index,
      page_size: params.page_size,
      theme: params.theme,
      biz_trace_id: params.biz_trace_id,
    });

    return {
      module_list_header: result.module_list_header,
      module_list: result.module_list,
      page_data: result.page_data,
    };
  },
);
