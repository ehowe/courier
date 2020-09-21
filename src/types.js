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
  "Ace": string,
  "FormUrlEncoded": Array<PairT>,
}

export type BodyTypeT = "json" | "xml" | "yaml" | "x-www-form-urlencoded"
