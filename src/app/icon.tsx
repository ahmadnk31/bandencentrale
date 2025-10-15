import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
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
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        {/* Tire outer ring */}
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid white',
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
              width: '14px',
              height: '14px',
              border: '1.5px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hub center */}
            <div
              style={{
                width: '6px',
                height: '6px',
                background: 'white',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>
        
        {/* Tread marks */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '50%',
            width: '2px',
            height: '4px',
            background: 'white',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            width: '2px',
            height: '4px',
            background: 'white',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '4px',
            top: '50%',
            width: '4px',
            height: '2px',
            background: 'white',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '4px',
            top: '50%',
            width: '4px',
            height: '2px',
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
