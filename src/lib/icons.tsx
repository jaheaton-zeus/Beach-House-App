/**
 * Icons lifted from the Coastal Dark prototypes
 * (design_handoff_shelter_cove_redesign/design-reference/*.dc.html).
 * Paths are copied verbatim so the drawings match the design exactly.
 */

type IconProps = {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
};

function svgProps({ size = 16, stroke = "currentColor", strokeWidth = 1.7 }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function WaveMark(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 34, stroke: props.stroke ?? "#8fc7b6" })}>
      <path d="M2 15c2-2 3.2-2 5 0s2.8 2 5 0 3.2-2 5 0 2.8 2 5 0" />
      <path d="M4 11c1.8-4 5-6 8.5-5.5C9 6.5 8 9 8.5 12" />
      <path d="M4 11c3-1.5 6-.5 7 2" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 13, strokeWidth: props.strokeWidth ?? 2 })}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 15, strokeWidth: props.strokeWidth ?? 2 })}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 15, strokeWidth: props.strokeWidth ?? 2 })}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 14, strokeWidth: props.strokeWidth ?? 2 })}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 13 })}>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

export function CalendarCheckIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 13 })}>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4M9 15l2 2 4-4" />
    </svg>
  );
}

export function GuestsIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 16, stroke: props.stroke ?? "#a7d0c4" })}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function StarIcon({ size = 11, fill = "#6fc79a" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
    </svg>
  );
}

export function RulesIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 19, stroke: props.stroke ?? "#8fc7b6", strokeWidth: props.strokeWidth ?? 1.6 })}>
      <path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
      <path d="M13.5 2.5V7h4.5M8.5 12h7M8.5 16h7" />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  const stroke = props.stroke ?? "#8fc7b6";
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 19, stroke, strokeWidth: props.strokeWidth ?? 1.6 })}>
      <path d="M4.5 9.5a11 11 0 0 1 15 0M7.5 13a6.5 6.5 0 0 1 9 0M10.3 16.4a2.5 2.5 0 0 1 3.4 0" />
      <circle cx="12" cy="19.5" r="1.1" fill={stroke} stroke="none" />
    </svg>
  );
}

export function BikeIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 19, stroke: props.stroke ?? "#8fc7b6", strokeWidth: props.strokeWidth ?? 1.6 })}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5l4-7h5.5l3.5 7M9.5 10.5l3.5 7M14 6.5h2.5M14 6.5l1 4" />
    </svg>
  );
}

export function BeachIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 19, stroke: props.stroke ?? "#8fc7b6", strokeWidth: props.strokeWidth ?? 1.6 })}>
      <path d="M12 4v17M12 8c4-3 8-2 9 0-4-1-7 0-9 2M12 8C8 5 4 6 3 8c4-1 7 0 9 2" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function BedIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 32, stroke: props.stroke ?? "#8fc7b6", strokeWidth: props.strokeWidth ?? 1.5 })}>
      <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18v2M21 18v2M3 13V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M7 11V9.5A1.5 1.5 0 0 1 8.5 8h2A1.5 1.5 0 0 1 12 9.5V11M12 11V9.5A1.5 1.5 0 0 1 13.5 8h2A1.5 1.5 0 0 1 17 9.5V11" />
    </svg>
  );
}

export function BathIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 32, stroke: props.stroke ?? "#8fc7b6", strokeWidth: props.strokeWidth ?? 1.5 })}>
      <path d="M4 12V6.5A2.5 2.5 0 0 1 6.5 4a2 2 0 0 1 2 2M7 8.5h2.5M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2zM6 18l-1.5 2.5M18 18l1.5 2.5" />
    </svg>
  );
}

export function SleepsIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 32, stroke: props.stroke ?? "#8fc7b6", strokeWidth: props.strokeWidth ?? 1.5 })}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9.5" r="2.2" />
      <path d="M3 19v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M15.5 13.5h1A4.5 4.5 0 0 1 21 18v1" />
    </svg>
  );
}

export function SwitchIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 20, stroke: props.stroke ?? "#e8c877" })}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 6h2" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 14, strokeWidth: props.strokeWidth ?? 1.8 })}>
      <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 14, strokeWidth: props.strokeWidth ?? 1.9 })}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 15, strokeWidth: props.strokeWidth ?? 2 })}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 14, strokeWidth: props.strokeWidth ?? 2 })}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 22, strokeWidth: props.strokeWidth ?? 1.8 })}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...svgProps({ ...props, size: props.size ?? 18, stroke: props.stroke ?? "#a7d0c4" })}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}
