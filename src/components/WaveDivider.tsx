interface WaveDividerProps {
  /** Color of the section above */
  from: string;
  /** Color of the section below */
  to: string;
  /** Flip the wave direction horizontally */
  flip?: boolean;
}

export default function WaveDivider({ from, to, flip = false }: WaveDividerProps) {
  return (
    <div
      style={{
        backgroundColor: from,
        lineHeight: 0,
        fontSize: 0,
        display: "block",
      }}
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "72px" }}
        aria-hidden="true"
      >
        {flip ? (
          <path
            d="M0,36 C240,72 480,10 720,44 C960,72 1200,18 1440,36 L1440,0 L0,0 Z"
            fill={to}
          />
        ) : (
          <path
            d="M0,36 C240,0 480,62 720,28 C960,0 1200,54 1440,36 L1440,72 L0,72 Z"
            fill={to}
          />
        )}
      </svg>
    </div>
  );
}
