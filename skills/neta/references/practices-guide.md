# Neta社区最佳游玩指南

## 📖 目录

1. [新手入门](#新手入门)
2. [内容创作](#内容创作)
3. [社区互动](#社区互动)
4. [内容探索](#内容探索)
5. [高级玩法](#高级玩法)

---

## 新手入门

### 前置准备

确保已设置环境变量和安装依赖：

```bash
# 设置环境变量
export NETA_TOKEN="your_token_here"

# 启用 corepack 并安装依赖
corepack enable
pnpm i
```

### 快速开始

**游览空间** - 了解世界观设定
```bash
# 获取可供游览的空间列表
pnpm start list_spaces

# 获取空间详情
pnpm start get_hashtag_info --hashtag "空间标签名"

# 获取空间的子空间
pnpm start list_space_topics --space_uuid "空间 uuid"
```

**搜索角色** - 认识社区人物
```bash
# 搜索角色
pnpm start search_character_or_elementum \
  --keywords "关键词" \
  --parent_type "character" \
  --sort_scheme "exact"

# 获取角色详情
pnpm start request_character_or_elementum --name "角色名"
```

---

## 内容创作

### AI 多媒体创作

#### 🎨 生成图片

```bash
pnpm start make_image \
  --prompt "@角色名，/风格元素，参考图 - 全图参考 - 图片 uuid，描述词，描述词" \
  --aspect "3:4"
```

**提示词结构：**
- `@角色名`：指定角色
- `/风格元素`：艺术风格
- `参考图`：可选的图片参考
- `描述词`：详细的画面描述

**常用宽高比：**
- `3:4` - 竖版构图（推荐）
- `16:9` - 横版构图
- `1:1` - 正方形构图

#### 🎬 生成视频

```bash
pnpm start make_video \
  --image_source "图片 URL" \
  --prompt "动作描述" \
  --model "model_s"
```

**动作描述原则：**
- 具体明确（如"转身微笑"而非"动起来"）
- 简洁有力（20 字以内）
- 符合物理规律

**模型选择：**
- `model_s` - 标准质量，快速出片
- `model_l` - 高质量，细节更好

#### 🎵 生成歌曲

```bash
pnpm start make_song \
  --prompt "风格描述" \
  --lyrics "歌词内容"
```

**风格描述示例：**
- "轻快的流行音乐，钢琴伴奏"
- "激昂的摇滚乐，电吉他独奏"
- "舒缓的古典音乐，小提琴主旋律"

#### 🎞️ 制作完整 MV

结合歌曲和视频生成完整 MV：

1. 先生成歌曲
2. 根据歌曲风格生成视频
3. 合成音频和视频

详细流程见 [MV 制作指南](./song-mv.md)

#### 🛠️ 辅助工具

**移除背景**
```bash
pnpm start remove_background --input_image "image_url"
```

---

## 社区互动

### 浏览内容

#### 场景 1：浏览首页推荐

```bash
# 获取个性化推荐
pnpm start request_community_feed --page_index 0 --page_size 20

# 查看更多（保持 biz_trace_id）
pnpm start request_community_feed \
  --page_index 1 \
  --page_size 20 \
  --biz_trace_id "从上一页获取"
```

#### 场景 2：发现好作品并互动

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

#### 场景 3：查看相似作品

```bash
# 基于某个作品获取相关推荐
pnpm start request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID"
```

#### 场景 4：访问用户主页

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

### 社交关系管理

#### 互动操作

```bash
# 点赞/取消点赞
pnpm start like_collection --uuid "作品 UUID"
pnpm start like_collection --uuid "作品 UUID" --is_cancel true

# 收藏/取消收藏
pnpm start favor_collection --uuid "作品 UUID"
pnpm start favor_collection --uuid "作品 UUID" --is_cancel true

# 发布评论
# 对作品评论
pnpm start create_comment \
  --parent_uuid "作品 UUID" \
  --parent_type "collection" \
  --content "老师，这个作品真的好棒啊！"

# 回复评论（楼中楼）
pnpm start create_comment \
  --parent_uuid "目标评论 UUID" \
  --parent_type "comment" \
  --content "同意楼上的观点！"
```

#### 关注管理

```bash
# 关注/取消关注用户
pnpm start subscribe_user \
  --user_uuid "目标用户 UUID" \
  --is_cancel false

pnpm start subscribe_user \
  --user_uuid "目标用户 UUID" \
  --is_cancel true

# 查看我关注的人
pnpm start get_subscribe_list --page_index 0 --page_size 20

# 查看我的粉丝
pnpm start get_fan_list --page_index 0 --page_size 20
```

---

## 内容探索

### 渐进式探索流程

```
浏览分类 → 发现标签 → 验证路径 → 获取内容
```

#### 步骤 1：浏览分类体系

```bash
# 查看一级分类
pnpm start suggest_categories --level 1

# 查看二级分类
pnpm start suggest_categories \
  --level 2 \
  --parent_path "衍生创作类"

# 查看三级分类（最细粒度）
pnpm start suggest_categories \
  --level 3 \
  --parent_path "衍生创作类>同人二创"
```

#### 步骤 2：发现相关标签

```bash
# 基于关键词找标签
pnpm start suggest_tags \
  --keyword "角色塑造" \
  --size 15

# 用关键词建议辅助探索
pnpm start suggest_keywords \
  --prefix "崩" \
  --size 10
```

#### 步骤 3：验证分类路径

```bash
pnpm start validate_tax_path \
  --tax_path "衍生创作类>同人二创>崩坏星穹铁道"
```

#### 步骤 4：获取推荐内容

```bash
# 精确模式：按分类筛选
pnpm start suggest_content \
  --intent exact \
  --tax_paths "衍生创作类>同人二创>崩坏星穹铁道" \
  --page_size 20

# 搜索模式：结合关键词
pnpm start suggest_content \
  --intent search \
  --search_keywords "崩坏星穹铁道,同人" \
  --tax_paths "衍生创作类>同人二创" \
  --page_size 20
```

### 常见使用场景

#### 场景 1：无明确目标的探索

```bash
pnpm start suggest_content \
  --intent recommend \
  --page_size 20
```

**技巧：** 不设置任何筛选条件，让算法根据热度推荐

#### 场景 2：有模糊兴趣方向

```bash
# 步骤 1：用关键词建议发现方向
pnpm start suggest_keywords --prefix "游" --size 15

# 步骤 2：基于发现的关键词找标签
pnpm start suggest_tags --keyword "游戏" --size 15

# 步骤 3：使用搜索模式探索
pnpm start suggest_content \
  --intent search \
  --search_keywords "原神" \
  --page_size 20
```

#### 场景 3：有明确的分类目标

```bash
# 步骤 1：确认分类路径
pnpm start suggest_categories --level 1
pnpm start suggest_categories \
  --level 2 \
  --parent_path "衍生创作类"

# 步骤 2：验证路径
pnpm start validate_tax_path \
  --tax_path "衍生创作类>同人二创>崩坏星穹铁道"

# 步骤 3：精确筛选
pnpm start suggest_content \
  --intent exact \
  --tax_paths "衍生创作类>同人二创>崩坏星穹铁道" \
  --page_size 20
```

#### 场景 4：内容创作前的调研

```bash
# 步骤 1：了解热门标签
pnpm start suggest_tags \
  --keyword "角色塑造" \
  --size 20

# 步骤 2：了解相关分类
pnpm start suggest_categories \
  --level 2 \
  --parent_path "衍生创作类"

# 步骤 3：查看该分类下的热门内容
pnpm start suggest_content \
  --intent search \
  --search_keywords "角色，设定" \
  --tax_paths "衍生创作类>同人二创" \
  --page_size 30
```

### 高级筛选技巧

#### 组合 1：关键词 + 分类双重筛选

```bash
pnpm start suggest_content \
  --intent search \
  --search_keywords "视频，剪辑" \
  --tax_paths "数字艺术>视频制作" \
  --page_size 20
```

#### 组合 2：排除特定内容

```bash
pnpm start suggest_content \
  --intent search \
  --search_keywords "AI,绘画" \
  --tax_paths "数字艺术" \
  --exclude_keywords "教程，广告" \
  --exclude_tax_paths "数字艺术>课程培训" \
  --page_size 20
```

#### 组合 3：翻页连续性

```bash
# 第 1 页
pnpm start suggest_content \
  --page_index 0 \
  --page_size 20 \
  --intent search \
  --search_keywords "创意"

# 保存返回的 biz_trace_id

# 第 2 页（使用第 1 页返回的 biz_trace_id）
pnpm start suggest_content \
  --page_index 1 \
  --page_size 20 \
  --intent search \
  --search_keywords "创意" \
  --biz_trace_id "abc123"
```

---

## 高级玩法

### 标签研究

**获取标签信息**
```bash
pnpm start get_hashtag_info --hashtag "标签名"
```

**获取标签角色**
```bash
pnpm start get_hashtag_characters \
  --hashtag "标签名" \
  --sort_by "hot"
```

**获取标签合集（玩法）**
```bash
pnpm start get_hashtag_collections --hashtag "标签名"
```

**获取玩法详情**
```bash
pnpm start read_collection --uuid "玩法-uuid"
```

详细方法见 [标签调研指南](./hashtag-research.md)

### 内容合集研究

**获取合集信息**
```bash
pnpm start get_hashtag_collections --hashtag "标签名"
```

**研究合集详情**
```bash
pnpm start read_collection --uuid "合集 uuid"
```

详细方法见 [合集研究指南](./collection-remix.md)

### 性能优化建议

#### 1. 合理设置 page_size

- **探索阶段**：10-15（快速试错）
- **深入浏览**：20-30（减少翻页次数）
- **精确查找**：20-40（一次性获取足够内容）

#### 2. 缓存建议结果

```bash
# 第一次请求
pnpm start suggest_categories --level 1 > /tmp/categories_level1.json

# 后续使用缓存
cat /tmp/categories_level1.json
```

#### 3. 批量验证分类路径

```bash
# 并行验证多个路径
pnpm start validate_tax_path \
  --tax_path "衍生创作类>同人二创>崩坏星穹铁道" &
pnpm start validate_tax_path \
  --tax_path "衍生创作类>同人二创>原神" &
wait
```

### 调试技巧

#### 检查搜索关键词是否生效

```bash
DEBUG=* pnpm start suggest_content \
  --intent search \
  --search_keywords "测试关键词"
```

#### 对比不同模式的结果

```bash
# 同一关键词，对比三种模式
pnpm start suggest_content --intent recommend --page_size 10
pnpm start suggest_content \
  --intent search \
  --search_keywords "关键词" \
  --page_size 10
pnpm start suggest_content \
  --intent exact \
  --tax_paths "分类路径" \
  --page_size 10
```

---

## 使用建议

### 核心原则

1. **先查询后创作** - 使用角色查询获取标准设定，确保创作符合官方设定
2. **先调研后规划** - 使用标签调研了解热门元素和创作方向
3. **提示词具体化** - 避免抽象描述，使用详细的要素组合
4. **迭代测试** - 先用快速模型测试，满意后再用高质量模型

### 意图模式选择

| 模式 | 使用场景 | 必需参数 |
|------|---------|---------|
| `recommend` | 无目的浏览、探索 | 无 |
| `search` | 有明确关键词 | `search_keywords` |
| `exact` | 严格按分类筛选 | `tax_paths` 或分类参数 |

### 常见问题

**Q: suggest_keywords 和 suggest_tags 有什么区别？**
- `suggest_keywords`: 基于**前缀**的模糊匹配，适合探索阶段
- `suggest_tags`: 基于**完整关键词**的相关性匹配，更精确

**Q: 为什么验证通过但返回空结果？**
可能原因：
1. 分类路径有效，但该分类下暂时没有内容
2. intent 模式不对
3. 还有其他筛选条件冲突

解决方案：去掉其他条件，只用分类路径测试

---

## 相关文档

- 🌍 [世界观设定](./space.md)
- 🎨 [图片生成](./image-generation.md)
- 🎬 [视频生成](./video-generation.md)
- 🎵 [歌曲创作](./song-creation.md)
- 🎞️ [MV 制作](./song-mv.md)
- 👤 [角色查询](./character-search.md)
- 🏷️ [标签调研](./hashtag-research.md)
- 🖊️ [内容创作](./collection-remix.md)
- 📊 [社区游玩指南](./community-playground.md)
- 🔍 [内容探索](./community-exploration.md)
- 💬 [社交互动](./social-interactive.md)

---

**祝您在 Neta社区玩得开心！** 🎉
