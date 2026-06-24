import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
  platform?: 'youtube' | 'vimeo';
}

const VideoEmbed = ({ videoId, title, platform = 'youtube' }: VideoEmbedProps) => {
  const [loaded, setLoaded] = useState(false);

  const thumbnailUrl = platform === 'youtube'
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : '';

  const embedUrl = platform === 'youtube'
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${videoId}?autoplay=1`;

  if (!loaded) {
    return (
      <div className="my-6 border-2 border-foreground overflow-hidden">
        <button
          onClick={() => setLoaded(true)}
          className="relative w-full aspect-video bg-muted group cursor-pointer"
          aria-label={`Play: ${title}`}
        >
          {platform === 'youtube' && (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-military-green flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-7 w-7 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm font-bold text-left">{title}</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 border-2 border-foreground overflow-hidden">
      <div className="relative w-full aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

export default VideoEmbed;
