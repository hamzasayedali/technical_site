function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function layout({ title, description, active, content }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="site-header">
    <a class="site-title" href="/">Hacking With Hamza</a>
    <nav>
      <a href="/" class="${active === 'home' ? 'active' : ''}">Home</a>
      <a href="/blog/" class="${active === 'blog' ? 'active' : ''}">Blog</a>
      <a href="/favorites/" class="${active === 'favorites' ? 'active' : ''}">Favorites</a>
    </nav>
  </header>
  <main>
${content}
  </main>
  <footer class="site-footer">
    <p>&copy; ${new Date().getFullYear()} Hamza Sayed-Ali</p>
  </footer>
</body>
</html>
`;
}

function renderFeaturedCard(post) {
  const thumbnail = post.thumbnail
    ? `<img src="${post.thumbnail}" alt="${post.title}" class="featured-thumbnail">`
    : '';

  return `      <li class="featured-card">
        <a href="/blog/${post.slug}/">
          ${thumbnail}
          <span class="featured-title">${post.title}</span>
          <p>${post.description}</p>
        </a>
      </li>`;
}

function renderHome({ introHtml, posts, featuredPosts = [] }) {
  const postList = posts
    .slice(0, 5)
    .map(
      (post) => `      <li class="post-item">
        <a href="/blog/${post.slug}/">${post.title}</a>
        <span class="post-date">${formatDate(post.date)}</span>
        <p>${post.description}</p>
      </li>`
    )
    .join('\n');

  const featuredSection = featuredPosts.length
    ? `    <section class="featured-posts">
      <h2>Featured Posts</h2>
      <ul class="featured-list">
${featuredPosts.map(renderFeaturedCard).join('\n')}
      </ul>
    </section>`
    : '';

  const content = `    <section class="intro">
${introHtml}
    </section>
${featuredSection}
    <section class="recent-posts">
      <h2>Recent Posts</h2>
      <ul class="post-list">
${postList}
      </ul>
      <a href="/blog/" class="see-all">See all posts &rarr;</a>
    </section>`;

  return layout({
    title: "Hamza's Technical Site",
    description: 'A technical blog about software and other things worth explaining.',
    active: 'home',
    content,
  });
}

function renderBlogIndex({ posts }) {
  const postList = posts
    .map(
      (post) => `      <li class="post-item">
        <a href="/blog/${post.slug}/">${post.title}</a>
        <span class="post-date">${formatDate(post.date)}</span>
        <p>${post.description}</p>
      </li>`
    )
    .join('\n');

  const content = `    <h1>Blog</h1>
    <ul class="post-list">
${postList}
    </ul>`;

  return layout({
    title: 'Blog — Hamza\'s Technical Site',
    description: 'All posts.',
    active: 'blog',
    content,
  });
}

function renderFavorites({ contentHtml }) {
  const content = `    <h1>Favorites</h1>
${contentHtml}`;

  return layout({
    title: "Favorites — Hamza's Technical Site",
    description: 'Blogs, tools, and channels worth checking out.',
    active: 'favorites',
    content,
  });
}

function renderPost({ post }) {
  const content = `    <article class="post">
      <h1>${post.title}</h1>
      <p class="post-date">${formatDate(post.date)}</p>
${post.contentHtml}
    </article>`;

  return layout({
    title: `${post.title} — Hamza's Technical Site`,
    description: post.description,
    active: 'blog',
    content,
  });
}

module.exports = { layout, renderHome, renderBlogIndex, renderFavorites, renderPost, formatDate };
