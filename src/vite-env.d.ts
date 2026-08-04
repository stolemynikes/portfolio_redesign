/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APERO_API_URL?: string;
  readonly VITE_APERO_API_KEY?: string;
  readonly VITE_APERO_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
