declare module 'lord-icon-element' {
  export function defineElement(lottie: any): void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
        trigger?: 'hover' | 'click' | 'loop' | 'morph';
        colors?: string;
        delay?: number;
        style?: React.CSSProperties;
      };
    }
  }
} 