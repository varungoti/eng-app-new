import type { Widget } from './types';
import { StatsWidget } from './widgets/StatsWidget';
import { ChartWidget } from './widgets/ChartWidget';
import { ListWidget } from './widgets/ListWidget';

export class WidgetRegistry {
  private static instance: WidgetRegistry;
  private widgets: Map<string, Widget> = new Map();

  private constructor() {
    this.registerDefaultWidgets();
  }

  public static getInstance(): WidgetRegistry {
    if (!WidgetRegistry.instance) {
      WidgetRegistry.instance = new WidgetRegistry();
    }
    return WidgetRegistry.instance;
  }

  public registerWidget(type: string, widget: Widget): void {
    this.widgets.set(type, widget);
  }

  public getWidget(type: string): Widget | undefined {
    return this.widgets.get(type);
  }

  private registerDefaultWidgets(): void {
    this.registerWidget('stats', new StatsWidget());
    this.registerWidget('chart', new ChartWidget());
    this.registerWidget('list', new ListWidget());
  }
}