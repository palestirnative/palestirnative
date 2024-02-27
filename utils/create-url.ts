export function createCategoryURL(categorySlug: string, state) {
  const params = {
    ...(state.search ? { search: state.search } : {}),
    ...(categorySlug ? { category: categorySlug } : {}),
  };

  return `${state.pathname}?${new URLSearchParams(params).toString()}`;
}
