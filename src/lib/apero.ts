const API_URL = import.meta.env.VITE_APERO_API_URL as string | undefined;
const API_KEY = import.meta.env.VITE_APERO_API_KEY as string | undefined;
const PROJECT_ID = import.meta.env.VITE_APERO_PROJECT_ID as string | undefined;

export interface ApiProject {
  id: string;
  title: string;
  /** Optional — this collection currently has no year/description/stack fields */
  year?: string;
  description?: string;
  stack?: string[];
  variant: 'abstract' | 'mockup';
  image?: string;
  link?: string;
}

interface ApiImage {
  url?: string;
}

interface ApiEntryData {
  naam?: string;
  link?: string;
  image?: ApiImage;
}

interface ApiEntry {
  id: string;
  data: ApiEntryData;
  hidden: boolean;
  children?: { id: string; data: Record<string, unknown> }[];
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** Matches the "project" collection's actual shape: naam / link / image. */
function normalize(entry: ApiEntry): ApiProject | null {
  const d = entry.data ?? {};
  const title = str(d.naam);
  if (!title) return null;

  const image = str(d.image?.url);

  return {
    id: entry.id,
    title,
    variant: image ? 'mockup' : 'abstract',
    image,
    link: str(d.link),
  };
}

/**
 * Fetches published projects from Apero. Returns null (never throws) when
 * the API isn't configured yet or the request fails, so callers can fall
 * back to static content without special-casing errors.
 */
export async function fetchProjects(): Promise<ApiProject[] | null> {
  if (!API_URL || !API_KEY || !PROJECT_ID || API_URL.includes('REPLACE_ME')) {
    return null;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        query: `{
          publicEntries(collectionSlug: "project", projectId: "${PROJECT_ID}") {
            id
            data
            hidden
            children { id data }
          }
        }`,
      }),
    });
    if (!res.ok) return null;

    const { data, errors } = (await res.json()) as {
      data?: { publicEntries: ApiEntry[] };
      errors?: unknown;
    };
    if (errors || !data?.publicEntries) return null;

    const projects = data.publicEntries
      .filter((e) => !e.hidden)
      .map(normalize)
      .filter((p): p is ApiProject => p !== null);

    return projects.length ? projects : null;
  } catch {
    return null;
  }
}
