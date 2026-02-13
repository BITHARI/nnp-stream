import { ComponentProps } from "react";

export default function HomeIcon(props: ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <g clipPath="url(#clip0_67_16)">
        <path
          d="M4 8.5L4 21C4 21.5523 4.44771 22 5 22L19 22C19.5523 22 20 21.5523 20 21L20 8.5"
          strokeLinecap="round"
        />
        <path d="M22 10L12 2L2 10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 17C10.5 16.1716 11.1716 15.5 12 15.5C12.8284 15.5 13.5 16.1716 13.5 17V21H10.5V17Z" />
        <circle cx="12" cy="10" r="1.5" />
        <path d="M17.5 6.5V3.5C17.5 2.94772 17.0523 2.5 16.5 2.5V2.5C15.9477 2.5 15.5 2.94772 15.5 3.5V5" />
      </g>
      <defs>
        <clipPath id="clip0_67_16">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
