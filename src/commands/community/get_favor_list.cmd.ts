import { Type } from "@sinclair/typebox";
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

export const getFavorListCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      cursor_id: Type.Integer({ minimum: 0, default: 0 }),
      page_size: Type.Integer({ minimum: 1, maximum: 50, default: 20 }),
    }),
  },
  async ({ cursor_id, page_size }, { apis }) => {
    const result = await apis.collection.getFavorList({
      cursor_id,
      page_size,
    });

    return {
      cursor_id,
      page_size,
      items: result.items,
      has_next: result.has_next,
      next_cursor: result.next_cursor,
      biz_trace_id: result.biz_trace_id ?? null,
    };
  },
);
