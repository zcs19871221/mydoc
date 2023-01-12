/* eslint-disable */

export interface OpenApiObject {
  openapi: string;
  paths: PathsObject;
  info: Info;
  components?: ComponentsObject;
}
interface PathsObject {
  /**
   * @Rule 如果包含路径参数，必须在对应额PathItem中找到对应的parameter
   */
  [path: string]: PathItem;
}
interface ComponentsObject {
  schemas?: {
    [key: string]: SchemaObject | Ref<SchemaObject>;
  };
  responses?: {
    [key: string]: ResponseObject | Ref<ResponseObject>;
  };
  parameters?: {
    [key: string]: ParameterObject | Ref<ParameterObject>;
  };
  /**
   * @TODO
   */
  examples?: {};
  requestBodies?: {
    [key: string]: RequestBodyObject | Ref<RequestBodyObject>;
  };
  headers?: {
    [key: string]: HeaderObject | Ref<HeaderObject>;
  };
  /**
   * @TODO
   */
  links?: {};
  /**
   * @TODO
   */
  callbacks?: {};
}

interface PathItem {
  summary?: string;
  description?: string;
  get?: NoBodyOperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: NoBodyOperationObject;
  options?: OperationObject;
  head?: NoBodyOperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  /**
   *
   * 通用参数配置，可以被 子OperationObject中的parameters 覆盖,但是不会消失
   * 不能有重复的ParameterObject
   * @RULE 覆盖和重复判断的id: name-location 来决定是否覆盖
   */
  parameters?: (ParameterObject | Ref<ParameterObject>)[];
}

interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  /**
   * @RULE 全局唯一
   */
  operationId?: string[];
  /**
   *
   * 通用参数配置，可以被 子OperationObject中的parameters 覆盖,但是不会消失
   * 不能有重复的ParameterObject
   * @RULE 覆盖和重复判断的id: name-location 来决定是否覆盖
   */
  parameters?: (ParameterObject | Ref<ParameterObject>)[];

  /**
   *
   * @DoneRULE GET, HEAD, and DELETE 不能包含requestBody
   */
  requestBody?: RequestBodyObject | Ref<RequestBodyObject>;

  responses: ResponsesObject;

  /**
   * @TODO
   */
  callbacks?: {};
  /**
   * @default false
   *
   */
  deprecated?: false;
}

interface NoBodyOperationObject extends OperationObject {
  requestBody: never;
}

interface CommonParameterObject {
  /**
   *
   * @Rule 如果是path参数(in="path")，必须在PathsObject中找到对应的模板参数
   *
   * @Rule 如果是header参数(in="header")，name 为"Accept", "Content-Type" or "Authorization",
   * 那么应该忽略这个定义
   */
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  /**
   * @Rule 当in为path时候，这个required是必选的，值为true
   */
  required?: boolean;
  /**
   *  @default false
   */
  deprecated?: boolean;

  schema?: SchemaObject | Ref<SchemaObject>;

  content: {
    [contentType: string]: MediaTypeObject;
  };

  /**
   * @TODO 序列化相关属性 style,explode 以及example相关
   */
}

type ParameterObject = RequireOnlyOne<
  CommonParameterObject,
  'content' | 'schema'
>;

interface RequestBodyObject {
  description?: string;
  content: {
    [contentType: string]: MediaTypeObject;
  };
  /**
   * @default false
   */
  required?: boolean;
}

interface MediaTypeObject {
  schema: SchemaObject | Ref<SchemaObject>;
  /**
   * 这个属性用来描述如何对参数进行序列化
   * @Rule proppertyInSchema 必须是schema的属性之一
   *
   * @Rule 这个属性只在MediaTypeObject所属的mediaType是
   * @Key multipart  或 @key application/x-www-form-urlencoded
   * 才有效
   */
  encoding?: {
    [proppertyInSchema: string]: EncodingObject;
  };
}

/**
 * @ToDO 根据schema的类型和format，有一些默认值
 */
interface EncodingObject {}

/**
 * @Rule 至少含有一个statusCode的处理值，并且这个是成功的处理
 * statusCode  是字符串数字 200
 * @Rule statusCode 有两种形式：
 * 1. 具体的字符串数字，比如200，404
 * 2. 带x的范围匹配，只能是5种之一: 1XX, 2XX, 3XX, 4XX, and 5XX
 */
interface ResponsesObject {
  [statusCode: string]: ResponseObject | Ref<ResponseObject>;
}
interface ResponseObject {
  description: string;
  /**
   * @Rule 大小写不敏感
   *
   * @Rule 应该无视 Content-Typ 属性,因为在content里定义
   */
  headers?: {
    [headerKey: string]: HeaderObject | Ref<HeaderObject>;
  };

  content?: {
    [contentType: string]: MediaTypeObject;
  };

  /**
   * @TODO
   */
  links?: any;
}
/**
 * TODO
 */
type Ref<T> = T;

interface HeaderObjectBase extends CommonParameterObject {
  name: never;
  in: 'header';
}
type HeaderObject = RequireOnlyOne<HeaderObjectBase, 'content' | 'schema'>;

interface CommonSchemaObject {
  type?: string;
  title?: string;
  description?: string;
  /**
   * @TODO 需要检查default value满足schemaObject类型
   */
  default?: any;
  deprecated?: boolean;
  nullable?: boolean;
  readOnly?: boolean;
  /**
   * @Rule 值是其中之一，可以没有type
   */
  enum?: string[];

  // T1 | T2
  oneOf?: (SchemaObject | Ref<SchemaObject>)[];
  // (T1 & T2)
  allOf?: (SchemaObject | Ref<SchemaObject>)[];
  // T1 | T2 | (T1 & T2)
  anyOf?: (SchemaObject | Ref<SchemaObject>)[];
  not?: SchemaObject | Ref<SchemaObject>;
}

interface StringSchemaObject extends CommonSchemaObject {
  type: 'string';
  format?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

interface NumberSchemaObject extends CommonSchemaObject {
  type: 'number' | 'integer';
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
}

interface BoolSchemaObject extends CommonSchemaObject {
  type: 'bool';
}
interface ArraySchemaObject extends CommonSchemaObject {
  type: 'array';
  items: SchemaObject | Ref<SchemaObject>;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

interface ObjectSchemaObject extends CommonSchemaObject {
  type: 'object';
  properties?: {
    [propName: string]: SchemaObject | Ref<SchemaObject>;
  };
  /**
   * @Rule in Object.keys(properties)
   */
  required?: string[];
  /**
   * @Rule 没有properties属性或者additionalPropertie属性为true或{}，
   * 代表任意对象类型
   */
  additionalProperties?: true | '{}';

  minProperties?: number;
  maxProperties?: number;
}

/**
 * @Rule {}代表任意对象
 */
type SchemaObject =
  | StringSchemaObject
  | NumberSchemaObject
  | BoolSchemaObject
  | ArraySchemaObject
  | ObjectSchemaObject
  | '{}';

interface Info {
  title: string;
  description?: string;
  contact?: Contact;
  license?: License;
  version: string;
}
interface Contact {
  name?: string;
  url?: string;
  email?: string;
}
interface License {
  name: string;
  url?: string;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
