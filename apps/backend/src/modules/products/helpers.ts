export function normalizedProductSlug(name: string): string {
  return name.toUpperCase().replaceAll('-', ' ');
}
