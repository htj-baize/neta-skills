# 社区个性化内容（collection, activity）推荐信息流
**功能**
获取社区个性化内容（collection, activity）推荐信息流，支持分页和hash筛选
- 不传 theme 参数：个性化热门推荐
- theme=关注：关注的用户发布的内容
- theme=最新：最新发布的内容
- theme=#游戏：带标签的主题内容
  parameters:
  page_index: 页码，从 0 开始（可选，默认为 0）
  page_size: 每页数量，最大 40（可选，默认为 20）
  theme: 主题筛选，不传则为热门推荐。可选值：关注、最新、#游戏 等
  biz_trace_id: 业务追踪 ID，用于分页时保持上下文一致，从上一次响应的 page_data.biz_trace_id 中获取

**个性化热门推荐**
```bash
pnpm start request_community_feed --page_index 0 --page_size 20
```

**获取最新内容推荐**
```bash
pnpm start request_community_feed --theme 最新 --page_index 0 --page_size 20
```

**获取关注内容推荐**
```bash
pnpm start request_community_feed --theme 关注 --page_index 0 --page_size 20
```

**获取带标签(hashtag)的内容推荐**
```bash
pnpm start request_community_feed --theme 游戏 --page_index 0 --page_size 20
```
