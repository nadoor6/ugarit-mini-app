import { useState, useEffect, useMemo } from 'react';
import { hapticFeedback, } from '@tma.js/sdk';
import { viewport, init, isTMA } from '@tma.js/sdk';

const LoginAnimation = () => {
  const [stage, setStage] = useState(1);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Track window size for responsive scaling
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function initTg() {
      if (await isTMA()) {
        init();

        if (viewport.mount.isAvailable()) {
          await viewport.mount();
          viewport.expand();
        }

        if (viewport.requestFullscreen.isAvailable()) {
          await viewport.requestFullscreen();
        }
      }
    }
    initTg();

  }, []);

  // Animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setStage(2), 800);
    const timer2 = setTimeout(() => setStage(3), 1600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Haptic feedback
  const handleButtonClick = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    console.log('Telegram login button clicked');
  };

  // Calculate responsive scale to fit any screen
  const calculateScale = () => {
    const designWidth = 440;
    const designHeight = 956;
    
    // Get the screen size
    const screenWidth = windowSize.width;
    const screenHeight = windowSize.height;
    
    // Calculate scale based on smallest ratio (to fit completely)
    const widthRatio = screenWidth / designWidth;
    const heightRatio = screenHeight / designHeight;
    
    // Use the smaller ratio to ensure everything fits
    const scale = Math.min(widthRatio, heightRatio) * 0.95; // 95% to give some margin
    
    return scale;
  };

  const scale = useMemo(() => calculateScale(), [windowSize]);

  // Calculate position offsets based on scale
  const getScaledPosition = (value: number) => value * scale;
  const getScaledSize = (value: number) => value * scale;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      {/* Responsive container - scales based on screen size */}
      <div style={{
        width: `${getScaledSize(440)}px`,
        height: `${getScaledSize(956)}px`,
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: 'center center'
      }}>
        {/* Welcome Text - scaled positions */}
        <div style={{
          width: stage === 1 ? `${getScaledSize(1)}px` : `${getScaledSize(406)}px`,
          height: `${getScaledSize(162)}px`,
          left: stage === 1 ? `${getScaledPosition(-12)}px` : `${getScaledPosition(17)}px`,
          top: `${getScaledPosition(397)}px`,
          position: 'absolute',
          overflow: stage === 1 ? 'hidden' : 'visible',
          transition: 'width 0.8s ease, left 0.8s ease'
        }}>
          <div style={{
            width: `${getScaledSize(406)}px`,
            height: `${getScaledSize(162)}px`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{
              color: 'white',
              fontSize: `${getScaledSize(60)}px`,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 100,
              lineHeight: `${getScaledSize(60)}px`
            }}>
              Welcome to<br/>
            </span>
            <span style={{
              color: 'white',
              fontSize: `${getScaledSize(60)}px`,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 900,
              lineHeight: `${getScaledSize(60)}px`
            }}>
              ugarit
            </span>
          </div>
        </div>

        {/* Login Button - scaled positions */}
        <div style={{
          width: `${getScaledSize(378)}px`,
          left: `${getScaledPosition(31)}px`,
          top: stage === 3 ? `${getScaledPosition(879)}px` : `${getScaledPosition(967)}px`,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${getScaledSize(10)}px`,
          transition: 'top 0.8s ease'
        }}>
          <button
            onClick={handleButtonClick}
            style={{
              width: '100%',
              height: `${getScaledSize(58)}px`,
              padding: `${getScaledSize(15)}px ${getScaledSize(12)}px`,
              background: '#007AFF',
              border: 'none',
              borderRadius: `${getScaledSize(12)}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: `${getScaledSize(10)}px`,
              cursor: 'pointer'
            }}
          >
            <span style={{
              color: 'white',
              fontSize: `${getScaledSize(17)}px`,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 600,
              lineHeight: `${getScaledSize(22)}px`
            }}>
              Log in with Telegram
            </span>
          </button>
          
          {/* Person icon (rectangle for stages 1 & 2) */}
          {stage !== 3 && (
            <div style={{
              width: `${getScaledSize(24)}px`,
              height: `${getScaledSize(24)}px`,
              position: 'absolute',
              left: `${getScaledPosition(78)}px`,
              top: `${getScaledPosition(17)}px`
            }}>
              <div style={{
                width: `${getScaledSize(19.30)}px`,
                height: `${getScaledSize(19.80)}px`,
                left: `${getScaledPosition(2.35)}px`,
                top: `${getScaledPosition(2.10)}px`,
                position: 'absolute',
                background: 'white'
              }} />
            </div>
          )}
          
          {/* Person icon (SVG for stage 3) */}
          {stage === 3 && (
            <div style={{
              position: 'absolute',
              left: `${getScaledPosition(78)}px`,
              top: `${getScaledPosition(17)}px`
            }}>
              <svg 
                width={`${getScaledSize(24)}px`} 
                height={`${getScaledSize(24)}px`} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M12 3.89998C9.93798 3.89998 8.26764 5.57001 8.26764 7.62855C8.26764 9.68709 9.93798 11.3571 12 11.3571C14.062 11.3571 15.7323 9.68709 15.7323 7.62855C15.7323 5.57001 14.062 3.89998 12 3.89998ZM6.46764 7.62855C6.46764 4.57451 8.94525 2.09998 12 2.09998C15.0547 2.09998 17.5323 4.57451 17.5323 7.62855C17.5323 10.6826 15.0547 13.1571 12 13.1571C8.94525 13.1571 6.46764 10.6826 6.46764 7.62855ZM4.11957 16.2241C5.15411 15.2699 6.41697 14.9571 7.36762 14.9571H16.6323C17.583 14.9571 18.8458 15.2699 19.8804 16.2241C20.9368 17.1984 21.65 18.7438 21.65 21C21.65 21.497 21.247 21.9 20.75 21.9C20.2529 21.9 19.85 21.497 19.85 21C19.85 19.1418 19.2764 18.1158 18.66 17.5473C18.0218 16.9586 17.2258 16.7571 16.6323 16.7571H7.36762C6.77416 16.7571 5.9782 16.9586 5.33994 17.5473C4.72352 18.1158 4.14998 19.1418 4.14998 21C4.14998 21.497 3.74703 21.9 3.24998 21.9C2.75292 21.9 2.34998 21.497 2.34998 21C2.34998 18.7438 3.06319 17.1984 4.11957 16.2241Z" fill="white"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginAnimation;