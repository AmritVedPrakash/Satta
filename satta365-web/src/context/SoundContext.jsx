import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const [bgMusicEnabled, setBgMusicEnabled] = useState(() => {
    return localStorage.getItem('satta_bg_music') === 'true';
  });
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('satta_sfx');
    return saved !== null ? saved === 'true' : true;
  });

  const bgAudioRef = useRef(null);

  useEffect(() => {
    bgAudioRef.current = new Audio('/audio/tune.mp3');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.4;

    if (bgMusicEnabled) {
      bgAudioRef.current.play().catch(() => {
        // Autoplay may be blocked until user interacts
      });
    }

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  const toggleBgMusic = () => {
    const next = !bgMusicEnabled;
    setBgMusicEnabled(next);
    localStorage.setItem('satta_bg_music', String(next));
    if (bgAudioRef.current) {
      if (next) {
        bgAudioRef.current.play().catch(e => console.log('Audio play error:', e));
      } else {
        bgAudioRef.current.pause();
      }
    }
  };

  const toggleSoundEffects = () => {
    const next = !soundEffectsEnabled;
    setSoundEffectsEnabled(next);
    localStorage.setItem('satta_sfx', String(next));
  };

  const playEffect = (type = 'click') => {
    if (!soundEffectsEnabled) return;
    try {
      const audio = new Audio(type === 'roulette' ? '/audio/song.mp3' : '/audio/tune.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio error
    }
  };

  return (
    <SoundContext.Provider
      value={{
        bgMusicEnabled,
        soundEffectsEnabled,
        toggleBgMusic,
        toggleSoundEffects,
        playEffect,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);

