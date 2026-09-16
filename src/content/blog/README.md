# How to Add a New Blog Post

Adding a new blog post is completely automated and file-based.

1. Create a new file in `src/content/blog/` named `<your-slug>.md` or `<your-slug>.mdx`.
2. Add the frontmatter at the top of the file:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
description: "A brief 1-2 sentence summary of your post"
tags: ["Tag1", "Tag2", "Tag3"]
author: "Reginald Ojunga"
---

# Your Heading

Your content here in standard Markdown or MDX!
```

3. Save the file. It will automatically show up on `/blog`, in search queries, and at `/blog/<your-slug>`.
