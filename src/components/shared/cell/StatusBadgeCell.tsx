"use client";

import {Badge} from "@/components/ui/badge";

interface StatusBadgeCellProps {
  isDeleted?: boolean;
  activeText?: string;
  deletedText?: string;
}

export const StatusBadgeCell = ({isDeleted, activeText = "Active", deletedText = "Deleted"}: StatusBadgeCellProps) => (
  <Badge variant={isDeleted ? "destructive" : "default"}>{isDeleted ? deletedText : activeText}</Badge>
);
