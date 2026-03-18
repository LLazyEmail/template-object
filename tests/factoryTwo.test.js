import displayFactoryTwo from '../src/factoryTwo';

describe('displayFactoryTwo', () => {
  let factory;

  beforeEach(() => {
    factory = new displayFactoryTwo();
  });

  describe('initialization', () => {
    it('should initialize with error set to false', () => {
      expect(factory.error).toBe(false);
    });

    it('should initialize with empty partial string', () => {
      expect(factory.partial).toBe('');
    });
  });

  describe('isError()', () => {
    it('should return false when no error', () => {
      expect(factory.isError()).toBe(false);
    });

    it('should return true when error is set', () => {
      factory.error = true;
      expect(factory.isError()).toBe(true);
    });
  });

  describe('setPartial()', () => {
    it('should set the partial property', () => {
      const testString = '<div>Test Content</div>';
      factory.setPartial(testString);
      expect(factory.partial).toBe(testString);
    });

    it('should overwrite existing partial', () => {
      factory.setPartial('First');
      factory.setPartial('Second');
      expect(factory.partial).toBe('Second');
    });
  });

  describe('getPartial()', () => {
    it('should return the partial property', () => {
      factory.partial = 'test partial';
      expect(factory.getPartial()).toBe('test partial');
    });

    it('should return empty string initially', () => {
      expect(factory.getPartial()).toBe('');
    });
  });

  describe('create()', () => {
    it('should call component function with params and subcomponents', () => {
      const mockComponent = jest.fn().mockReturnValue('rendered');
      const settings = {
        component: mockComponent,
        params: { name: 'Test' },
        subcomponents: []
      };

      const result = factory.create(settings);

      expect(mockComponent).toHaveBeenCalledWith({ name: 'Test' }, []);
      expect(result).toBe('rendered');
    });

    it('should handle component without subcomponents', () => {
      const mockComponent = jest.fn().mockReturnValue('content');
      const settings = {
        component: mockComponent,
        params: { id: 1 }
      };

      const result = factory.create(settings);

      expect(mockComponent).toHaveBeenCalledWith({ id: 1 }, undefined);
      expect(result).toBe('content');
    });

    it('should catch and log errors from component', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockComponent = jest.fn().mockImplementation(() => {
        throw new Error('Component error');
      });
      const settings = {
        component: mockComponent,
        params: { test: true },
        subcomponents: []
      };

      const result = factory.create(settings);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();

      consoleLogSpy.mockRestore();
    });

    it('should return undefined if component throws error', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockComponent = jest.fn().mockImplementation(() => {
        throw new Error('Render failed');
      });
      const settings = {
        component: mockComponent,
        params: {}
      };

      const result = factory.create(settings);

      expect(result).toBeUndefined();
      consoleLogSpy.mockRestore();
    });

    it('should handle complex component parameters', () => {
      const mockComponent = jest.fn().mockReturnValue('complex');
      const complexParams = {
        items: [{ id: 1, name: 'Item 1' }],
        nested: { prop: 'value' }
      };
      const settings = {
        component: mockComponent,
        params: complexParams,
        subcomponents: [{ type: 'header' }, { type: 'footer' }]
      };

      const result = factory.create(settings);

      expect(mockComponent).toHaveBeenCalledWith(complexParams, [
        { type: 'header' },
        { type: 'footer' }
      ]);
      expect(result).toBe('complex');
    });
  });

  describe('display()', () => {
    it('should call getPartial method', () => {
      const spy = jest.spyOn(factory, 'getPartial');
      factory.display();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
