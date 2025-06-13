import React , {useState} from 'react';
import Image from 'next/image';
import { MessageSquare, Calendar, FileText, Users, ExternalLink, MoreHorizontal, MessageCircle, ArrowUp, Play, ChevronDown, Chevronup } from 'lucide-react';

interface PostData {
  id: string | number;
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
  url?: string;
  thumbnail?: string;
  permalink?: string;
  subreddit?: string;
  domain?: string;
  is_video?: boolean;
}

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const maxLength = 200;
  const shouldTruncate = post.content && post.content.length > maxLength;
  
  const getDisplayContent = () => {
    if (!post.content) return '';
    
    if (shouldTruncate && !isExpanded) {
      return post.content.substring(0, maxLength).trim() + '...';
    }
    
    return post.content;
  };

  // Helper function to determine if URL is an image
  const isImageUrl = (url: string) => {
  if (!url) return false;
  
  // Handle direct image URLs
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
  if (imageExtensions.test(url)) return true;
  
  // Handle common image hosting platforms
  const imageHosts = [
    'i.redd.it',
    'i.imgur.com',
    'imgur.com/gallery',
    'preview.redd.it'
  ];
  
  return imageHosts.some(host => url.includes(host));
};


  // Helper function to determine if URL is a video
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = /\.(mp4|webm|ogg|mov|avi)(\?|$)/i;
    return videoExtensions.test(url) || url.includes('v.redd.it') || url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    return null;
  };

 const getProxiedImageUrl = (url: string) => {
  if (!url) return url;
  
  if (url.includes('i.redd.it') || url.includes('preview.redd.it') || url.includes('reddit.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
};

const openNewsArticle = () => {
    if (post.url) {
      window.open(post.url, '_blank');
    }
  };

  // Function to render media preview
  const renderMediaPreview = () => {

    if (!post.url && !post.thumbnail) return null;
    
    if (post.thumbnail && (post.thumbnail === 'self' || post.thumbnail === 'default' || post.thumbnail === 'nsfw' || post.thumbnail === 'spoiler')) {
      return null;
    }

    const mediaUrl = post.url;
    const thumbnailUrl = post.thumbnail;
/*
    // Debug logging
    console.log('Post media debug:', {
    mediaUrl,
    thumbnailUrl,
    isImageUrl: isImageUrl(mediaUrl),
    isVideoUrl: isVideoUrl(mediaUrl),
    imageError,
    post
  });

*/
  if (isImageUrl(mediaUrl) || (thumbnailUrl && isImageUrl(thumbnailUrl))) {
  const originalImageUrl = isImageUrl(mediaUrl) ? mediaUrl : thumbnailUrl;
  const proxiedImageUrl = getProxiedImageUrl(originalImageUrl);
  
  return (
    <div className="mb-3  p-4">
      <Image 
        src={proxiedImageUrl}
        alt="Test image"
        width={400}
        height={300}
        className="block w-full max-w-sm h-auto"
        onLoad={() => console.log(' Test image loaded')}
        onError={() => console.log(' Test image failed')}
      />

      
    </div>
  );
}
  

  // Handle images
  if (isImageUrl(mediaUrl) || (thumbnailUrl && isImageUrl(thumbnailUrl) && !imageError)) {
  const originalImageUrl = isImageUrl(mediaUrl) ? mediaUrl : thumbnailUrl;
  const proxiedImageUrl = getProxiedImageUrl(originalImageUrl);

       return (
      <div className="mb-3 relative group">
        <Image 
        src={proxiedImageUrl}
        alt="Post media"
        width={400}
        height={300}
        className="rounded-lg max-w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => window.open(mediaUrl || originalImageUrl, '_blank')}
        onError={() => {
          console.error('Image failed to load:', proxiedImageUrl);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', proxiedImageUrl);
          setImageError(false);
        }}
        style={{ 
          backgroundColor: '#f3f4f6',
          minHeight: '100px' 
        }}
      />


        {/* Fallback content when image fails */}
         {imageError && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" 
             onClick={() => window.open(mediaUrl || originalImageUrl, '_blank')}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">View Image</p>
              <p className="text-xs text-gray-500 truncate">{originalImageUrl}</p>
            </div>
          </div>
        </div>
      )}
        
        {!imageError && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
            <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    );

    }

    // Handle videos
    if (isVideoUrl(mediaUrl) || post.is_video) {
      const thumbnailSrc = getYouTubeThumbnail(mediaUrl) || thumbnailUrl;
      
      return (
        <div className="mb-3 relative group cursor-pointer" onClick={() => window.open(mediaUrl, '_blank')}>
          {thumbnailSrc && !imageError ? (
            <div className="relative">
              <Image 
                src={thumbnailSrc}
                alt="Video thumbnail"
                width={400}
                height={300}
                className="rounded-lg max-w-full max-h-96 object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="bg-black bg-opacity-60 rounded-full p-3">
                  <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors">
              <Play className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Play Video</span>
            </div>
          )}
        </div>
      );
    }

    // Handle other media with thumbnails
    if (thumbnailUrl && !imageError && thumbnailUrl.startsWith('http') && !isVideoUrl(mediaUrl)) {
    return (
      <div className="mb-3 relative group">
        <Image 
          src={thumbnailUrl}
          alt="Post thumbnail"
          width={300}
          height={200}
          className="rounded-lg max-w-sm max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(mediaUrl, '_blank')}
          onError={() => {
            console.log('Thumbnail load error:', thumbnailUrl);
            setImageError(true);
          }}
          onLoad={() => console.log('Thumbnail loaded successfully:', thumbnailUrl)}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded px-2 py-1">
          <span className="text-white text-xs">{post.domain || 'Link'}</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
          <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
    }

    if (isVideoUrl(mediaUrl) || post.is_video) {
    const thumbnailSrc = getYouTubeThumbnail(mediaUrl) || thumbnailUrl;
    
    return (
      <div className="mb-3 relative group cursor-pointer" onClick={() => window.open(mediaUrl, '_blank')}>
        {thumbnailSrc && !imageError ? (
          <div className="relative">
            <Image 
              src={thumbnailSrc}
              alt="Video thumbnail"
              width={400}
              height={300}
              className="rounded-lg max-w-full max-h-96 object-cover"
              onError={() => {
                console.log('Video thumbnail error:', thumbnailSrc);
                setImageError(true);
              }}
              onLoad={() => console.log('Video thumbnail loaded:', thumbnailSrc)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="bg-black bg-opacity-60 rounded-full p-3">
                <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors">
            <Play className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Play Video</span>
          </div>
        )}
      </div>
    );
  }

    return null;
  };

  const openInReddit = () => {
    let redditUrl;
    
    if (post.permalink) {
      redditUrl = `https://www.reddit.com${post.permalink}`;
    } else if (post.url && post.url.includes('reddit.com')) {
      redditUrl = post.url;
    } else {
      redditUrl = `https://www.reddit.com/r/${post.subreddit}/comments/${post.id}/`;
    }
    
    console.log('Opening Reddit URL:', redditUrl); // Debug log
    window.open(redditUrl, '_blank');
  };

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
          {/* Media Preview */}
          {renderMediaPreview()}

          {/* Enhanced content with preview/expand */}
          <div className="mb-3">
            <p className="text-gray-700 leading-relaxed">
              {getDisplayContent()}
            </p>
            
            {shouldTruncate && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors inline-flex items-center"
              >
                {isExpanded ? (
                  <>
                    Show less
                    <svg className="ml-1 h-3 w-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Read more
                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
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
       {/* Add interaction buttons */}
      <div className="flex items-center justify-between mt-4">
        {        post.type === 'reddit' && (
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600">
            <ArrowUp className="h-4 w-4" />
            <span>{post.upvotes}</span>
          </button>
        </div>
        )}
        
        {post.type === 'reddit' && (
          <button 
            onClick={openInReddit}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View on Reddit →
          </button>
        )}

      {post.type === 'news' && (
          <button 
            onClick={openNewsArticle}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Read Full Article →
          </button>
        )}

      </div>
    </div>
  );
}