// import 'react';
// import 'react-native';
// import { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';

declare namespace NodeJS {
  interface ProcessEnv {
    // system
    readonly NODE_ENV: 'development' | 'production';
    readonly VERCEL_ENV: 'development' | 'preview' | 'production';
    readonly VERCEL_GIT_COMMIT_REF: string;
    // private
    // public
  }
}

declare module 'react-native' {
  /* namespace AppRegistry {
    function getApplication(key: string): {
      element: JSX.Element;
      getStyleElement: () => JSX.Element;
    };
  }
  interface PressableProps {
    onKeyDown?: null | ((event: ReactKeyboardEvent) => void);
    onHoverIn?: null | ((event: ReactMouseEvent) => void);
  }
  interface ViewProps {
    dataSet?: DOMStringMap;
  }
  interface ViewStyle {
    outlineWidth?: number | string;
  }
  interface PressableStateCallbackType {
    hovered?: boolean;
    focused?: boolean;
  }
  interface LayoutRectangle {
    left: number;
    top: number;
  } */
  /* interface ViewStyle {
    transitionProperty?: string;
    transitionDuration?: string;
  }
  interface TextProps {
    accessibilityComponentType?: never;
    accessibilityTraits?: never;
    href?: string;
    hrefAttrs?: {
      rel: 'noreferrer';
      target?: '_blank';
    };
  }
  interface ViewProps {
    accessibilityRole?: string;
    href?: string;
    hrefAttrs?: {
      rel: 'noreferrer';
      target?: '_blank';
    };
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  } */
}
