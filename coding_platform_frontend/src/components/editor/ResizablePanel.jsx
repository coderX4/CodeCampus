import { forwardRef, useState, useRef, useEffect } from "react"

const ResizablePanel = forwardRef(({ children, minWidth = 200, minHeight = 200, className = "", ...props }, ref) => {
    const [isResizing, setIsResizing] = useState(false)
    const [size, setSize] = useState({ width: "100%", height: "100%" })
    const panelRef = useRef(null)
    const startPosRef = useRef({ x: 0, y: 0 })
    const startSizeRef = useRef({ width: 0, height: 0 })
    const resizeDirectionRef = useRef(null)

    // Handle resize start
    const handleResizeStart = (e, direction) => {
        e.preventDefault()
        setIsResizing(true)
        resizeDirectionRef.current = direction

        // Store starting position
        startPosRef.current = {
            x: e.clientX,
            y: e.clientY,
        }

        // Store starting size
        const rect = panelRef.current.getBoundingClientRect()
        startSizeRef.current = {
            width: rect.width,
            height: rect.height,
        }

        // Add event listeners for resize
        document.addEventListener("mousemove", handleResize)
        document.addEventListener("mouseup", handleResizeEnd)

        // Change cursor based on direction
        document.body.style.cursor =
            direction === "right"
                ? "ew-resize"
                : direction === "bottom"
                    ? "ns-resize"
                    : direction === "corner"
                        ? "nwse-resize"
                        : "default"
    }

    // Handle resize
    const handleResize = (e) => {
        if (!isResizing) return

        const direction = resizeDirectionRef.current
        const deltaX = e.clientX - startPosRef.current.x
        const deltaY = e.clientY - startPosRef.current.y

        // Calculate new size based on direction
        let newWidth = startSizeRef.current.width
        let newHeight = startSizeRef.current.height

        if (direction === "right" || direction === "corner") {
            newWidth = Math.max(minWidth, startSizeRef.current.width + deltaX)
        }

        if (direction === "bottom" || direction === "corner") {
            newHeight = Math.max(minHeight, startSizeRef.current.height + deltaY)
        }

        // Update size
        setSize({
            width: direction === "right" || direction === "corner" ? `${newWidth}px` : "100%",
            height: direction === "bottom" || direction === "corner" ? `${newHeight}px` : "100%",
        })
    }

    // Handle resize end
    const handleResizeEnd = () => {
        setIsResizing(false)
        document.removeEventListener("mousemove", handleResize)
        document.removeEventListener("mouseup", handleResizeEnd)
        document.body.style.cursor = "default"
    }

    // Clean up event listeners
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleResize)
            document.removeEventListener("mouseup", handleResizeEnd)
        }
    }, [])

    return (
        <div
            ref={(node) => {
                // Assign to both refs
                panelRef.current = node
                if (typeof ref === "function") {
                    ref(node)
                } else if (ref) {
                    ref.current = node
                }
            }}
            className={`relative ${className}`}
            style={{
                width: size.width,
                height: size.height,
                transition: isResizing ? "none" : "width 0.2s, height 0.2s",
            }}
            {...props}
        >
            {children}

            {/* Right resize handle */}
            <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-primary/10"
                onMouseDown={(e) => handleResizeStart(e, "right")}
            />

            {/* Bottom resize handle */}
            <div
                className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-primary/10"
                onMouseDown={(e) => handleResizeStart(e, "bottom")}
            />

            {/* Corner resize handle */}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-primary/20"
                onMouseDown={(e) => handleResizeStart(e, "corner")}
            />
        </div>
    )
})

ResizablePanel.displayName = "ResizablePanel"

export default ResizablePanel

