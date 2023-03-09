import type { ProofType } from "./proof-type.js";

/**
 * Base interface of VC and its components
 */
export interface IVC {
  /**
   * JSON-LD context
   */
  "@context": string[];

  /**
   * Types of VCs
   */
  type: string[];

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
   * Proof
   */
  proof?: Proof;
}

export type CredentialSubject = Object;

export interface Proof {
  type?: ProofType;

  /**
   * Date as string (date format depends on implementation)
   */
  created?: string;
  proofPurpose?: string;
  verificationMethod?: string; // public key that can verify the signature
  proofValue?: string; // sing
  jws?: string;
}

export interface CredentialStatus {
  id: string;
}
