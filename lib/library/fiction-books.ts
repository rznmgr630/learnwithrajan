export const FICTION_BOOKS = [
  { slug: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", fileId: "1jlVx---okHr_vozxuHv_1mk8kruG2WyC" },
  { slug: "the-wonderful-wizard-of-oz", title: "The Wonderful Wizard of Oz", author: "L. Frank Baum", fileId: "1MkBLcmVPrJ4z6BxpuEyBj1ZueY5zDU9T" },
  { slug: "alices-adventures-in-wonderland", title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", fileId: "1jAUD1XSAn1dGreWidoUl5bvIhiE79Pjo" },
  { slug: "pinocchio", title: "Pinocchio", author: "Carlo Collodi", fileId: "1jozuT4GCruBBmSSM77hs7rmns6hs9tV0" },
  { slug: "the-wind-in-the-willows-beginner", title: "The Wind in the Willows", author: "Kenneth Grahame", fileId: "1YRmca1Oe9F_61EewZNgYXzt44jHcKcD8" },
  { slug: "the-secret-garden", title: "The Secret Garden", author: "Frances Hodgson Burnett", fileId: "1A78-VfLRnVORZKBRu-tgx6t3pfOjpwx9" },
  { slug: "charlottes-web", title: "Charlotte's Web", author: "E. B. White", fileId: "1SgwOIuH1-C_g6pzApmwZ-V_sC7pABpH9" },
  { slug: "the-little-prince", title: "The Little Prince", author: "Antoine de Saint-Exupéry", fileId: "1-SezEgM5hK8DiJ9gCdUPaupo643-eZh1" },
  { slug: "the-tale-of-peter-rabbit", title: "The Tale of Peter Rabbit", author: "Beatrix Potter", fileId: "1I5dhQ6m1bRJWgqoT53kXFM-U2FKIZ-2e" },
  { slug: "winnie-the-pooh", title: "Winnie the Pooh", author: "A. A. Milne", fileId: "18xLG1XFrxYr-jTupz4yMd438EtRG8Guh" },
  { slug: "a-wrinkle-in-time", title: "A Wrinkle in Time", author: "Madeleine L'Engle", fileId: "1Fz66XvsVzOxrR9PZr91iTitnFEvx9Nk3" },
  { slug: "the-neverending-story", title: "The Neverending Story", author: "Michael Ende", fileId: "1DZgzUTDao8qIpwSmlh5wsTQmaLh-tuiG" },
  { slug: "danny-the-champion-of-the-world", title: "Danny the Champion of the World", author: "Roald Dahl", fileId: "18Ylr3wya0mfFKl4R6gX6A0-Pr5uNASHW" },
  { slug: "heidi", title: "Heidi", author: "Johanna Spyri", fileId: "1p5fXEYMPeNbPF4MojbnlNz29MjrnG6bI" },
  { slug: "black-beauty", title: "Black Beauty", author: "Anna Sewell", fileId: "15FIrzcXGG3iZZ7GHTelo7tC9CdjmpB4L" },
  { slug: "the-tao-of-pooh", title: "The Tao of Pooh", author: "Benjamin Hoff", fileId: "1a-bAdKvcEazQDpZy1IYUlgrZ5h0Q8s-1" },
] as const;

export function getFictionBook(slug: string) {
  return FICTION_BOOKS.find((book) => book.slug === slug);
}
