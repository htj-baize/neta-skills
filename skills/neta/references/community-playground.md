# 社区互动游玩指南

## 概述
社区是游戏内容的中心，是玩家与玩家之间的社交关系。

### 场景 1：浏览首页推荐

```bash
# 获取个性化推荐
pnpm start request_community_feed --page_index 0 --page_size 20

# 查看更多（保持 biz_trace_id）
pnpm start request_community_feed \
  --page_index 1 \
  --page_size 20 \
  --biz_trace_id "从上一页获取"
```

### 场景 2：发现好作品并互动

```bash
# 1. 浏览推荐找到好作品
pnpm start request_community_feed --page_index 0 --page_size 10

# 2. 点赞作品
pnpm start like_collection --uuid "作品 UUID"

# 3. 收藏作品
pnpm start favor_collection --uuid "作品 UUID"

# 4. 发表评论
pnpm start create_comment \
  --parent_uuid "作品 UUID" \
  --parent_type "collection" \
  --content "太棒了！"
```

### 场景 3：查看相似作品

```bash
# 基于某个作品获取相关推荐
pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID"
```

### 场景 4：访问用户主页

```bash
# 查看某用户的作品
pnpm start request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "用户 UUID"

# 关注该用户
pnpm start subscribe_user \
  --user_uuid "用户 UUID" \
  --is_cancel false
```

### 场景 5：管理社交关系

```bash
# 查看我关注的人
pnpm start get_subscribe_list --page_index 0 --page_size 20

# 查看我的粉丝
pnpm start get_fan_list --page_index 0 --page_size 20
```

相关文档:
- [社区内容&玩法浏览](./community-view.md)
- [社交互动技能](./social-interactive.md)
- [玩法内容深度探索](./community-exploration.md)
