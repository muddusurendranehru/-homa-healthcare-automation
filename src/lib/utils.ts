// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Healthcare specific utilities
export function formatPatientId(id: number): string {
  return `P${id.toString().padStart(6, '0')}`;
}

export function formatAppointmentTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function getStatusColor(status: string): string {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800", 
    inactive: "bg-red-100 text-red-800",
    scheduled: "bg-blue-100 text-blue-800",
  };
  
  return statusColors[status.toLowerCase() as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
}