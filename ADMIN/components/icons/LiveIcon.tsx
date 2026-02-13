import { ComponentProps } from "react";

export default function LiveIcon(props: ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  );
}
