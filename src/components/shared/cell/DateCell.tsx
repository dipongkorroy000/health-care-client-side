"use client";

import {formatDateTime} from "@/lib/formatters";

interface DateCellProps {
  date?: string | Date;
}

export const DateCell = ({date}: DateCellProps) => <span className="text-sm">{formatDateTime(date!)}</span>;
