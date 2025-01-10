import { logger } from '../logger';
import { WidgetRegistry } from './WidgetRegistry';
import type { WidgetConfig, WidgetData } from './types';

export class WidgetLoader {
  private static instance: WidgetLoader;
  private registry: WidgetRegistry;

  private constructor() {
    this.registry = WidgetRegistry.getInstance();
  }

  public static getInstance(): WidgetLoader {
    if (!WidgetLoader.instance) {
      WidgetLoader.instance = new WidgetLoader();
    }
    return WidgetLoader.instance;
  }

  public async loadWidget(config: WidgetConfig): Promise<WidgetData | null> {
    try {
      const widget = this.registry.getWidget(config.type);
      if (!widget) {
        throw new Error(`Widget type ${config.type} not found`);
      }

      const data = await widget.fetchData(config);
      return data;
    } catch (err) {
      logger.error(`Failed to load widget ${config.type}`, {
        context: { error: err, config },
        source: 'WidgetLoader'
      });
      return null;
    }
  }

  public async loadWidgets(configs: WidgetConfig[]): Promise<Map<string, WidgetData>> {
    const results = new Map<string, WidgetData>();
    
    await Promise.all(
      configs.map(async config => {
        const data = await this.loadWidget(config);
        if (data) {
          results.set(config.id, data);
        }
      })
    );

    return results;
  }
}