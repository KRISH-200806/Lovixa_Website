import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}>
      <img
        src="/images/lovixa-logo.png"
        alt="LOVIXA COSMETIC"
        style={{
          maxHeight: '42px',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}

export default Logo
