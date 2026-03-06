# 社区内容&互动玩法推荐

## 概述

本指南介绍 Neta 社区内容&互动玩法推荐技能的完整使用方法。

## 核心技能列表

### 1. 内容推荐类

#### request_community_feed - 获取社区推荐信息流

**定位：** 更聚焦于浏览内容推荐

**特点：** 纯粹的内容推荐，不支持互动玩法

最常用的推荐接口，支持个性化推荐和主题筛选。

**核心参数：**
- `page_index`: 页码（从 0 开始）
- `page_size`: 每页数量（最大 40）
- `theme`: 主题筛选
  - 不传：个性化推荐
  - `关注`：关注的用户内容
  - `最新`：最新发布
  - `#标签名`：带标签的内容
- `biz_trace_id`: 业务追踪 ID（翻页时传递上一次返回的值）

**典型用法：**

```bash
# 获取社区首页的热门个性化推荐内容
pnpm start request_community_feed --page_index 0 --page_size 20

# 获取社区最新内容
pnpm start request_community_feed --theme 最新 --page_index 0 --page_size 20

# 获取关注的内容
pnpm start request_community_feed --theme 关注 --page_index 0 --page_size 20

# 获取特定标签下的内容
pnpm start request_community_feed --theme "#游戏" --page_index 0 --page_size 20
```

#### request_interactive_feed - 获取互动玩法推荐列表

**定位：** 更聚焦于玩法推荐

**特点：** 支持互动玩法，功能更强大

更强大的推荐接口，支持多种场景自动判断和互动玩法。

**场景自动判断机制：**
- 提供 `collection_uuid` → 进入相关性场景（作品相关推荐）
- 提供 `target_user_uuid` → 进入个人主页场景
- 无特殊参数 → 默认首页互动流主模式

**典型用法：**

```bash
# 获取首页互动推荐
pnpm start request_interactive_feed --page_index 0 --page_size 10

# 获取目标作品详情
pnpm start read_collection --uuid "目标作品 UUID"

# 获取相似作品推荐
pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID"

# 查看用户个人主页
pnpm start request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "用户 UUID"

# 查看评论区子作品
pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 20 \
  --scene 'relation_feed_same' \
  --collection_uuid "父作品 UUID"
  
# 查看某个作品的原作以及所有同款二创作品
pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 20 \
  --scene 'relation_feed_child' \
  --target_collection_uuid "父作品 UUID" \
  --collection_uuid "目标作品 UUID"
```

## 关键概念

### 1. biz_trace_id 的正确使用

**核心原则：**
- **翻页时**：使用上一次返回的 biz_trace_id
- **切换场景时**：不传或清空 biz_trace_id（开启新会话）
- **后端行为**：服务端会透传 biz_trace_id，也可能根据业务逻辑自动清除或重置

✅ **正确的使用流程：**

```bash
# ===== 场景 1：浏览首页推荐 =====

# 第 1 次请求（首页）
pnpm start request_community_feed \
  --page_index 0 \
  --page_size 10 > /tmp/page0.json

# 从返回结果中提取 biz_trace_id
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# 第 2 次请求（下一页）- 使用上一次的 biz_trace_id
pnpm start request_community_feed \
  --page_index 1 \
  --page_size 10 \
  --biz_trace_id "$BIZ_TRACE_ID"

# 第 3 次请求 - 继续使用上一次的 biz_trace_id
pnpm start request_community_feed \
  --page_index 2 \
  --page_size 10 \
  --biz_trace_id "$BIZ_TRACE_ID"

# ===== 切换场景：查看相似作品 =====
# 此时需要清除 biz_trace_id，开启新会话
# request_interactive_feed 的特殊场景从 page_index=1 开始（获取相关推荐）
pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID"
# 不传 biz_trace_id，让服务端生成新的

# 获取新场景的 biz_trace_id
NEW_BIZ_TRACE_ID=$(pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID" | jq -r '.page_data.biz_trace_id')

# 继续在新场景下翻页（从第 2 页开始）
pnpm start request_interactive_feed \
  --page_index 2 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID" \
  --biz_trace_id "$NEW_BIZ_TRACE_ID"
```

---

❌ **错误示例：切换场景时不清除 biz_trace_id**

