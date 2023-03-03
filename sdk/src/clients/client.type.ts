import type { SignFn } from "../util/sign-fn.type.js";

export interface IClient<TCredential> {
  issueCredential(signFn: SignFn): Promise<TCredential>;
}
