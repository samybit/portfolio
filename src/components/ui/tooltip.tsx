"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import React from "react";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function CustomTooltip({ children, content, side = "top" }: CustomTooltipProps) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    // Target the navbar container to stay within its z-50 stacking context
    const nav = document.getElementById("navbar-container");
    setContainer(nav || document.body);
  }, []);

  return (
    <Tooltip.Provider delay={200}>
      <Tooltip.Root>
        <Tooltip.Trigger render={children as React.ReactElement}>
          {null}
        </Tooltip.Trigger>
        <Tooltip.Portal container={container}>
          <Tooltip.Positioner side={side} sideOffset={6}>
            <Tooltip.Popup className="tooltip-popup">
              {content}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
