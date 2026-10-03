export type ProviderIconProps = {
  providerId?: string | null;
  /**
   * Optional provider display name. When the id is an opaque cloud id
   * (e.g. a uuid), the name is what tells us whether it's an Anthropic /
   * OpenAI / OpenCode provider. Ported from dev 022b68a8 ("key cloud
   * providers by cloud id") so the icon still resolves by family.
   */
  providerName?: string | null;
  /** Configured provider base URL, used as a favicon source for custom providers. */
  baseUrl?: string | null;
  className?: string;
  size?: number;
};

export function ProviderIcon(props: ProviderIconProps) {
  const size = props.size ?? 16;
  return <img src="/ext-ollama.svg" alt="Ollama" width={size} height={size} className={props.className} />;
}
