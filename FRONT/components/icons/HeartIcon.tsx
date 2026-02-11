import { ComponentProps } from "react";

export default function HeartIcon(props: ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <g clipPath="url(#clip0_67_57)">
                <path
                    d="M11.8297 6.78525L12 7.47059L12.1703 6.78525C12.7231 4.5613 14.7199 3 17.0115 3C19.7666 3 22 5.26769 22 8.02275C22 10.1659 21.1817 12.2512 19.7123 13.8113L13.4559 20.4541C12.6663 21.2925 11.3337 21.2925 10.5441 20.4541L4.28768 13.8113C2.81828 12.2512 2 10.1659 2 8.02275C2 5.26769 4.23342 3 6.98848 3C9.28009 3 11.2769 4.5613 11.8297 6.78525Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_67_57">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
