const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v4/program-orders.fixtures');

describe('v4 RO.program()', () => {
  beforeAll(() => {
    RO.config.set('apiVersion', 'v4');
  });

  beforeEach(() => {
    fixtures();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('orders', () => {
    const programId = 33;
    const program = RO.program(programId);
    const programOrdersUrl = `/programs/${programId}/orders`;

    beforeAll(() => {
      RO.config.set('clientId', 'programTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
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

    describe('getSummary()', () => {
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

          nock(RO.urls.apiBaseUrl(), {
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
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const params = { member_id: 38 };
          const apiCall = nock(RO.urls.apiBaseUrl(), {
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

    describe('getAll()', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
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
          const apiCall = nock(RO.urls.apiBaseUrl(), {
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
          const scope = nock(RO.urls.apiBaseUrl(), {
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

    describe('get()', () => {
      it('should pass an object to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
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
          const apiCall = nock(RO.urls.apiBaseUrl(), {
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
          const scope = nock(RO.urls.apiBaseUrl(), {
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

    describe('create()', () => {
      it('should fire the callback with an error when the params object is missing a member object', () => {
        return new Promise(done => {
          const params = {
            items: [{}],
          };

          program.orders.create(params, (error, data) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual(
              'must pass a member object in the params object to `orders.create()`'
            );

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
            expect(error.message).toEqual(
              'must pass an items array in the params object to `orders.create()`'
            );

            expect(data).toEqual(undefined);

            done();
          });
        });
      });

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const newOrder = {
            member: {
              id: 'abc123ppp',
            },
            items: [{}],
          };

          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .post(programOrdersUrl, newOrder)
            .reply(200, {
              result: {},
            });

          program.orders.create(newOrder, (error, result) => {
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
              id: 'ab098765',
              full_name: 'Prit Kaur',
              email: 'prit@hotmail.co.uk',
              phone: '123-456-7890',
              address: {
                address: '123 Some Town',
                city: 'Sheffield',
                country_code: 'UK',
                postal_code: 'S32 5N9',
              },
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
          const apiCall = nock(RO.urls.apiBaseUrl(), {
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

    describe('update()', () => {
      const orderId = 'abcd1234asdf0987';
      const orderUpdateUrl = `/programs/${programId}/orders/${orderId}`;

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

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const params = {
            payment_status: 'PAID',
            payment_status_notes: 'The user paid, and we thank them for it.',
          };

          nock(RO.urls.apiBaseUrl(), {
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
          const apiCall = nock(RO.urls.apiBaseUrl(), {
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

    describe('updateOrderItems()', () => {
      const orderId = 'abcd1234asdf0987';
      const updateOrderItemsUrl = `/programs/${programId}/orders/${orderId}/order_items`;

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

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const params = {
            order_item_payment_status: 'PAID',
            status_notes: 'The user paid, and we thank them for it.',
          };

          nock(RO.urls.apiBaseUrl(), {
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
          const apiCall = nock(RO.urls.apiBaseUrl(), {
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
  });
});
