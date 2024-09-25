export function filterVisiblePosts(posts) {
  return posts.filter(post => !post.hidden);
}