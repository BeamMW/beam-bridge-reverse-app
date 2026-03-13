import React from 'react';

type IconProps = {
  className?: string;
  title?: string;
};

export const BeamMark: React.FC<IconProps> = ({ className = '', title = 'BEAM' }) => {
  // Static mark matching the bridge app icon style (currentColor + opacity layers).
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 57 40"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g fill="none">
        <path fill="currentColor" opacity="0.85" d="M28 0L52 40H4L28 0Zm0 13L17 33h22L28 13Z" />
        <path fill="currentColor" opacity="0.6" d="M28 18l8 13H21z" />
      </g>
    </svg>
  );
};

export const BridgeArrow: React.FC<IconProps> = ({ className = '', title = 'Bridge direction' }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NetworkIcon: React.FC<{ chainId?: string | number; className?: string }> = ({
  chainId,
  className = '',
}) => {
  const normalizedChainId = typeof chainId === 'string' ? Number(chainId) : chainId;
  const title = normalizedChainId === 42161 ? 'Arbitrum' : normalizedChainId === 1 ? 'Ethereum' : 'Network';

  if (normalizedChainId === 1) {
    return (
      <svg viewBox="0 0 256 417" className={className} aria-label={title} role="img">
        <title>{title}</title>
        <path
          d="M127.9 0L124.7 10.9v270.1l3.2 3.2 127.9-75.6L127.9 0z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M127.9 0L0 208.6l127.9 75.6V0z" fill="currentColor" opacity="0.65" />
        <path d="M127.9 306.6l-1.8 2.2v106.9l1.8 0.5 128-180.3-128 70.7z" fill="currentColor" opacity="0.9" />
        <path d="M127.9 416.2V306.6L0 235.9l127.9 180.3z" fill="currentColor" opacity="0.65" />
        <path d="M127.9 284.2l127.9-75.6-127.9-58.1v133.7z" fill="currentColor" opacity="0.75" />
        <path d="M0 208.6l127.9 75.6V150.5L0 208.6z" fill="currentColor" opacity="0.55" />
      </svg>
    );
  }

  if (normalizedChainId === 42161) {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-label={title} role="img">
        <title>{title}</title>
        <path
          d="M32 3.5 56.7 17.8v28.4L32 60.5 7.3 46.2V17.8L32 3.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          opacity="0.9"
        />
        <g transform="scale(0.2689)">
          <path
            d="M135.889 136.336L124.853 166.611C124.554 167.453 124.554 168.37 124.853 169.212L143.838 221.305L165.796 208.619L139.442 136.336C138.844 134.671 136.487 134.671 135.889 136.336Z"
            fill="currentColor"
            opacity="0.65"
          />
          <path
            d="M158.015 85.4221C157.416 83.7568 155.059 83.7568 154.461 85.4221L143.426 115.697C143.126 116.539 143.126 117.456 143.426 118.298L174.53 203.585L196.488 190.899L158.015 85.4221Z"
            fill="currentColor"
            opacity="0.65"
          />
          <path
            d="M111.949 63.7168H90.72C89.1301 63.7168 87.7087 64.7085 87.1663 66.2054L41.6602 191.011L63.6183 203.698L113.726 66.2616C114.193 65.0266 113.277 63.7168 111.949 63.7168Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M149.095 63.7168H127.866C126.276 63.7168 124.855 64.7085 124.312 66.2054L72.3535 208.712L94.3117 221.399L150.872 66.2616C151.321 65.0266 150.404 63.7168 149.095 63.7168Z"
            fill="currentColor"
            opacity="0.9"
          />
        </g>
      </svg>
    );
  }

  return (
    <span
      className={className}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '999px',
        border: '1px solid currentColor',
        fontSize: '10px',
        fontWeight: 700,
        color: 'currentColor',
        opacity: 0.7,
      }}
    >
      ?
    </span>
  );
};
