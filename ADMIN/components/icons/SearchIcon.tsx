import { ComponentProps } from "react";

export default function SearchIcon(props: ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <g clipPath="url(#clip0_67_42)">
                <path
                    d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M21.4998 21.5001L17.5708 17.571" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_67_42">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
