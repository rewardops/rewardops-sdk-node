declare module '@rewardops/sdk-node' {
  interface SDKError extends Error {
    message: string;
    status: number;
    result: Record<string, unknown> | null;
  }

  type Config = {
    apiServerUrl?: string;
    apiVersion: 'v3' | 'v4' | 'v5';
    piiServerUrl?: string;
    supportedLocales?: string[];
    clientId: string;
    clientSecret: string;
    logFilePath: string;
    logToFile: boolean;
    timeout?: number;
    verbose: boolean;
    quiet?: boolean;
    silent?: boolean;
  };

  interface RequestCallback<Data = unknown, Res = unknown> extends Function {
    (error?: SDKError, data?: Data, response?: Res, request?: unknown): void;
  }

  type Sort = 'NAME' | 'SALE_PRICE' | 'MEMBER_SALE_PRICE' | 'CREATED_DATE' | 'UPDATED_DATE';
  type CustomCategoriesSort = 'category_code' | 'created_at' | 'name';
  type SortOrder = 'ASCENDING' | 'DESCENDING';

  type BaseParams = {
    segment_id?: number;
    segment_code?: string;
    accept_language?: string;
    // Allow BaseParams to be extended
  } & Record<string, unknown>;

  type ItemsParams = {
    filter?: string;
    accept_language?: string;
    detailed?: boolean;
    sort_by?: Sort;
    sort_order?: SortOrder;
    page?: number;
    per_page_count?: number;
    in_stock?: boolean;
    permitted?: boolean;
    q?: string;
  } & BaseParams;

  type GetAllParams = {
    filter?: string;
    q?: string;
    filter_category_code?: string;
    LABEL?: string;
    PROPERTY?: string;
    VARIANT_PROPERTY?: string;
    CUSTOM_PROPERTY?: string;
    CUSTOM_CATEGORY?: string;
  } & BaseParams;

  type GetCustomCategoriesParams = {
    detailed?: boolean;
    include_descendants?: boolean;
  } & BaseParams;

  type CouponPreflightItem = {
    item_order_token: string;
    quantity: number;
  };

  type PostValidateParams = {
    coupon_preflight: {
      owner_type: string;
      owner_code: string;
      coupon_code: string;
      external_member_id: string;
      items: Array<CouponPreflightItem>;
    };
    accept_language?: string;
  } & BaseParams;

  type PostValidateResponse = {
    status: string;
    result: {
      items: [
        {
          order_token: string;
          supplier_item_variant_id: string;
          quantity: number;
          regular_price: {
            amount: number;
            currency_code: string;
          };
          sale_price: {
            amount: number;
            currency_code: string;
          };
          coupon_discount: {
            amount: number;
            currency_code: string;
          };
        }
      ];
      coupon_group: {
        id: number;
        name: string;
        description: string;
        code_prefix: string;
        code_count: number;
        starts_at: string;
        ends_at: string;
        state: string;
        currency_code: string;
        discount_rate: string | null;
        volume_discount_count: number;
        bundle_item_offer_item_count: number | null;
        global_usage_cap_limit: number | null;
        order_usage_cap_limit: number | null;
        member_usage_cap_limit: number | null;
        is_active: boolean;
        updated_at: string;
        created_at: string;
        eligible_item_filter_definition: any; // TODO: put the correct type. Docs were not clear at the time
        bundle_offer_filter_definition: any; // TODO: put the correct type. Docs were not clear at the time
        owner: {
          type: string;
          code: string;
        };
        discount_fixed: {
          amount: number;
          currency_code: string;
        } | null;
        minimum_purchase_amount: {
          amount: number;
          currency_code: string;
        } | null;
      };
      coupon_code: string;
    };
  };

  enum Segment {
    status = 'status',
    nonStatus = 'non_status'
  }

  interface GenericRegisterMemberTagsParams {
    foreign_id: string;
    member_tags: string;
    segment: Segment;
  }

  interface RegisterMemberTagsParams extends GenericRegisterMemberTagsParams {
    program_code: string;
  }

  interface RegisterMemberTagsResponse extends GenericRegisterMemberTagsParams {
    id: string;
  }

  interface Program {
    details: any;
    items: {
      /**
       * Get an array of item JSON objects.
       *
       * @example
       *
       * // Gets an array of item detail objects the program with id 12
       * ro.program(12).items.getAll({}, function(error, data) {
       *   // ...
       * });
       */
      getAll: (params: ItemsParams, callback: RequestCallback) => void;

      /**
       * Get a item JSON object.
       *
       * @example
       *
       * // Get JSON for the item with ID 938
       * ro.program(12).items.get(938, {}, function(error, result, body) {
       *   if (error) {
       *     console.log(error);
       *   } else {
       *     console.log(result);
       *   }
       * });
       */
      get: (id: string, params: BaseParams, callback: RequestCallback) => void;

      /**
       * Get an array of filter parameter JSON objects that are relevant to the program.
       *
       * @example
       *
       * // Gets an array of filter parameter objects for the program with id 12
       * ro.program(12).items.getParameters({}, function(error, data) {
       *   // ...
       * });
       */
      getParameters: (params: GetAllParams, callback: RequestCallback) => void;
    };
    customCategories: {
      programId: string;
      getAll: (params: GetAllCustomCategoriesParams, callback: RequestCallback) => void;
      get: (code: string, params: GetCustomCategoriesParams, callback: RequestCallback) => void;
    };
    rewards: any;
    orders: {
      cancel: (
        orderId: string,
        cancelReason: string,
        requestBody: Record<string, unknown>,
        callback: RequestCallback
      ) => void;
      get: (orderId: string, requestBody: Record<string, unknown>, callback: RequestCallback) => void;
    };
    coupons: {
      postValidate: (params: PostValidateParams, callback: RequestCallback) => PostValidateResponse;
    };
    personalization: {
      registerMemberTags: (member: RegisterMemberTagsParams) => RegisterMemberTagsResponse;
    }
  }

  const program = (id: number, code?: string) => ({} as Program);

  const config = {
    init: (params: Config) => ({} as Config),
    reset: () => ({} as Config),
    getAll: () => ({} as Config),
    get: (attr: string) => null as any,
  };

  const urls = {
    getApiBaseUrl: () => '',
  };

  export { SDKError, Config, Sort, CustomCategoriesSort, SortOrder, Program, program, config, urls };
}
