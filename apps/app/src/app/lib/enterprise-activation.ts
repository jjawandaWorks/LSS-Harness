/** LSS Harness runs locally and does not contact company control planes. */
export function enterpriseActivationRequired(..._args: unknown[]) { return false; }
export function outboundEgressAllowed(..._args: unknown[]) { return false; }
