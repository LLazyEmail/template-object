import { factoryFour } from '../src/factoryFour';

describe('factoryFour', () => {
  describe('function signature', () => {
    it('should exist and be callable', () => {
      expect(typeof factoryFour).toBe('function');
    });

    it('should return an object when called with valid settings', () => {
      const mockComponent = jest.fn().mockReturnValue('result');
      const result = factoryFour({ component: mockComponent, params: {}, subcomponents: [] });
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });
  });

  describe('returned object', () => {
    let instance;
    let mockComponent;

    beforeEach(() => {
      mockComponent = jest.fn().mockReturnValue('rendered');
      instance = factoryFour({
        component: mockComponent,
        params: { name: 'Test', value: 42 },
        subcomponents: []
      });
    });

    it('should expose params on returned object', () => {
      expect(instance.params).toEqual({ name: 'Test', value: 42 });
    });

    it('should expose changeParams method', () => {
      expect(typeof instance.changeParams).toBe('function');
    });

    it('should expose start method', () => {
      expect(typeof instance.start).toBe('function');
    });

    it('should expose display method', () => {
      expect(typeof instance.display).toBe('function');
    });

    it('should merge params via changeParams()', () => {
      instance.changeParams({ extra: 'value' });
      expect(instance.params).toEqual({ name: 'Test', value: 42, extra: 'value' });
    });

    it('should overwrite existing params via changeParams()', () => {
      instance.changeParams({ name: 'Updated' });
      expect(instance.params.name).toBe('Updated');
    });

    it('should call the component function on display()', () => {
      instance.display();
      expect(mockComponent).toHaveBeenCalledWith(
        { name: 'Test', value: 42 },
        []
      );
    });

    it('should return the component result from display()', () => {
      const result = instance.display();
      expect(result).toBe('rendered');
    });
  });

  describe('parameter handling', () => {
    it('should handle empty params object', () => {
      const mockComponent = jest.fn().mockReturnValue('ok');
      expect(() => factoryFour({ component: mockComponent, params: {} })).not.toThrow();
    });

    it('should return consistent results for same input', () => {
      const mockComponent = jest.fn().mockReturnValue('same');
      const params = { id: 1 };
      const result1 = factoryFour({ component: mockComponent, params });
      const result2 = factoryFour({ component: mockComponent, params });
      expect(result1.params).toEqual(result2.params);
    });
  });
});
