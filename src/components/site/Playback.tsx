import { createContext, useContext } from "react";

export const PlaybackContext = createContext({
  ready: true,
  revealed: true,
  markReady: () => {},
});

export const usePlayback = () => useContext(PlaybackContext);