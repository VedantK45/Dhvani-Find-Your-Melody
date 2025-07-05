# Dhvani - Find Your Melody 🎵

A mood-based music discovery app that suggests personalized music based on your current emotional state.

## Features

- **Simple Mood Detection**: Uses camera to capture the moment and suggest a mood
- **Real-time Camera Interface**: Live video feed with instant feedback
- **Personalized Music Recommendations**: Curated Spotify playlists based on detected mood
- **Mood History Tracking**: Keep track of your emotional journey over time
- **Privacy-First Design**: All processing happens locally, your data never leaves your device
- **Responsive Design**: Beautiful, modern interface that works on all devices

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Webcam/camera access

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## How It Works

1. **Camera Initialization**: The app accesses your camera for mood detection
2. **Mood Suggestion**: The system suggests a mood based on the moment
3. **Music Matching**: Based on your mood, the app suggests curated Spotify playlists
4. **History Tracking**: All mood detections are saved locally for personal insights

## Privacy & Security

- **Local Processing**: All processing happens in your browser
- **No Data Upload**: Camera data never leaves your browser
- **Local Storage**: Mood history is stored locally on your device
- **No Third-party Tracking**: Complete privacy protection

## Development

### Project Structure
```
src/
├── components/          # Reusable React components
├── pages/              # Main application pages
├── context/            # React context for state management
├── services/           # Service integrations
└── types/              # TypeScript type definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Deployment

The React app can be deployed to any static hosting service (Netlify, Vercel, etc.)

## Troubleshooting

### Camera Issues
- Ensure camera permissions are granted
- Check if camera is being used by other applications
- Try refreshing the page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Spotify** for music playlist integration
- **React** and **TypeScript** communities

## Support

For issues and questions:
- Check the troubleshooting section
- Open an issue on GitHub

---

**Note**: This app requires camera access and works best with good lighting conditions.