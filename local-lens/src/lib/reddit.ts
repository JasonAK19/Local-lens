export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  score: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
}

export async function fetchLocationPosts(location: string) {
  const subreddits = ['baltimore', 'maryland']; // Based on location
  const posts: RedditPost[] = [];
  
  for (const subreddit of subreddits) {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`
    );
    const data = await response.json();
    posts.push(...data.data.children.map((child: any) => child.data));
  }
  
  return posts;
}