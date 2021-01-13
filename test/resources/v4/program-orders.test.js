const faker = require('faker');
const nock = require('nock');

const fixtures = require('../../fixtures/v4/program-orders.fixtures');
const { mockConfig } = require('../../test-helpers/mock-config');
const RO = require('../../..');
const orders = require('../../../lib/resources/orders');
const { orderRecipientFactory } = require('../../../lib/resources/order-recipients');

describe('RO.program.orders', () => {
  beforeEach(() => {
    fixtures();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe.each([undefined, faker.internet.url()])('`piiServerUrl` set to %s', piiServerUrl => {
    const LOCALE = 'en-CA';
    const programId = faker.random.number();
    const programOrdersUrl = `/programs/${programId}/orders`;
    let program;

    beforeAll(() => {
      const config = mockConfig({
        piiServerUrl,
        supportedLocales: piiServerUrl ? [LOCALE] : undefined,
        clientId: 'programTest123',
        clientSecret: 'itsATestGetUsedToIt',
      });
      RO.config.init(config);

      program = RO.program(programId);
    });

    afterAll(() => {
      RO.config.reset();
    });

    it('should have the correct context ID', () => {
      expect(program.orders.contextId).toEqual(programId);
    });

    it('should have the correct context', () => {
      expect(program.orders.contextTypeName).toEqual('programs');
    });

    describe('#getSummary', () => {
      it.todo('should call the base API URL');

      it('should fire the callback with an error when the params object is missing', () => {
        return new Promise(done => {
          program.orders.getSummary((error, data) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual('A params object is required');

            expect(data).toEqual(undefined);

            done();
          });
        });
      });

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const params = { member_id: 38 };

          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get(`/programs/${programId}/orders/summary`)
            .query(params)
            .once()
            .reply(200, {
              result: {},
            });

          program.orders.getSummary(params, (error, data) => {
            expect(data).toEqual(expect.any(Object));

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const params = { member_id: 38 };
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/orders/summary')
            .query(params)
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).orders.getSummary(params, (error, orderList) => {
            expect(error).toEqual(null);

            expect(typeof orderList).toBe('object');
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('#getAll', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get(programOrdersUrl)
            .query({
              member_id: 38,
            })
            .reply(200, {
              result: [],
            });

          program.orders.getAll(38, (error, data) => {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/orders')
            .query({
              member_id: 3,
            })
            .reply(200, {
              result: [],
            });

          RO.program(12).orders.getAll(3, (error, orderList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(orderList)).toBe(true);
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', () => {
        return new Promise(done => {
          const params = {
            page: 7,
            per_page_count: 50,
          };
          const scope = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/55/orders')
            .query({ ...params, member_id: 777 })
            .reply(200, {
              result: [],
            });

          RO.program(55).orders.getAll(777, params, (error, programsList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(programsList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('#get', () => {
      it('should pass an object to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get(`/programs/${programId}/orders/555`)
            .once()
            .reply(200, {
              result: {},
            });

          program.orders.get(555, (error, data) => {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/orders/929')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).orders.get(929, (error, orderList) => {
            expect(error).toEqual(null);

            expect(typeof orderList).toBe('object');
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', () => {
        return new Promise(done => {
          const params = {
            use_program_order_code: false,
          };
          const scope = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/orders/929')
            .query(params)
            .reply(200, {
              result: {},
            });

          RO.program(12).orders.get(929, params, (error, data) => {
            expect(error).toEqual(null);

            expect(typeof data).toBe('object');
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('#create', () => {
      it('invokes the correct order `create` method', () => {
        const expectedFn = () => (piiServerUrl ? orderRecipientFactory('programs').create : orders('programs').create);
        expect(program.orders.create.toString()).toEqual(expectedFn().toString());
      });

      // FIXME: create order method is different for PII and non-PII configs
      if (!piiServerUrl) {
        describe('validation', () => {
          it('should fire the callback with an error when the params object is missing a member object', () => {
            return new Promise(done => {
              const params = {
                items: [{}],
              };

              program.orders.create(params, (error, data) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toEqual('must pass a member object in the params object to `orders.create()`');

                expect(data).toEqual(undefined);

                done();
              });
            });
          });

          it('should fire the callback with an error when the params object is missing an items array', () => {
            return new Promise(done => {
              const params = {
                member: { id: 'hoo_ah' },
              };

              program.orders.create(params, (error, data) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toEqual('must pass an items array in the params object to `orders.create()`');

                expect(data).toEqual(undefined);

                done();
              });
            });
          });

          it("should pass an error to the callback when a params object isn't passed", () => {
            return new Promise(done => {
              RO.program(133000).orders.create((error, result) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toEqual('A params object is required');

                expect(result).toEqual(undefined);

                done();
              });
            });
          });
        });

        it('should pass an object to the callback', () => {
          return new Promise(done => {
            const newOrder = {
              member: {
                id: faker.random.uuid(),
                accept_language: LOCALE,
              },
              items: [{}],
            };

            const createOrderCall = nock(RO.urls.getApiBaseUrl(), {
              reqHeaders: {
                Authorization: 'Bearer abcd1234rewardTime',
              },
            })
              .post(programOrdersUrl, newOrder)
              .reply(200, {
                result: {},
              });

            program.orders.create(newOrder, (error, result) => {
              expect(createOrderCall.isDone()).toBe(true);
              expect(error).toEqual(null);
              expect(typeof result).toBe('object');

              done();
            });
          });
        });

        it('should make an HTTP get request to the correct URL', () => {
          return new Promise(done => {
            const newOrder = {
              member: {
                id: faker.random.uuid(),
                full_name: 'Prit Kaur',
                email: 'prit@hotmail.co.uk',
                phone: '123-456-7890',
                address: {
                  address: '123 Some Town',
                  city: 'Sheffield',
                  country_code: 'UK',
                  postal_code: 'S32 5N9',
                },
                accept_language: LOCALE,
              },
              items: [
                {
                  item_order_token: '3o2u4902u3joo4',
                  quantity: 2,
                  member_spend: [
                    {
                      currency_code: 'XRO-ABC',
                      amount: '1000',
                    },
                  ],
                  retail_value: {
                    currency_code: 'USD',
                    amount: '20',
                  },
                },
              ],
            };

            const apiCall = nock(RO.urls.getApiBaseUrl(), {
              reqHeaders: {
                Authorization: 'Bearer abcd1234rewardTime',
              },
            })
              .post(programOrdersUrl, newOrder)
              .reply(200, {
                result: { status: 'OK' },
              });

            RO.program(programId).orders.create(newOrder, (error, result) => {
              expect(error).toEqual(null);

              expect(result).toEqual({ status: 'OK' });
              expect(apiCall.isDone()).toEqual(true);

              done();
            });
          });
        });
      }
    });

    describe('#update', () => {
      const orderId = 'abcd1234asdf0987';
      const orderUpdateUrl = `/programs/${programId}/orders/${orderId}`;

      describe('validation', () => {
        it('should fire the callback with an error when no id is passed as the first argument', () => {
          return new Promise(done => {
            const params = {
              payment_status: 'PAID',
              payment_status_notes: 'The user paid, and we thank them for it.',
            };

            program.orders.update(params, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual(
                'must pass an order (external) ID as the first argument to `orders.update()`'
              );

              expect(data).toEqual(undefined);

              done();
            });
          });
        });

        it('should fire the callback with an error when no params object is passed', () => {
          return new Promise(done => {
            program.orders.update(orderId, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual('A params object is required');

              expect(data).toEqual(undefined);

              done();
            });
          });
        });
      });

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const params = {
            payment_status: 'PAID',
            payment_status_notes: 'The user paid, and we thank them for it.',
          };

          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .patch(orderUpdateUrl, params)
            .reply(200, {
              result: {},
            });

          program.orders.update(orderId, params, (error, result) => {
            expect(error).toEqual(null);
            expect(typeof result).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const params = {
            payment_status: 'PAID',
            payment_status_notes: 'The user paid, and we thank them for it.',
          };
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .patch(orderUpdateUrl, params)
            .reply(200, {
              result: { status: 'OK' },
            });

          RO.program(programId).orders.update(orderId, params, (error, result) => {
            expect(error).toEqual(null);

            expect(result).toEqual({ status: 'OK' });
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('#updateOrderItems', () => {
      const orderId = 'abcd1234asdf0987';
      const updateOrderItemsUrl = `/programs/${programId}/orders/${orderId}/order_items`;

      describe('validation', () => {
        it('should fire the callback with an error when no id is passed as the first argument', () => {
          return new Promise(done => {
            const params = {
              order_item_payment_status: 'PAID',
              status_notes: 'The user paid, and we thank them for it.',
            };

            program.orders.updateOrderItems(params, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual(
                'must pass an order (external) ID as the first argument to `orders.updateOrderItems()`'
              );

              expect(data).toEqual(undefined);

              done();
            });
          });
        });

        it('should fire the callback with an error when no params object is passed', () => {
          return new Promise(done => {
            program.orders.updateOrderItems(orderId, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual('A params object is required');

              expect(data).toEqual(undefined);

              done();
            });
          });
        });
      });

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const params = {
            order_item_payment_status: 'PAID',
            status_notes: 'The user paid, and we thank them for it.',
          };

          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .patch(updateOrderItemsUrl, params)
            .reply(200, {
              result: {},
            });

          program.orders.updateOrderItems(orderId, params, (error, result) => {
            expect(error).toEqual(null);
            expect(typeof result).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const params = {
            order_item_payment_status: 'PAID',
            status_notes: 'The user paid, and we thank them for it.',
          };
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .patch(updateOrderItemsUrl, params)
            .reply(200, {
              result: { status: 'OK' },
            });

          RO.program(programId).orders.updateOrderItems(orderId, params, (error, result) => {
            expect(error).toEqual(null);

            expect(result).toEqual({ status: 'OK' });
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('#cancel', () => {
      let orderId;
      let params;
      let refundReasonDescription;
      let programOrderCancelUrl;

      beforeEach(() => {
        orderId = faker.random.uuid();
        params = {
          order_suppliers: [{}],
        };
        refundReasonDescription = faker.lorem.word();
        programOrderCancelUrl = `${programOrdersUrl}/${orderId}/refunds?refund_reason_description=${refundReasonDescription}`;
      });

      it('invokes the correct order `cancel` method', () => {
        const expectedFn = () => orders('programs').cancel;
        expect(program.orders.cancel.toString()).toEqual(expectedFn().toString());
      });

      describe('validation', () => {
        it('should fire the callback with an error when the orderId param is missing', () => {
          return new Promise(done => {
            program.orders.cancel(undefined, refundReasonDescription, params, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual('must pass an orderId to `orders.cancel()`');

              expect(data).toEqual(undefined);

              done();
            });
          });
        });

        it('should fire the callback with an error when the params is missing', () => {
          return new Promise(done => {
            program.orders.cancel(orderId, refundReasonDescription, undefined, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual('A params object is required');

              expect(data).toEqual(undefined);

              done();
            });
          });
        });

        it('should fire the callback with an error when the param refundReasonDescription is missing', () => {
          return new Promise(done => {
            program.orders.cancel(orderId, undefined, params, (error, data) => {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toEqual('must pass an refundReasonDescription param to `orders.cancel()`');

              expect(data).toEqual(undefined);

              done();
            });
          });
        });

        it('should pass an object to the callback', () => {
          return new Promise(done => {
            const cancelOrderCall = nock(RO.urls.getApiBaseUrl(), {
              reqHeaders: {
                Authorization: 'Bearer abcd1234rewardTime',
              },
            })
              .post(programOrderCancelUrl, params)
              .reply(200, {
                result: {},
              });

            program.orders.cancel(orderId, refundReasonDescription, params, (error, result) => {
              expect(cancelOrderCall.isDone()).toBe(true);
              expect(error).toEqual(null);
              expect(typeof result).toBe('object');

              done();
            });
          });
        });

        it('should make an HTTP get request to the correct URL', () => {
          return new Promise(done => {
            const apiCall = nock(RO.urls.getApiBaseUrl(), {
              reqHeaders: {
                Authorization: 'Bearer abcd1234rewardTime',
              },
            })
              .post(programOrderCancelUrl, params)
              .reply(200, {
                result: { status: 'OK' },
              });
            RO.program(programId).orders.cancel(orderId, refundReasonDescription, params, (error, result) => {
              expect(error).toEqual(null);

              expect(result).toEqual({ status: 'OK' });
              expect(apiCall.isDone()).toEqual(true);

              done();
            });
          });
        });
      });
    });
  });
});
