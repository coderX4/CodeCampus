import { useRef, useEffect } from "react"
import * as monaco from "monaco-editor"

export default function MonacoEditor({
                                         value,
                                         onChange,
                                         language = "javascript",
                                         theme = "vs-dark",
                                         options = {},
                                         height = "500px",
                                     }) {
    const editorRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        if (containerRef.current) {
            // Initialize Monaco editor
            editorRef.current = monaco.editor.create(containerRef.current, {
                value,
                language,
                theme,
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                ...options,
            })

            // Set up change event handler
            editorRef.current.onDidChangeModelContent(() => {
                onChange(editorRef.current.getValue())
            })

            // Clean up
            return () => {
                editorRef.current.dispose()
            }
        }
    }, []) // Only run once on mount

    // Update editor value when prop changes
    useEffect(() => {
        if (editorRef.current) {
            const currentValue = editorRef.current.getValue()
            if (value !== currentValue) {
                editorRef.current.setValue(value)
            }
        }
    }, [value])

    // Update language when prop changes
    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel()
            if (model) {
                monaco.editor.setModelLanguage(model, language)
            }
        }
    }, [language])

    // Update theme when prop changes
    useEffect(() => {
        if (editorRef.current) {
            monaco.editor.setTheme(theme)
        }
    }, [theme])

    // Update options when they change
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions(options)
        }
    }, [options])

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: height,
                overflow: "hidden",
                border: "1px solid rgba(var(--primary), 0.1)",
            }}
        />
    )
}

