// cn — utility for merging Tailwind class names.
// Combines clsx (handles conditionals/arrays) with tailwind-merge (resolves
// conflicting Tailwind classes, e.g. "p-2 p-4" → "p-4").

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
