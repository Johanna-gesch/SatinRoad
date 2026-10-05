/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CartItem {
  cartItemId: string;
  userId: string;
  productId: string;
  user: User;
  product: Product;
}

export interface User {
  userId: string;
  userName: string;
  isAdmin: boolean;
  products: Product[];
  cart: CartItem[];
}

export interface Product {
  productId: string;
  productName: string;
  isBought: boolean;
  /** @format decimal */
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  vendorUserId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  boughtAt?: string | null;
  categories: Category[];
}

export interface Category {
  categoryId: string;
  categoryName: string;
}

export interface CreateCategoryRequestDto {
  categoryName: string;
}

export interface UpdateCategoryRequestDto {
  /** @minLength 1 */
  categoryIdForLookup: string;
  newCategoryName?: string | null;
}

export interface CreateProductDto {
  productName: string;
  categoryIds: string[];
  vendorUserId: string;
  description?: string | null;
  /** @format decimal */
  price: number;
  imageUrl?: string | null;
}

export interface UpdateProductDto {
  productId: string;
  productName: string;
  categoryIds: string[];
  /** @format decimal */
  price?: number | null;
  description?: string | null;
  imageUrl?: string | null;
}

export interface BuyResultDto {
  policeRaid: boolean;
  deletedVendorUserId?: string | null;
  deletedVendorName?: string | null;
  deletedProductNames: string[];
}

export interface BuyProductDto {
  productId: string;
  isBought: boolean;
}

export interface CreateUserDto {
  userName: string;
}

export interface UpdateUserDto {
  userId: string;
  userName: string;
}

export interface UserReturnDto {
  topSellerNames: string[];
}

export interface CartAddToCartParams {
  UserId?: string;
  ProductId?: string;
}

export interface CartRemoveFromCartParams {
  UserId?: string;
  ProductId?: string;
}

export interface CartGetCartParams {
  userId?: string;
}

export interface CategoryGetByIdParams {
  id?: string;
}

export interface CategoryDeleteCategoryParams {
  categoryId?: string;
}

export interface ProductGetProductByIdParams {
  id?: string;
}

export interface ProductDeleteProductParams {
  id?: string;
}

export interface UserGetUserByIdParams {
  userId?: string;
}

export interface UserDeleteUserParams {
  id?: string;
}

export interface UserGetUserWithProductsParams {
  id?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:5000";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title My Title
 * @version 1.0.0
 * @baseUrl http://localhost:5000
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  addToCart = {
    /**
     * No description
     *
     * @tags Cart
     * @name CartAddToCart
     * @request POST:/AddToCart
     */
    cartAddToCart: (
      query: CartAddToCartParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/AddToCart`,
        method: "POST",
        query: query,
        ...params,
      }),
  };
  removeFromCart = {
    /**
     * No description
     *
     * @tags Cart
     * @name CartRemoveFromCart
     * @request DELETE:/RemoveFromCart
     */
    cartRemoveFromCart: (
      query: CartRemoveFromCartParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/RemoveFromCart`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  getCart = {
    /**
     * No description
     *
     * @tags Cart
     * @name CartGetCart
     * @request GET:/GetCart
     */
    cartGetCart: (query: CartGetCartParams = {}, params: RequestParams = {}) =>
      this.request<CartItem[], any>({
        path: `/GetCart`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  createCategory = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryCreateCategory
     * @request POST:/CreateCategory
     */
    categoryCreateCategory: (
      data: CreateCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/CreateCategory`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  getAllCategories = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryGetAllCategories
     * @request GET:/GetAllCategories
     */
    categoryGetAllCategories: (params: RequestParams = {}) =>
      this.request<Category[], any>({
        path: `/GetAllCategories`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getById = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryGetById
     * @request GET:/GetById
     */
    categoryGetById: (
      query: CategoryGetByIdParams = {},
      params: RequestParams = {},
    ) =>
      this.request<Category | null, any>({
        path: `/GetById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateCategory = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryUpdateCategory
     * @request PUT:/UpdateCategory
     */
    categoryUpdateCategory: (
      data: UpdateCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/UpdateCategory`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  deleteCategory = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryDeleteCategory
     * @request DELETE:/DeleteCategory
     */
    categoryDeleteCategory: (
      query: CategoryDeleteCategoryParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DeleteCategory`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  getProducts = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductGetProducts
     * @request GET:/GetProducts
     */
    productGetProducts: (params: RequestParams = {}) =>
      this.request<Product[], any>({
        path: `/GetProducts`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getProductById = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductGetProductById
     * @request GET:/GetProductById
     */
    productGetProductById: (
      query: ProductGetProductByIdParams = {},
      params: RequestParams = {},
    ) =>
      this.request<Product, any>({
        path: `/GetProductById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  createProduct = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductCreateProduct
     * @request POST:/CreateProduct
     */
    productCreateProduct: (
      data: CreateProductDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/CreateProduct`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  updateProduct = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductUpdateProduct
     * @request PUT:/UpdateProduct
     */
    productUpdateProduct: (
      data: UpdateProductDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/UpdateProduct`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  deleteProduct = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductDeleteProduct
     * @request DELETE:/DeleteProduct
     */
    productDeleteProduct: (
      query: ProductDeleteProductParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DeleteProduct`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  buyProduct = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductBuyProduct
     * @request PUT:/BuyProduct
     */
    productBuyProduct: (data: BuyProductDto, params: RequestParams = {}) =>
      this.request<BuyResultDto, any>({
        path: `/BuyProduct`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  uploadImage = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductUploadImage
     * @request POST:/UploadImage
     */
    productUploadImage: (
      data: {
        /** @format binary */
        file?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<Blob, any>({
        path: `/UploadImage`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
  createUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserCreateUser
     * @request POST:/CreateUser
     */
    userCreateUser: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/CreateUser`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  getUsers = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetUsers
     * @request GET:/GetUsers
     */
    userGetUsers: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/GetUsers`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getUserById = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetUserById
     * @request GET:/GetUserById
     */
    userGetUserById: (
      query: UserGetUserByIdParams = {},
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/GetUserById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserUpdateUser
     * @request PUT:/UpdateUser
     */
    userUpdateUser: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/UpdateUser`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  deleteUser = {
    /**
     * No description
     *
     * @tags User
     * @name UserDeleteUser
     * @request DELETE:/DeleteUser
     */
    userDeleteUser: (
      query: UserDeleteUserParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DeleteUser`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  getUserWithProducts = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetUserWithProducts
     * @request GET:/GetUserWithProducts
     */
    userGetUserWithProducts: (
      query: UserGetUserWithProductsParams = {},
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/GetUserWithProducts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getTopsellers = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetTopsellers
     * @request GET:/GetTopsellers
     */
    userGetTopsellers: (params: RequestParams = {}) =>
      this.request<UserReturnDto, any>({
        path: `/GetTopsellers`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
