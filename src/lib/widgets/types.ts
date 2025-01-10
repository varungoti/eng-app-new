export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface WidgetData {
  id: string;
  type: string;
  data: any;
  error?: string;
  loading?: boolean;
}

export interface Widget {
  fetchData(config: WidgetConfig): Promise<WidgetData>;
}