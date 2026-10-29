'use client';

import { BookStatus } from '@/types/book';
import { CheckCircle2, Clock, RotateCcw, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BookStatus;
  dueDate?: string | null;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, dueDate, className = '', showIcon = true }: StatusBadgeProps) {
  const isOverdue =
    status === 'Issued' && dueDate && new Date(dueDate).getTime() < Date.now();

  if (isOverdue) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
      >
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
        <span>Overdue</span>
      </span>
    );
  }

  if (status === 'Available') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        <span>Available</span>
      </span>
    );
  }

  if (status === 'Issued') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
      >
        {showIcon && <Clock className="w-3.5 h-3.5 text-blue-600" />}
        <span>Issued / Borrowed</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
    >
      {showIcon && <RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
      <span>Returned</span>
    </span>
  );
}
