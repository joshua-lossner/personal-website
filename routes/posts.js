const fs = require('fs');
const path = require('path');

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        hidden: false
      }
    });
    const logPath = path.join(__dirname, 'posts.log');
    const logData = {
      timestamp: new Date().toISOString(),
      query: { hidden: false },
      result: posts
    };
    fs.appendFileSync(logPath, JSON.stringify(logData, null, 2) + '\n'); // Log the posts to a file
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});