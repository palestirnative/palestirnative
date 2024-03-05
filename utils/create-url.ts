import { AppState } from "../routes/_middleware.ts";

export function createCategoryURL(categorySlug: string, state: AppState) {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(categorySlug ? { category: categorySlug } : {}),
    ...(state.country ? { country: state.country } : {}),
  };

  const secondSlashIndex = state.pathname?.indexOf('/', 1);
  const formattedPath = secondSlashIndex !== -1 ? state.pathname?.slice(0, secondSlashIndex) : state.pathname;

  return `${formattedPath}?${new URLSearchParams(params).toString()}`;
}

export const createURL = (state : AppState, countryCode: string) => {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(state.category ? { category: state.category } : {}),
    ...(countryCode && countryCode !== "all" ? { country: countryCode } : {}),
  };

  return `${state.pathname}?${new URLSearchParams(params).toString()}`;
};
