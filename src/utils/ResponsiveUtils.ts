/**
 * Responsive utility functions for handling different screen sizes and orientations
 */

import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';

// Screen dimensions utilities

export interface ScreenDimensions {
  width: number;
  height: number;
  isSmallScreen: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  pixelRatio: number;
}

export const getScreenDimensions = (): ScreenDimensions => {
  const { width, height } = Dimensions.get('window');
  const pixelRatio = PixelRatio.get();

  return {
    width,
    height,
    isSmallScreen: width < 375,
    isTablet: width >= 768,
    isLandscape: width > height,
    pixelRatio,
  };
};

export const getResponsivePadding = (basePadding: number): number => {
  const { isSmallScreen, isTablet } = getScreenDimensions();

  if (isSmallScreen) {
    return basePadding * 0.8;
  } else if (isTablet) {
    return basePadding * 1.2;
  }
  return basePadding;
};

export const getResponsiveFontSize = (baseFontSize: number): number => {
  const { isSmallScreen, isTablet } = getScreenDimensions();

  if (isSmallScreen) {
    return baseFontSize * 0.9;
  } else if (isTablet) {
    return baseFontSize * 1.1;
  }
  return baseFontSize;
};

export const getMaxMessageWidth = (): string => {
  const { width, isTablet } = getScreenDimensions();

  if (isTablet) {
    return '60%';
  } else if (width > 400) {
    return '75%';
  }
  return '85%';
};

export const getInputHeight = (baseHeight: number): number => {
  const { isSmallScreen, isTablet } = getScreenDimensions();

  if (isSmallScreen) {
    return baseHeight * 0.9;
  } else if (isTablet) {
    return baseHeight * 1.1;
  }
  return baseHeight;
};

export const getKeyboardVerticalOffset = (): number => {
  const { isSmallScreen, isTablet } = getScreenDimensions();

  if (isTablet) {
    return 100;
  } else if (isSmallScreen) {
    return 60;
  }
  return 80;
};

// Hook for responsive dimensions
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = React.useState(getScreenDimensions());

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        isSmallScreen: window.width < 375,
        isTablet: window.width >= 768,
        isLandscape: window.width > window.height,
        pixelRatio: PixelRatio.get(),
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Performance optimization utilities
export const shouldUpdateComponent = (
  prevProps: any,
  nextProps: any,
  keysToCheck: string[],
): boolean => {
  return keysToCheck.some(key => prevProps[key] !== nextProps[key]);
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
