/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Form backend URL (Formspree, Web3Forms, your own API). Unset = demo form that sends nothing. */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Web3Forms access key, sent as the `access_key` field. Optional. */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
