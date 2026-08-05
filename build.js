const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const sharp = require('sharp');
const { renderHome, renderBlogIndex, renderFavorites, renderPost } = require('./templates/layout');

const THUMBNAIL_WIDTH = 800;
const THUMBNAIL_QUALITY = 80;

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

function slugify(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function extractYoutubeId(raw) {
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1);
    if (url.hostname.endsWith('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/embed/')) return url.pathname.slice('/embed/'.length);
    }
  } catch {
    // not a URL, fall through
  }

  return null;
}

// Turns `{% youtube VIDEO_ID_OR_URL %}` on its own line into a responsive embed.
function embedYoutube(markdown) {
  return markdown.replace(/^\{%\s*youtube\s+(.+?)\s*%\}$/gm, (match, raw) => {
    const id = extractYoutubeId(raw.trim());
    if (!id) return match;
    // Blank lines on both sides so this HTML block can't swallow adjacent
    // Markdown (e.g. a link on the very next line) as literal text.
    return `\n<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>\n`;
  });
}

function renderMarkdown(content) {
  return marked.parse(embedYoutube(content));
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// A bare filename (no leading "/") resolves against that post's own image
// folder, e.g. `thumbnail: foo.png` on the "my-post" post -> /images/my-post/foo.png
function resolveThumbnailSource(thumbnail, slug) {
  if (!thumbnail) return null;
  return thumbnail.startsWith('/') ? thumbnail : `/images/${slug}/${thumbnail}`;
}

// e.g. /images/my-post/foo.png -> /images/my-post/foo-thumb.webp
// A separate filename so the same source image can also be used at full
// quality inline in the post body without being affected.
function thumbnailOutputPath(sourcePath) {
  const { dir, name } = path.parse(sourcePath);
  return `${dir}/${name}-thumb.webp`;
}

// Resizes+recompresses each post's thumbnail into dist/ as WebP, and points
// post.thumbnail at the compressed version. Leaves public/images/ untouched.
async function generateThumbnails(posts) {
  for (const post of posts) {
    if (!post.thumbnail) continue;

    const sourceFile = path.join(PUBLIC_DIR, post.thumbnail);
    const outputPath = thumbnailOutputPath(post.thumbnail);
    const outputFile = path.join(DIST_DIR, outputPath);

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    await sharp(sourceFile)
      .rotate() // auto-orient using the source's EXIF Orientation tag before resizing
      .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMBNAIL_QUALITY })
      .toFile(outputFile);

    post.thumbnail = outputPath;
  }
}

function loadPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data, content } = matter(raw);

    if (!data.title || !data.date) {
      throw new Error(`Post "${filename}" is missing required frontmatter (title, date).`);
    }

    const slug = slugify(filename);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description || '',
      thumbnail: resolveThumbnailSource(data.thumbnail, slug),
      contentHtml: renderMarkdown(content),
    };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

function loadHome() {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'home.md'), 'utf8');
  const { data, content } = matter(raw);
  return { introHtml: renderMarkdown(content), featuredSlugs: data.featured || [] };
}

function loadFavorites() {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'favorites.md'), 'utf8');
  const { content } = matter(raw);
  return renderMarkdown(content);
}

function resolveFeaturedPosts(featuredSlugs, posts) {
  return featuredSlugs
    .map((slug) => {
      const post = posts.find((p) => p.slug === slug);
      if (!post) {
        console.warn(`Featured post "${slug}" not found — skipping.`);
      }
      return post;
    })
    .filter(Boolean);
}

function writeFile(destPath, contents) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, contents);
}

async function build() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });

  const posts = loadPosts();
  const { introHtml, featuredSlugs } = loadHome();
  const featuredPosts = resolveFeaturedPosts(featuredSlugs, posts);

  if (fs.existsSync(PUBLIC_DIR)) {
    copyDir(PUBLIC_DIR, DIST_DIR);
  }

  await generateThumbnails(posts);

  writeFile(path.join(DIST_DIR, 'index.html'), renderHome({ introHtml, posts, featuredPosts }));
  writeFile(path.join(DIST_DIR, 'blog', 'index.html'), renderBlogIndex({ posts }));
  writeFile(path.join(DIST_DIR, 'favorites', 'index.html'), renderFavorites({ contentHtml: loadFavorites() }));

  for (const post of posts) {
    writeFile(path.join(DIST_DIR, 'blog', post.slug, 'index.html'), renderPost({ post }));
  }

  console.log(`Built ${posts.length} post(s) to ${path.relative(ROOT, DIST_DIR)}/`);
}

module.exports = { build };

if (require.main === module) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
