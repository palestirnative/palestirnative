export function createCategoryURL(categorySlug: string, state) {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(categorySlug ? { category: categorySlug } : {}),
    ...(state.country ? { country: state.country } : {}),
  };

  return `${state.pathname}?${new URLSearchParams(params).toString()}`;
}

export const createCountryURL = (state, countryCode: string) => {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(state.category ? { category: state.category } : {}),
    ...(countryCode ? { country: countryCode } : {}),
  };

  return `${state.pathname}?${new URLSearchParams(params).toString()}`;
};
