import { ProofType } from "./proof-type.type.js";
import { CredentialType } from "./credential-type.type.js";

/**
 * Base interface of VC and its components
 */
export interface Credential {
  /**
   * JSON-LD context
   */
  "@context": string[];

  /**
   * Types of VCs
   */
  type: CredentialType[];

  /**
   * VC ID (DID, http URL e.t.c)
   */
  id?: string;

  /**
   * Entity that issued the VC (DID, http URL e.t.c)
   */
  issuer: string;

  /**
   * Issuance date of VC
   */
  issuanceDate: Date;

  /**
   * Expiration date
   */
  expirationDate?: Date;

  /**
   * Contains claims about subject
   */
  credentialSubject?: CredentialSubject;

  credentialStatus?: CredentialStatus;

  /**
   * Proof. This field add
   */
  proof?: Proof;
}

export type CredentialSubject = object;

export interface Proof {
  type?: ProofType;

  /**
   * Date as string (date format depends on implementation)
   */
  created?: string;
  proofPurpose?: string;
  verificationMethod?: string;
  proofValue?: string;
  jws?: string;
}

export interface CredentialStatus {
  id: string;
}

/**
 * Base interface for VC requests
 */
export interface IssueReq {

  /**
   * Entity with executing request defined id of vc
   */
  credentialId?: string;
}

/**
 * For check is credential ready for issue
 */
export interface CanIssueVCEntry {
  /**
   * Session id
   */
  sessionId: string;
}

/**
 * Response on "can issue" request
 */
export interface CanIssueVCResponse {
  /**
   * If true - VC can be issued,
   * else - otherwise
   */
  canIssue: boolean;
}

export interface Challenge {}