```bash
# 场景 1：浏览首页
pnpm start request_community_feed --page_index 0 > /tmp/home.json
HOME_BIZ_TRACE=$(cat /tmp/home.json | jq -r '.page_data.biz_trace_id')

# 场景 2：查看个人主页（错误：继续使用了首页的 biz_trace_id）
pnpm start request_interactive_feed \
  --page_index 0 \
  --target_user_uuid "user-uuid" \
  --biz_trace_id "$HOME_BIZ_TRACE"  # ❌ 不应该传递！
```

**后果：** 服务端可能无法正确识别新场景，导致推荐结果混乱。

**注意：** 后端可能会在某些情况下自动清除 biz_trace_id（例如检测到场景变化、会话超时等），所以前端应该以服务端返回的为准。

### 2. page_index 的语义

**request_community_feed：**
- **page_index = 0**: 第 1 页（首屏）
- **page_index > 0**: 后续分页（第 2 页、第 3 页...）

**request_interactive_feed：**
- **page_index = 0**: 通常用于获取详情或首屏（如个人主页、原作及同款）
- **page_index > 0**: 用于获取相关推荐（从第 2 页开始）

### 3. parent_type 的使用

评论时需要根据评论对象指定正确的类型：
- `collection`: 作品（主评论）
- `comment`: 评论（回复某条评论）

## 性能优化建议

### 1. 合理设置 page_size

- **首页浏览**: 10-20（平衡加载速度和流量）
- **个人主页**: 20-30（用户有明确目的）
- **相关推荐**: 10-15（快速试错）
- **单个详情**: 1（只获取一个）

### 2. 缓存策略

```bash
# 缓存推荐结果
pnpm start request_community_feed --page_index 0 > /tmp/feed_cache.json

# 使用缓存
cat /tmp/feed_cache.json | jq '.module_list'
```

### 3. 预加载策略

```bash
# 获取当前页
pnpm start request_community_feed --page_index 0 > /tmp/page0.json &

# 同时预加载下一页
pnpm start request_community_feed --page_index 1 > /tmp/page1.prefetch.json &
wait
```

## 调试技巧

### 1. 验证场景是否正确

检查返回的 `module_list` 内容是否符合预期：
- 首页应该有多样化的内容
- 个人主页应该只有该用户的作品
- 相关推荐应该与种子作品相似

### 2. 检查 biz_trace_id 一致性

```bash
# 请求时指定 biz_trace_id
pnpm start request_community_feed \
  --page_index 1 \
  --biz_trace_id "your-biz-trace-id" > /tmp/response.json

# 检查返回的 biz_trace_id
cat /tmp/response.json | jq '.page_data.biz_trace_id'
```

### 3. 使用日志调试

```bash
# 开启 debug 日志查看请求参数
DEBUG=* pnpm start request_community_feed --page_index 0
```

## 常见问题

### Q1: 为什么返回的结果为空？

**可能原因：**
- 场景参数组合不正确
- UUID 无效
- 该场景下确实没有内容

**解决方案：**
- 先尝试默认场景（不加任何参数）
- 验证 UUID 是否有效
- 检查 page_index 是否过大

### Q2: biz_trace_id 应该用哪一个？

**原则：使用上一次返回的 biz_trace_id**

```bash
pnpm start request_community_feed --page_index 0 > /tmp/page0.json
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# 使用上一次的返回值
pnpm start request_community_feed --page_index 1 --biz_trace_id "$BIZ_TRACE_ID"
pnpm start request_community_feed --page_index 2 --biz_trace_id "$BIZ_TRACE_ID"
```

**注意：** 后端可能会自动清除或重置 biz_trace_id，所以每次都应该使用最新返回的值。

### Q3: 如何区分不同类型的模块？

通过 `module_list` 中每个模块的 `template_id` 判断：
- `NORMAL`: 普通作品模块
- `DRAFT`: 草稿模块
- `into_space`: 空间入口模块
- `ACTIVITY`: 活动模块

## 总结

使用社区互动技能的关键点：

1. **理解场景自动判断**：通过参数组合自动切换场景
2. **掌握 page_index 语义**：
   - `request_community_feed`：从 0 开始（第 1 页）
   - `request_interactive_feed`：特殊场景从 1 开始（相关推荐），普通场景从 0 开始（个人主页、原作详情）
3. **维护 biz_trace_id**：翻页时使用上一次返回的值，切换场景时清除
4. **合理设置 page_size**：根据场景选择合适的大小
5. **善用 scene 参数**：精确控制特定场景（个人主页、相关推荐等）

通过遵循这些最佳实践，你可以更高效地使用社区内容&互动玩法推荐技能，获得更好的效果和用户体验。
