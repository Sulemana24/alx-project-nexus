"use client";

import * as React from "react";
import type { ToastProps } from "@/components/ui/toast";

export type ToastActionElement = React.ReactElement;

export type ToasterToast = ToastProps & { id: string; open?: boolean };

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "DISMISS_TOAST"; toastId: string }
  | { type: "REMOVE_TOAST"; toastId: string };

const TOAST_LIMIT = 5;

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const listeners: Array<(state: ToasterToast[]) => void> = [];
let memoryState: ToasterToast[] = [];

function dispatch(action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = [action.toast, ...memoryState].slice(0, TOAST_LIMIT);
      break;

    case "DISMISS_TOAST":
      memoryState = memoryState.map((t) =>
        t.id === action.toastId ? { ...t, open: false } : t
      );
      break;

    case "REMOVE_TOAST":
      memoryState = memoryState.filter((t) => t.id !== action.toastId);
      break;
  }

  listeners.forEach((listener) => listener(memoryState));
}

export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      listeners.splice(index, 1);
    };
  }, []);

  return {
    toast: (props: Omit<ToastProps, "id">) => {
      const id = genId();
      const toastObj: ToasterToast = { ...props, id, open: true };
      dispatch({ type: "ADD_TOAST", toast: toastObj });

      // Auto-remove after 5 seconds
      const timeout = setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: id });
        toastTimeouts.delete(id);
      }, 5000);
      toastTimeouts.set(id, timeout);

      return {
        id,
        dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
      };
    },
    dismiss: (toastId: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    toasts: state,
  };
}
