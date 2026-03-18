import displayFactoryTwo from '../src/factoryTwo';
import displayFactoryTwoPointFive from '../src/displayFactoryTwoPointFive';
import { factoryFour } from '../src/factoryFour';
import Factory from '../src/easyFactory';

describe('Integration Tests', () => {
  describe('Multiple factories working together', () => {
    it('should support creating with displayFactoryTwo and handling output', () => {
      const factory = new displayFactoryTwo();
      const mockComponent = jest.fn().mockReturnValue('<div>Test</div>');

      const result = factory.create({
        component: mockComponent,
        params: { content: 'test' }
      });
      expect(result).toBe('<div>Test</div>');
    });

    it('should support error handling across factories', () => {
      const factory = new displayFactoryTwo();
      const errorComponent = jest.fn().mockImplementation(() => {
        throw new Error('Component error');
      });

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      factory.create({ component: errorComponent, params: {} });
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should behave identically for displayFactoryTwo and displayFactoryTwoPointFive', () => {
      const factoryA = new displayFactoryTwo();
      const factoryB = new displayFactoryTwoPointFive();
      const mockComponent = jest.fn().mockReturnValue('same result');
      const settings = { component: mockComponent, params: { x: 1 }, subcomponents: [] };

      const resultA = factoryA.create(settings);
      const resultB = factoryB.create(settings);

      expect(resultA).toBe(resultB);
    });
  });

  describe('Component composition', () => {
    it('should handle component with subcomponents', () => {
      const factory = new displayFactoryTwo();
      const parentComponent = jest.fn().mockReturnValue('<div>Parent</div>');
      const subcomponents = [
        { render: () => '<span>Sub1</span>' },
        { render: () => '<span>Sub2</span>' }
      ];

      const result = factory.create({
        component: parentComponent,
        params: { title: 'Parent' },
        subcomponents
      });

      expect(parentComponent).toHaveBeenCalledWith({ title: 'Parent' }, subcomponents);
      expect(result).toBe('<div>Parent</div>');
    });
  });

  describe('Template object workflow', () => {
    it('should create template and retrieve partial', () => {
      const factory = new displayFactoryTwo();
      const templateComponent = jest.fn()
        .mockReturnValue('<template><div>Email Template</div></template>');

      const result = factory.create({
        component: templateComponent,
        params: { name: 'John', email: 'john@example.com' }
      });
      factory.setPartial(result);

      expect(factory.getPartial()).toBe('<template><div>Email Template</div></template>');
      expect(factory.isError()).toBe(false);
    });

    it('should handle template error state', () => {
      const factory = new displayFactoryTwo();
      factory.error = true;
      expect(factory.isError()).toBe(true);
    });
  });

  describe('factoryFour workflow', () => {
    it('should flow data through component chain via display()', () => {
      const transformComponent = jest.fn().mockImplementation((params) => {
        return JSON.stringify({ ...params, processed: true });
      });

      const instance = factoryFour({
        component: transformComponent,
        params: { userId: 1, userName: 'Test User' }
      });

      const result = instance.display();
      const parsed = JSON.parse(result);
      expect(parsed.processed).toBe(true);
      expect(parsed.userId).toBe(1);
    });

    it('should update params and reflect them in start()', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockComponent = jest.fn();
      const instance = factoryFour({
        component: mockComponent,
        params: { a: 1 }
      });

      instance.changeParams({ b: 2 });
      instance.start();

      expect(consoleLogSpy).toHaveBeenCalledWith({ a: 1, b: 2 });
      consoleLogSpy.mockRestore();
    });
  });

  describe('Factory subclass pattern', () => {
    it('should create instances through custom factory subclass', () => {
      class Widget {
        constructor(type, label) {
          this.type = type;
          this.label = label;
        }
      }

      class ButtonWidget extends Widget {
        constructor(label) {
          super('button', label);
        }
      }

      class WidgetFactory extends Factory {
        static getClass(context) {
          if (context.type === 'button') return ButtonWidget;
          throw new Error(`Unknown widget: ${context.type}`);
        }
      }

      const btn = WidgetFactory.create({ type: 'button' }, 'Click Me');
      expect(btn).toBeInstanceOf(ButtonWidget);
      expect(btn.type).toBe('button');
      expect(btn.label).toBe('Click Me');
    });
  });

  describe('Edge cases and stress tests', () => {
    it('should handle 100+ rapid sequential creates', () => {
      const factory = new displayFactoryTwo();
      const component = jest.fn().mockReturnValue('result');

      for (let i = 0; i < 100; i++) {
        factory.create({ component, params: { iteration: i } });
      }

      expect(component).toHaveBeenCalledTimes(100);
    });

    it('should handle large parameter objects (1000+ properties)', () => {
      const factory = new displayFactoryTwo();
      const largeParams = {};
      for (let i = 0; i < 1000; i++) {
        largeParams[`key${i}`] = `value${i}`;
      }

      const component = jest.fn().mockReturnValue('result');
      factory.create({ component, params: largeParams });

      expect(component).toHaveBeenCalledWith(largeParams, undefined);
    });

    it('should handle deeply nested objects (50 levels)', () => {
      const factory = new displayFactoryTwo();
      const deepParams = { level: 0 };
      let current = deepParams;
      for (let i = 1; i < 50; i++) {
        current.nested = { level: i };
        current = current.nested;
      }

      const component = jest.fn().mockReturnValue('deep');
      factory.create({ component, params: deepParams });
      expect(component).toHaveBeenCalled();
    });

    it('should recover from errors without affecting subsequent calls', () => {
      const factory = new displayFactoryTwo();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const component = jest.fn()
        .mockImplementationOnce(() => { throw new Error('First error'); })
        .mockReturnValueOnce('recovery');

      factory.create({ component, params: {} });
      const result = factory.create({ component, params: {} });

      expect(result).toBe('recovery');
      expect(factory.isError()).toBe(false);

      consoleLogSpy.mockRestore();
    });
  });
});
