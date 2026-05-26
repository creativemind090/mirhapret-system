import React from "react";
import { Composition } from "remotion";
import { LaunchingSoon } from "./LaunchingSoon";
import { EidLaunch } from "./EidLaunch";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Instagram Story / Reel — 1080×1920 @ 30fps, 14s */}
      <Composition
        id="LaunchingSoon"
        component={LaunchingSoon}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Eid Store Opening Reel — 1080×1920 @ 30fps, 15s */}
      <Composition
        id="EidLaunch"
        component={EidLaunch}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
