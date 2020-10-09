const faker = require('faker');

const context = require('../lib/context');
const config = require('../lib/config');
const { orderRecipientFactory } = require('../lib/resources/order-recipients');
const orders = require('../lib/resources/orders');
const { mockConfig } = require('../test/test-helpers/mock-config');

jest.mock('../lib/resources/order-recipients');
orderRecipientFactory.mockReturnValue({ create: jest.fn() });

jest.mock('../lib/resources/orders');
orders.mockReturnValue({ create: jest.fn() });

describe('context', () => {
  describe('contextType', () => {
    it('should create a brands object', () => {
      const brands = context.contextType('brands');

      expect(typeof brands).toBe('object');
    });

    it('should create a programs object', () => {
      const programs = context.contextType('programs');

      expect(typeof programs).toBe('object');
    });

    it('should create a suppliers object', () => {
      const suppliers = context.contextType('suppliers');

      expect(typeof suppliers).toBe('object');
    });

    it('should create an object with the correct context property', () => {
      const brands = context.contextType('brands');
      const foos = context.contextType('foos');

      expect(brands.context).toEqual('brands');
      expect(foos.context).toEqual('foos');
    });
  });
  describe('contextInstance', () => {
    it('should create a programs object', () => {
      const program = context.contextInstance('programs');

      expect(typeof program).toBe('object');
    });

    it('should create an object with the correct contextTypeName and id attributes, and an orders object', () => {
      const program = context.contextInstance('programs', 33);

      expect(program.contextTypeName).toEqual('programs');
      expect(program.id).toEqual(33);
      expect(typeof program.orders).toBe('object');
    });
  });

  describe('piiServerUrl logic', () => {
    beforeEach(() => {
      config.reset();
    });

    it('should return mockOrderRecipientFactory.create if piiServerUrl is present', () => {
      config.init(mockConfig({ piiServerUrl: faker.internet.url() }));
      const program = context.contextInstance('programs');

      expect(program.orders.create).toEqual(orderRecipientFactory().create);
    });

    it('should return mockOrders.create if piiServerUrl is undefined', () => {
      const program = context.contextInstance('programs');

      expect(program.orders.create).toEqual(orders().create);
    });
  });
});
