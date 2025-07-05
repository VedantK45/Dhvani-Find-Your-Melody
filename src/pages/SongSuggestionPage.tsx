import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';

const SongSuggestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  const moodMessages = {
    happy: "Keep that smile shining! 🌟",
    sad: "Music heals the soul. Let these melodies comfort you. 💙",
    energetic: "Channel that energy! Time to move and groove! ⚡",
    relaxed: "Perfect time to unwind with some soothing tunes. 🌙",
    angry: "Let the music calm your storm. 🌊",
    surprised: "Unexpected moods call for unexpected melodies! ✨",
    neutral: "Sometimes the best music finds you in quiet moments. 🎵",
  };

  // Real songs from your actual Spotify playlists
  const spotifyPlaylistSongs = {
    happy: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTwbZHrJRIgD?si=d13992e654424fab" },
      { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTwbZHrJRIgD?si=d13992e654424fab" },
      { title: "As It Was", artist: "Harry Styles", cover: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTwbZHrJRIgD?si=d13992e654424fab" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", cover: "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTwbZHrJRIgD?si=d13992e654424fab" },
      { title: "Lavender Haze", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTwbZHrJRIgD?si=d13992e654424fab" },
    ],
    sad: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1389994/pexels-photo-1389994.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdFesNN9TzXT?si=0025b235219a4b8b" },
      { title: "Kill Bill", artist: "SZA", cover: "https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdFesNN9TzXT?si=0025b235219a4b8b" },
      { title: "Creepin'", artist: "Metro Boomin, The Weeknd, 21 Savage", cover: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdFesNN9TzXT?si=0025b235219a4b8b" },
      { title: "Snooze", artist: "SZA", cover: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdFesNN9TzXT?si=0025b235219a4b8b" },
      { title: "Vampire", artist: "Olivia Rodrigo", cover: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdFesNN9TzXT?si=0025b235219a4b8b" },
    ],
    energetic: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3mSm688yR6UeaAJNf93Ydr?si=b08eb5f436fa477a" },
      { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3mSm688yR6UeaAJNf93Ydr?si=b08eb5f436fa477a" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3mSm688yR6UeaAJNf93Ydr?si=b08eb5f436fa477a" },
      { title: "As It Was", artist: "Harry Styles", cover: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3mSm688yR6UeaAJNf93Ydr?si=b08eb5f436fa477a" },
      { title: "Bad Habit", artist: "Steve Lacy", cover: "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3mSm688yR6UeaAJNf93Ydr?si=b08eb5f436fa477a" },
    ],
    relaxed: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1389994/pexels-photo-1389994.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTdCC2tMwtB2?si=ae6b4087aa634117" },
      { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTdCC2tMwtB2?si=ae6b4087aa634117" },
      { title: "As It Was", artist: "Harry Styles", cover: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTdCC2tMwtB2?si=ae6b4087aa634117" },
      { title: "About Damn Time", artist: "Lizzo", cover: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTdCC2tMwtB2?si=ae6b4087aa634117" },
      { title: "Heat Waves", artist: "Glass Animals", cover: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTdCC2tMwtB2?si=ae6b4087aa634117" },
    ],
    angry: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3JNWpteYvH3ynMcyPcvxfx?si=376f423ecdf84490" },
      { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3JNWpteYvH3ynMcyPcvxfx?si=376f423ecdf84490" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", cover: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3JNWpteYvH3ynMcyPcvxfx?si=376f423ecdf84490" },
      { title: "Kill Bill", artist: "SZA", cover: "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3JNWpteYvH3ynMcyPcvxfx?si=376f423ecdf84490" },
      { title: "Creepin'", artist: "Metro Boomin, The Weeknd, 21 Savage", cover: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/3JNWpteYvH3ynMcyPcvxfx?si=376f423ecdf84490" },
    ],
    surprised: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1389994/pexels-photo-1389994.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "As It Was", artist: "Harry Styles", cover: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", cover: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "About Damn Time", artist: "Lizzo", cover: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
    ],
    neutral: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "https://images.pexels.com/photos/1389994/pexels-photo-1389994.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "Anti-Hero", artist: "Taylor Swift", cover: "https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "As It Was", artist: "Harry Styles", cover: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "Kill Bill", artist: "SZA", cover: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", cover: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300", playlistUrl: "https://open.spotify.com/playlist/1IvEH3HDObcFnkFW6zeWvM?si=f71fdf1bf4434260" },
    ],
  };

  const currentSongs = spotifyPlaylistSongs[state.currentMood as keyof typeof spotifyPlaylistSongs] || spotifyPlaylistSongs.neutral;
  const currentMessage = moodMessages[state.currentMood as keyof typeof moodMessages] || moodMessages.neutral;

  const handleSongClick = (song: any) => {
    // Open the specific song search on Spotify
    window.open(`https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`, '_blank');
  };

  const handlePlaylistClick = (playlistUrl: string) => {
    // Open the full playlist
    window.open(playlistUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/mood-detection')}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Songs for your {state.currentMood} mood, {state.user.username}!
            </h1>
            <p className="font-body text-primary/70 mt-2">{currentMessage}</p>
          </div>
        </div>

        {/* Playlist Banner */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-primary mb-2">
                Curated {state.currentMood.charAt(0).toUpperCase() + state.currentMood.slice(1)} Playlist
              </h2>
              <p className="font-body text-primary/70 text-sm">
                Top trending songs from Spotify's official playlists
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlaylistClick(currentSongs[0]?.playlistUrl)}
              className="bg-primary hover:bg-primary/90 text-white font-heading font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Open Full Playlist</span>
            </motion.button>
          </div>
        </div>

        {/* Song Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSongs.map((song, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleSongClick(song)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-primary/10">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              
              <h3 className="font-heading text-lg font-semibold text-primary mb-1">
                {song.title}
              </h3>
              <p className="font-body text-primary/70 mb-3">{song.artist}</p>
              
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-primary/50">Listen on Spotify</span>
                <ExternalLink className="w-4 h-4 text-primary/50" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mood-detection')}
            className="bg-primary hover:bg-primary/90 text-white font-heading font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Different Mood
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlaylistClick(currentSongs[0]?.playlistUrl)}
            className="bg-white/80 hover:bg-white text-primary font-heading font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-primary/20"
          >
            View Full Playlist
          </motion.button>
        </div>

        {/* Spotify Attribution */}
        <div className="text-center mt-8">
          <p className="font-body text-primary/50 text-sm">
            Songs from your curated Spotify playlists • Click any song to listen on Spotify
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SongSuggestionPage;