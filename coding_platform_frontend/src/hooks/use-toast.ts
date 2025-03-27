import type React from "react"

import { useState } from "react"

export type ToastProps = {
    id?: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive" | "success"
}

type ToastActionType = "add" | "remove" | "update" | "dismiss"

export type Toast = ToastProps & {
    id: string
    visible: boolean
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    visible: boolean
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type Action =
    | {
    type: "ADD_TOAST"
    toast: ToastProps
}
    | {
    type: "UPDATE_TOAST"
    toast: Partial<ToasterToast> & { id: string }
}
    | {
    type: "DISMISS_TOAST"
    toastId?: string
}
    | {
    type: "REMOVE_TOAST"
    toastId?: string
}

interface State {
    toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    ...state.toasts,
                    {
                        id: action.toast.id || generateId(),
                        title: action.toast.title,
                        description: action.toast.description,
                        action: action.toast.action,
                        visible: true,
                    },
                ].slice(-TOAST_LIMIT),
            }

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
            }

        case "DISMISS_TOAST": {
            const { toastId } = action

            // ! Side effects ! - This could be extracted into a dismissToast() action
            if (toastId) {
                addToRemoveQueue(toastId)
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id)
                })
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            visible: false,
                        }
                        : t,
                ),
            }
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
    }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

type ToastType = Omit<ToasterToast, "id">

function toast({ ...props }: ToastType) {
    const id = generateId()

    const update = (props: ToastProps) =>
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        })

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    // @ts-ignore
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            visible: true,
        },
    })

    return {
        id,
        dismiss,
        update,
    }
}

function useToast() {
    const [state, setState] = useState<State>(memoryState)

    // Subscribe to state changes
    useState(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    })

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    }
}

export { useToast, toast }

