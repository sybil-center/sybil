/**
 * Provided types of VC
 * Can be converted to Kebab case and turn over by {@link urlCredentialType} and {@link toCredentialType}
 */
export type CredentialType =
  | "VerifiableCredential"
  | "EmptyCredential"
  | "EthAddressExistsCredential"
  | "EthAccountOwnershipCredential"
  | "TwitterAccountOwnershipCredential"
  | "GitHubAccountOwnershipCredential"
  | "DiscordAccountOwnershipCredential"

