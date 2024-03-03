import { AppState } from "../routes/_middleware.ts";

export function createCategoryURL(categorySlug: string, state: AppState) {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(categorySlug ? { category: categorySlug } : {}),
    ...(state.country ? { country: state.country } : {}),
  };

  return `${state.pathname}?${new URLSearchParams(params).toString()}`;
}

export const createCountryURL = (state : AppState, countryCode: string) => {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(state.category ? { category: state.category } : {}),
    ...(countryCode && countryCode !== "all" ? { country: countryCode } : {}),
  };

  return `${state.pathname}?${new URLSearchParams(params).toString()}`;
};
