export const FICTION_BOOKS = [
  { slug: "the-wonderful-wizard-of-oz", title: "The Wonderful Wizard of Oz", author: "L. Frank Baum", fileId: "1MkBLcmVPrJ4z6BxpuEyBj1ZueY5zDU9T" },
  { slug: "alices-adventures-in-wonderland", title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", fileId: "1jAUD1XSAn1dGreWidoUl5bvIhiE79Pjo" },
  { slug: "pinocchio", title: "Pinocchio", author: "Carlo Collodi", fileId: "1jozuT4GCruBBmSSM77hs7rmns6hs9tV0" },
  { slug: "the-wind-in-the-willows-beginner", title: "The Wind in the Willows Beginner", author: "Kenneth Grahame", fileId: "1YRmca1Oe9F_61EewZNgYXzt44jHcKcD8" },
  { slug: "the-secret-garden", title: "The Secret Garden", author: "Frances Hodgson Burnett", fileId: "1A78-VfLRnVORZKBRu-tgx6t3pfOjpwx9" },
] as const;

export function getFictionBook(slug: string) {
  return FICTION_BOOKS.find((book) => book.slug === slug);
}
