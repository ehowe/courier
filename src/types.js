// @flow

export type PairT = {
  key: string,
  value: string,
  enabled: boolean,
}

export type UrlPairT = {
  [string]: string
}

export type BodyT = {
  "Ace"?: string,
  "FormUrlEncoded"?: Array<PairT>,
  "Response"?: string
}

export type ResponseT = {
  code: number,
  body: BodyT,
  headers: any,
}

export type BasicAuthT = {
  username: string,
  password: string,
}

export type BearerAuthT = {
  token: string,
  prefix: string,
}

export type AuthT = {
  basic: BasicAuthT,
  bearer: BearerAuthT,
}

export type BodyTypeT = "json" | "xml" | "yaml" | "x-www-form-urlencoded"
