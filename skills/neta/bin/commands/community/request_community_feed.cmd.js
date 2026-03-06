import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const requestHomeFeedCmd = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        page_index: z
            .number()
            .int()
            .min(0)
            .optional()
            .default(0)
            .describe("页码，从 0 开始"),
        page_size: z
            .number()
            .int()
            .min(1)
            .max(40)
            .optional()
            .default(20)
            .describe("每页数量，最大 40"),
        theme: z
            .string()
            .optional()
            .describe("主题筛选，不传则为为你推荐。可选值：关注、最新、#游戏 等"),
        biz_trace_id: z
            .string()
            .optional()
            .describe("业务追踪 ID，用于分页时保持上下文一致，从上一次响应中获取"),
    }),
    outputSchema: z.object({
        module_list_header: z.unknown().nullable(),
        module_list: z.array(z.object({
            template_id: z.string(),
            module_id: z.string(),
            json_data: z.unknown(),
            data_id: z.string(),
        })),
        page_data: z.object({
            page_index: z.number(),
            page_size: z.number(),
            has_next_page: z.boolean(),
            biz_trace_id: z.string(),
        }),
    }),
}, async ({ page_index, page_size, theme, biz_trace_id }, { apis, log }) => {
    log.debug("request_home_feed: page_index: %s, page_size: %s, theme: %s, biz_trace_id: %s", page_index, page_size, theme || "推荐", biz_trace_id || "无");
    const response = await apis.feeds.homeList({
        page_index,
        page_size,
        theme,
        biz_trace_id,
    });
    return {
        module_list_header: response.data.module_list_header,
        module_list: response.data.module_list.map((module) => ({
            template_id: module.template_id,
            module_id: module.module_id,
            json_data: module.json_data,
            data_id: module.data_id,
        })),
        page_data: response.data.page_data,
    };
});
