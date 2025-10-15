import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ea580c',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
          position: 'relative',
        }}
      >
        {/* Tire outer ring */}
        <div
          style={{
            width: '140px',
            height: '140px',
            border: '8px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}
        >
          {/* Tire inner ring */}
          <div
            style={{
              width: '90px',
              height: '90px',
              border: '6px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hub */}
            <div
              style={{
                width: '50px',
                height: '50px',
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
                  width: '24px',
                  height: '24px',
                  background: '#ea580c',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Brand text */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Arial',
          }}
        >
          BANDEN
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Arial',
          }}
        >
          CENTRALE
        </div>
        
        {/* Tread marks */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            width: '4px',
            height: '15px',
            background: 'white',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            width: '4px',
            height: '15px',
            background: 'white',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            width: '15px',
            height: '4px',
            background: 'white',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            width: '15px',
            height: '4px',
            background: 'white',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
