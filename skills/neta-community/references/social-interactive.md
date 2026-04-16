## Social Interaction Skills

### 1. Collection interaction actions

#### `like_collection` — like/unlike a collection

```bash
# Like a collection
npx -y @talesofai/neta-skills@latest like_collection --uuid "TARGET_COLLECTION_UUID"

# Unlike a collection
npx -y @talesofai/neta-skills@latest like_collection --uuid "TARGET_COLLECTION_UUID" --is_cancel true
```

#### `favor_collection` — favorite/unfavorite a collection

```bash
# Favorite a collection
npx -y @talesofai/neta-skills@latest favor_collection --uuid "TARGET_COLLECTION_UUID"

# Remove from favorites
npx -y @talesofai/neta-skills@latest favor_collection --uuid "TARGET_COLLECTION_UUID" --is_cancel true
```

#### `create_comment` — post a comment

Supports commenting on collections and on other comments (threaded replies).

**Parameters:**

- `content`: comment text (1–500 characters).
- `parent_uuid`: UUID of the parent object.
- `parent_type`: parent type (`collection` or `comment`).

```bash
# Post a top-level comment on a collection
npx -y @talesofai/neta-skills@latest create_comment \
  --parent_uuid "TARGET_COLLECTION_UUID" \
  --parent_type "collection" \
  --content "This work is amazing!"

# Reply to an existing comment (threaded reply)
npx -y @talesofai/neta-skills@latest create_comment \
  --parent_uuid "TARGET_COMMENT_UUID" \
  --parent_type "comment" \
  --content "Totally agree with you!"
```

**Note:** `parent_type` only supports `collection` (works) and `comment` (comments). It does **not** support characters or elementums.

### 2. Collection interaction history

#### `get_liked_list` — view collections I liked

```bash
npx -y @talesofai/neta-skills@latest get_liked_list --cursor_id 0 --page_size 10
```

Use `next_cursor` from the previous response to continue pagination.

#### `get_favor_list` — view collections I favorited

```bash
npx -y @talesofai/neta-skills@latest get_favor_list --cursor_id 0 --page_size 10
```

Use `next_cursor` from the previous response to continue pagination.

### 3. User relationship interactions

#### `subscribe_user` — follow/unfollow a user

```bash
# Follow a user
npx -y @talesofai/neta-skills@latest subscribe_user --user_uuid "TARGET_USER_UUID" --is_cancel false

# Unfollow a user
npx -y @talesofai/neta-skills@latest subscribe_user --user_uuid "TARGET_USER_UUID" --is_cancel true
```

#### `get_subscribe_list` — view users I follow

```bash
npx -y @talesofai/neta-skills@latest get_subscribe_list --page_index 0 --page_size 10
```

#### `get_fan_list` — view my followers

```bash
npx -y @talesofai/neta-skills@latest get_fan_list --page_index 0 --page_size 10
```
