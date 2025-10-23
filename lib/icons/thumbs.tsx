interface IconProps {
    className?: string
    size?: number
}

export const ThumbsUp = ({ className = "", size = 24 }: IconProps) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-7z" />
        <path d="M7 9H2v11h5V9z" />
    </svg>
)

export const ThumbsDown = ({ className = "", size = 24 }: IconProps) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h7z" />
        <path d="M17 15H22V4h-5v11z" />
    </svg>
)
