import { factoryFour } from '../src/index';

const settings = {
  component: (params: any, subcomponents?: any) => {
    // mock component
    return `rendered with ${JSON.stringify(params)}`;
  },
  params: {
    a: 'a', b: 'b', c: 'c', d: 'd', e: 'e'
  }
};

describe('factoryFour', () => {
  test('rendering', () => {
    const Factory = factoryFour(settings); // note: not a constructor

    console.log(Factory.start());
    expect(Factory.params).toEqual(settings.params);
  });
});
