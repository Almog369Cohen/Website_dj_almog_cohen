"use client";
import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

interface SoundtrackLayer {
  id: string;
  sound: Howl | null;
  volume: number;
  active: boolean;
}

export default function AdaptiveSoundtrack({ 
  scrollProgress = 0,
  isPlaying = false 
}: { 
  scrollProgress: number;
  isPlaying: boolean;
}) {
  const [isMuted, setIsMuted] = useState(true);
  const layersRef = useRef<SoundtrackLayer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio layers
  useEffect(() => {
    if (isInitialized) return;

    // Mock audio layers (in production, use real audio files)
    const layers: SoundtrackLayer[] = [
      {
        id: 'ambient',
        sound: null, // new Howl({ src: ['/audio/ambient.mp3'], loop: true, volume: 0 })
        volume: 0.3,
        active: true
      },
      {
        id: 'bass',
        sound: null, // new Howl({ src: ['/audio/bass.mp3'], loop: true, volume: 0 })
        volume: 0.4,
        active: false
      },
      {
        id: 'melody',
        sound: null, // new Howl({ src: ['/audio/melody.mp3'], loop: true, volume: 0 })
        volume: 0.5,
        active: false
      },
      {
        id: 'drums',
        sound: null, // new Howl({ src: ['/audio/drums.mp3'], loop: true, volume: 0 })
        volume: 0.6,
        active: false
      }
    ];

    layersRef.current = layers;
    setIsInitialized(true);

    return () => {
      // Cleanup
      layers.forEach(layer => {
        if (layer.sound) {
          layer.sound.stop();
          layer.sound.unload();
        }
      });
    };
  }, [isInitialized]);

  // Update layers based on scroll progress
  useEffect(() => {
    if (!isInitialized || !isPlaying || isMuted) return;

    const layers = layersRef.current;

    // Scroll 0-25%: Ambient only
    if (scrollProgress < 0.25) {
      layers[0].active = true;
      layers[1].active = false;
      layers[2].active = false;
      layers[3].active = false;
    }
    // Scroll 25-50%: Ambient + Bass
    else if (scrollProgress < 0.5) {
      layers[0].active = true;
      layers[1].active = true;
      layers[2].active = false;
      layers[3].active = false;
    }
    // Scroll 50-75%: Ambient + Bass + Melody
    else if (scrollProgress < 0.75) {
      layers[0].active = true;
      layers[1].active = true;
      layers[2].active = true;
      layers[3].active = false;
    }
    // Scroll 75-100%: All layers
    else {
      layers[0].active = true;
      layers[1].active = true;
      layers[2].active = true;
      layers[3].active = true;
    }

    // Fade layers in/out
    layers.forEach(layer => {
      if (!layer.sound) return;
      
      const targetVolume = layer.active ? layer.volume : 0;
      layer.sound.fade(layer.sound.volume(), targetVolume, 1000);
      
      if (layer.active && !layer.sound.playing()) {
        layer.sound.play();
      }
    });
  }, [scrollProgress, isPlaying, isMuted, isInitialized]);

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    layersRef.current.forEach(layer => {
      if (layer.sound) {
        if (isMuted) {
          layer.sound.play();
        } else {
          layer.sound.pause();
        }
      }
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleMute}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-blue/40 bg-black/60 backdrop-blur-md transition-all hover:scale-110 hover:border-brand-blue hover:bg-black/80 hover:shadow-[0_0_30px_rgba(5,156,192,0.5)]"
        aria-label={isMuted ? 'Unmute soundtrack' : 'Mute soundtrack'}
      >
        {isMuted ? (
          <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
        
        {/* Audio levels visualization */}
        {!isMuted && (
          <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 gap-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="w-1 rounded-full bg-brand-blue"
                style={{
                  height: `${8 + Math.sin(Date.now() * 0.001 + i) * 8}px`,
                  opacity: scrollProgress > (i * 0.25) ? 1 : 0.2
                }}
              />
            ))}
          </div>
        )}
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden rounded-lg bg-black/80 px-3 py-2 text-xs text-white backdrop-blur-md group-hover:block">
        {isMuted ? 'הפעל פסקול' : 'השתק פסקול'}
      </div>
    </div>
  );
}
