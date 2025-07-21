import { useCallback } from "react";

export const useHover = (currentColors) => {
  const createHoverHandlers = useCallback(
    (hoverColor = currentColors.hover, baseColor = "transparent") => ({
      onMouseEnter: (e) => {
        e.target.style.backgroundColor = hoverColor;
      },
      onMouseLeave: (e) => {
        e.target.style.backgroundColor = baseColor;
      },
    }),
    [currentColors.hover]
  );

  const createOpacityHoverHandlers = useCallback(
    (hoverOpacity = "0.9", baseOpacity = "1") => ({
      onMouseEnter: (e) => {
        e.target.style.opacity = hoverOpacity;
      },
      onMouseLeave: (e) => {
        e.target.style.opacity = baseOpacity;
      },
    }),
    []
  );

  return {
    createHoverHandlers,
    createOpacityHoverHandlers,
  };
};
