import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'BandenCentrale - Premium Tire Solutions'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '80px',
          }}
        >
          {/* Left side - Text content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              color: 'white',
              maxWidth: '600px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                fontFamily: 'Arial',
              }}
            >
              BandenCentrale
            </h1>
            <p
              style={{
                fontSize: '32px',
                margin: '0 0 30px 0',
                opacity: 0.9,
                fontFamily: 'Arial',
              }}
            >
              Premium Tire Solutions
            </p>
            <p
              style={{
                fontSize: '24px',
                margin: 0,
                opacity: 0.8,
                fontFamily: 'Arial',
              }}
            >
              Expert Installation • Top Brands • Belgium
            </p>
          </div>
          
          {/* Right side - Tire logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Large tire illustration */}
            <div
              style={{
                width: '300px',
                height: '300px',
                border: '20px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Inner tire ring */}
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  border: '15px solid white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Hub */}
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Hub center */}
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background: '#ea580c',
                      borderRadius: '50%',
                    }}
                  />
                </div>
              </div>
              
              {/* Tread marks */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  width: '8px',
                  height: '30px',
                  background: 'white',
                  transform: 'translateX(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '8px',
                  height: '30px',
                  background: 'white',
                  transform: 'translateX(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '50%',
                  width: '30px',
                  height: '8px',
                  background: 'white',
                  transform: 'translateY(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  width: '30px',
                  height: '8px',
                  background: 'white',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
