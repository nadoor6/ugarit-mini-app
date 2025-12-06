import React, { useState, useEffect } from 'react';
import { hapticFeedback } from '@tma.js/sdk';

const LoginAnimation: React.FC = (): JSX.Element => {
  const [stage, setStage] = useState<number>(1);

  // Simple animation: stage 1 → 2 → 3
  useEffect(() => {
    const timer1 = setTimeout(() => setStage(2), 800);
    const timer2 = setTimeout(() => setStage(3), 1600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleButtonClick = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    console.log('Telegram login button clicked');
  };

  // Calculate responsive scale
  const [scale, setScale] = useState<number>(1);
  
  useEffect(() => {
    const calculateScale = () => {
      const designWidth = 440;
      const designHeight = 956;
      
      const widthScale = window.innerWidth / designWidth;
      const heightScale = window.innerHeight / designHeight;
      
      const newScale = Math.min(widthScale, heightScale, 1.5);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div style={{
        width: '440px',
        height: '956px',
        position: 'relative',
        background: 'white',
        overflow: 'hidden',
        transform: `scale(${scale})`,
        transformOrigin: 'center'
      }}>
        {/* Background */}
        <div style={{
          width: '755px',
          height: '1159px',
          left: '-160.58px',
          top: '-128.76px',
          position: 'absolute',
          background: '#0C0C0C'
        }} />

        {/* Welcome Text */}
        <div style={{
          width: stage === 1 ? '1px' : '406px',
          height: '162px',
          left: stage === 1 ? '-12px' : '17px',
          top: '397px',
          position: 'absolute',
          overflow: stage === 1 ? 'hidden' : 'visible',
          transition: 'width 0.8s ease, left 0.8s ease'
        }}>
          <div style={{
            width: '406px',
            height: '162px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{
              color: 'white',
              fontSize: '60px',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 100,
              lineHeight: '60px'
            }}>
              Welcome to<br/>
            </span>
            <span style={{
              color: 'white',
              fontSize: '60px',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 900,
              lineHeight: '60px'
            }}>
              ugarit
            </span>
          </div>
        </div>

        {/* Login Button */}
        <div style={{
          width: '378px',
          left: '31px',
          top: stage === 3 ? '879px' : '967px',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          transition: 'top 0.8s ease'
        }}>
          <button
            onClick={handleButtonClick}
            style={{
              width: '100%',
              height: '58px',
              padding: '15px 12px',
              background: '#007AFF',
              border: 'none',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <span style={{
              color: 'white',
              fontSize: '17px',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 600,
              lineHeight: '22px'
            }}>
              Log in with Telegram
            </span>
          </button>
          
          {/* Person icon (rectangle for stages 1 & 2) */}
          {stage !== 3 && (
            <div style={{
              width: '24px',
              height: '24px',
              position: 'absolute',
              left: '78px',
              top: '17px'
            }}>
              <div style={{
                width: '19.30px',
                height: '19.80px',
                left: '2.35px',
                top: '2.10px',
                position: 'absolute',
                background: 'white'
              }} />
            </div>
          )}
          
          {/* Person icon (SVG for stage 3) */}
          {stage === 3 && (
            <div style={{
              position: 'absolute',
              left: '78px',
              top: '17px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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