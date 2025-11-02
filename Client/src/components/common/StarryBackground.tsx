import { Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef } from "react";
import Particles from "react-tsparticles";
import { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // Safe fallback

const StarryBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Optional: Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    }
  }, []);
  
  const particlesInit = async (engine: Engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error("Particles init failed:", error);
    }
  };

  const particlesLoaded = useCallback(async (_: Container | undefined) => {
    //await console.log(container);
  }, []);

  return (
    <Box style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover', // This ensures the video fills the screen and doesn't get distorted
          zIndex: 0,
          opacity: 1, // Adjust as needed
        }}
      >
        <source src="/videos/timelapse.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Particles Container (on top of video) */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
      <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
                color: {
                    value: "transparent"
                }
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    resize: true
                },
                modes: {
                    push: {
                        quantity: 4
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    }
                }, 
            },
            particles: {
              color: {
                value: "random"
              },
              links: {
                color: "#fff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 6,
                straight: false,
              },
              number: {
                  density: {
                      enable: true,
                      area: 800,
                  },
                  value: 80,
              },
              opacity: {
                  value: 0.5,
              },
              shape: {
                  type: "circle",
              },
              size: {
                  value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
    </Box>
  );
};

export default StarryBackground;