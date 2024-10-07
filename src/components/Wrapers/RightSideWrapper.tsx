"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import RightPanel from "../rightPanel/RightPanel";

export default function RightPanelWrapper({
  hideRightPanel,
}: {
  hideRightPanel?: boolean;
}) {
  const isMobile = useIsMobile(600);

  if (isMobile === null) {
    return null;
  }

  if (hideRightPanel || isMobile) return null;

  return <RightPanel />;
}
