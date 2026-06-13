import { useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

const MIN_LOADER_DURATION = 700;
const LOADER_FADE_DURATION = 300;

const LoadingOverlay = ({ isSceneReady }) => {
  const { active, progress } = useProgress();
  const [hasMetMinimumDuration, setHasMetMinimumDuration] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setHasMetMinimumDuration(true);
    }, MIN_LOADER_DURATION);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const isComplete =
      hasMetMinimumDuration && isSceneReady && !active && progress >= 100;

    if (!isComplete) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setIsVisible(false);
    }, LOADER_FADE_DURATION);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [active, hasMetMinimumDuration, isSceneReady, progress]);

  if (!isVisible) {
    return null;
  }

  const displayedProgress = Math.min(
    Math.round(progress),
    isSceneReady ? 100 : 99,
  );
  const statusText = isSceneReady ? "Loading" : "Preparing scene";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(#bdeeff,#6fb7d8_80%)] transition-opacity duration-300"
      role="status"
      aria-live="polite"
      aria-label={`${statusText} ${displayedProgress}%`}
    >
      <div className="text-center">
        <div className="h-1 w-44 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full origin-left rounded-full bg-white transition-transform duration-200"
            style={{ transform: `scaleX(${displayedProgress / 100})` }}
          />
        </div>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-white">
          {statusText} {displayedProgress}%
        </p>
      </div>
    </div>
  );
};

const SceneReady = ({ onReady }) => {
  const hasReportedReady = useRef(false);

  useFrame(() => {
    if (hasReportedReady.current) {
      return;
    }

    hasReportedReady.current = true;
    requestAnimationFrame(onReady);
  });

  return null;
};

const useIsWideViewport = () => {
  const [isWideViewport, setIsWideViewport] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia("(min-width: 801px)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 801px)");
    const handleChange = (event) => {
      setIsWideViewport(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isWideViewport;
};

const App = () => {
  const isWideViewport = useIsWideViewport();
  const [isSceneReady, setIsSceneReady] = useState(false);
  const camera = useMemo(
    () => ({
      position: [-0.5, 1, isWideViewport ? 4 : 9],
      fov: 45,
    }),
    [isWideViewport],
  );

  return (
    <>
      <UI />
      <LoadingOverlay isSceneReady={isSceneReady} />
      <Canvas
        shadows
        camera={camera}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
            <SceneReady onReady={() => setIsSceneReady(true)} />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
};

export default App;
