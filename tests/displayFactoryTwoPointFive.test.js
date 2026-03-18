import displayFactoryTwoPointFive from '../src/displayFactoryTwoPointFive';

describe('displayFactoryTwoPointFive', () => {
  let factory;

  beforeEach(() => {
    factory = new displayFactoryTwoPointFive();
  });

  describe('module exports', () => {
    it('should export a class (function)', () => {
      expect(typeof displayFactoryTwoPointFive).toBe('function');
    });

    it('should be instantiable', () => {
      expect(() => new displayFactoryTwoPointFive()).not.toThrow();
    });
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

  describe('setPartial() and getPartial()', () => {
    it('should set and get the partial property', () => {
      factory.setPartial('<div>Content</div>');
      expect(factory.getPartial()).toBe('<div>Content</div>');
    });

    it('should return empty string initially', () => {
      expect(factory.getPartial()).toBe('');
    });
  });

  describe('create() - basic functionality', () => {
    it('should call component with params and subcomponents', () => {
      const mockComponent = jest.fn().mockReturnValue('rendered');
      const settings = {
        component: mockComponent,
        params: { id: 1, title: 'Test' },
        subcomponents: []
      };

      const result = factory.create(settings);

      expect(mockComponent).toHaveBeenCalledWith({ id: 1, title: 'Test' }, []);
      expect(result).toBe('rendered');
    });

    it('should handle missing subcomponents', () => {
      const mockComponent = jest.fn().mockReturnValue('ok');
      const result = factory.create({ component: mockComponent, params: {} });
      expect(result).toBe('ok');
      expect(mockComponent).toHaveBeenCalledWith({}, undefined);
    });
  });

  describe('create() - error handling', () => {
    it('should handle component execution errors without throwing', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const errorComponent = jest.fn().mockImplementation(() => {
        throw new Error('Component error');
      });

      expect(() => factory.create({ component: errorComponent, params: {} })).not.toThrow();
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should return undefined when component throws', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const errorComponent = jest.fn().mockImplementation(() => {
        throw new Error('fail');
      });

      const result = factory.create({ component: errorComponent, params: {} });
      expect(result).toBeUndefined();
      consoleLogSpy.mockRestore();
    });
  });

  describe('create() - parameter handling', () => {
    it('should handle complex nested parameters', () => {
      const mockComponent = jest.fn().mockReturnValue('nested');
      const settings = {
        component: mockComponent,
        params: { nested: { level1: { level2: 'value' } } }
      };

      const result = factory.create(settings);
      expect(result).toBe('nested');
    });

    it('should handle array parameters', () => {
      const mockComponent = jest.fn().mockReturnValue('arrays');
      const settings = {
        component: mockComponent,
        params: { items: [1, 2, 3], names: ['a', 'b', 'c'] }
      };

      const result = factory.create(settings);
      expect(result).toBe('arrays');
    });
  });
});
