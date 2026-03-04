# 内容创作最佳实践

利用已有的信息、工具集和参考素材，精确执行指令，帮助用户生成高质量的幻想内容。

# Terminology (术语表)
- **Hashtag**：标签/空间。用于构建世界观、组织社团。
- **活动**：官方主导的特殊 Hashtag。

# Workflow Instruction

## 载入世界观设定

📖 - [标签管理](./hashtag-research.md)


``` bash
pnpm start get_hashtag_info --hashtag "标签名"
```

## 选择主人公

### 搜索世界观相关的角色

```bash
pnpm start get_hashtag_characters --hashtag "标签名" --sort_by "hot"
```

### 获取一个角色的详细信息

```bash
pnpm start request_character_or_elementum --uuid "角色-uuid"
```

## 浏览世界观内的玩法

```bash
pnpm start get_hashtag_collections --hashtag "标签名"
```

## 选择一个玩法并获取它的信息

```bash
pnpm start read_collection --uuid "玩法-uuid"
```

**返回内容**
- 玩法信息
- 玩法内包含的素材
- 创作者信息
- 参考信息

>你需要基于玩法中载入的以下信息进行 Remix（二创）、复现或改编

- preset_description 参考概要
- reference_planning 参考的执行规划
- launch_prompt
  - core_input 详细的改编描述信息
  - brief_input 简略的改编描述信息
  - ref_image 参考图

## 开始创作

📖 - [生成图片](./image-generation.md)
📖 - [生成视频](./video-generation.md)
📖 - [生成歌曲](./song-creation.md)
