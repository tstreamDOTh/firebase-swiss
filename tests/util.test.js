require('@babel/polyfill');
import { requestBodyTransformer } from '../src/util';

describe('Test Utils ', () => {
  it('should extract name & age', async () => {
    const transformedBody = requestBodyTransformer({ id: 10, name: 'foo', lastName: 'bar', age: 10 }, ['name', 'age']);
    expect(transformedBody.name).toEqual('foo');
    expect(transformedBody.age).toEqual(10);
    expect(Object.keys(transformedBody).length).toEqual(2);
  });
});
