import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/images/lovixa-icon.png"
        alt="LOVIXA"
        style={{
          maxHeight: '28px',
          maxWidth: '28px',
          borderRadius: '6px',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}

export default Icon
