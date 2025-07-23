import React, { useState } from 'react';
import GlobalContextModal from './GlobalContextModal';

const MoreButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        style={{
          height: '28px',
          width: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgb(134,74,239)',
          borderRadius: '6px',
        }}
        className="shadow hover:bg-[rgba(134,74,239,0.85)] transition-all"
        onClick={() => setOpen(true)}
        aria-label="更多"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="12" r="2" fill="#fff" />
          <circle cx="12" cy="12" r="2" fill="#fff" />
          <circle cx="19" cy="12" r="2" fill="#fff" />
        </svg>
      </button>
      <GlobalContextModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default MoreButton;
