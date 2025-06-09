import React from 'react';
import { MessageSquare, Calendar, FileText, Users, ExternalLink, MoreHorizontal } from 'lucide-react';

interface PostData {
  id: number;
  source: string;
  title: string;
  content: string;
  time: string;
  type: string;
  comments?: number;
  upvotes?: number;
  attending?: number;
  interested?: number;
  shares?: number;
  likes?: number;
  retweets?: number;
}

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  return (
    <div className="p-6">
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          post.type === 'reddit' ? 'bg-orange-100' :
          post.type === 'twitter' ? 'bg-blue-100' :
          post.type === 'event' ? 'bg-yellow-100' :
          'bg-green-100'
        }`}>
          {post.type === 'reddit' && <MessageSquare className="h-5 w-5 text-orange-600" />}
          {post.type === 'twitter' && <span className="text-blue-600 font-bold text-xs">X</span>}
          {post.type === 'event' && <Calendar className="h-5 w-5 text-yellow-600" />}
          {post.type === 'news' && <FileText className="h-5 w-5 text-green-600" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{post.source}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{post.time} ago</span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3">{post.content}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {post.comments && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} comments</span>
              </div>
            )}
            {post.upvotes && (
              <div className="flex items-center space-x-1">
                <span>↑ {post.upvotes}</span>
              </div>
            )}
            {post.attending && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{post.attending} attending</span>
              </div>
            )}
            {post.shares && (
              <div className="flex items-center space-x-1">
                <ExternalLink className="h-4 w-4" />
                <span>{post.shares} shares</span>
              </div>
            )}
            {post.likes && (
              <div className="flex items-center space-x-1">
                <span>❤️ {post.likes}</span>
              </div>
            )}
            {post.retweets && (
              <div className="flex items-center space-x-1">
                <span>🔄 {post.retweets}</span>
              </div>
            )}
          </div>
        </div>
        
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}