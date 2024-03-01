import slugify from "https://esm.sh/slugify@latest";

export default function slugifyName(name: string) {
  return slugify(name, { lower: true });
}
