type LineProps = {
    color?: string,
    className?: string,
    height?: number,
    width?: number
}

// Basic line, only used for the 404 page
export default function Line({color, className, height, width}: LineProps): JSX.Element {
    return <div className={`${className}`} style={{backgroundColor: color ? color: "#555", height: height, width: width}}/>
}
