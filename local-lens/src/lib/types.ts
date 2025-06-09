export interface Post {
  id: string;
  source: string;
  title: string;
  content: string;
  time: string;
  type: 'reddit' | 'twitter' | 'event' | 'news';
  comments?: number;
  upvotes?: number;
  likes?: number;
  retweets?: number;
  attending?: number;
  interested?: number;
  shares?: number;
}

export interface ContentSource {
  name: string;
  count: number;
  active: boolean;
}