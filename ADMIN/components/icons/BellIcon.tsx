import { ComponentProps } from "react";

export default function BellIcon(props: ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <g clipPath="url(#clip0_67_308)">
                <path d="M6 15.1667V10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10V15.1667C18 15.6913 18.247 16.1852 18.6667 16.5L19.3333 17C19.753 17.3148 20 17.8087 20 18.3333C20 19.2538 19.2538 20 18.3333 20H5.66667C4.74619 20 4 19.2538 4 18.3333C4 17.8087 4.24699 17.3148 4.66667 17L5.33333 16.5C5.75301 16.1852 6 15.6913 6 15.1667Z" />
                <path d="M14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4" />
                <path d="M14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20" />
            </g>
            <defs>
                <clipPath id="clip0_67_308">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
