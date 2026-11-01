import { useView } from "../nav";

export function usePathname() {
  return useView().path;
}

export class NotFoundError extends Error {}

export function notFound(): never {
  throw new NotFoundError("not found");
}
