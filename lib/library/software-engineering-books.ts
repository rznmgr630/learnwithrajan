export const SOFTWARE_ENGINEERING_BOOKS = [
  { slug: "database-internals", title: "Database Internals", author: "Alex Petrov", fileId: "1qJ2nsODw3T26QeAyDPMwsSSwM2AwVNEl" },
  { slug: "the-pragmatic-programmer", title: "The Pragmatic Programmer", author: "Andrew Hunt and David Thomas", fileId: "1Ui4W0ilCjJqr6SKUeAZ6DHeRS-Y34J2b" },
  { slug: "a-philosophy-of-software-design", title: "A Philosophy of Software Design", author: "John Ousterhout", fileId: "1luZClAFs3ZciYejUdZ4w-bAZsbEihP0X" },
  { slug: "programming-typescript", title: "Programming TypeScript", author: "Boris Cherny", fileId: "1o04z_lwIukDriBS4a_PiYNbhXZiIkFuL" },
  { slug: "refactoring", title: "Refactoring: Improving the Design of Existing Code", author: "Martin Fowler", fileId: "1vmaEZSyO-nINMDHMppYyxqeL3mzAIjTN" },
  { slug: "design-patterns", title: "Design Patterns", author: "Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides", fileId: "1i83kjjSpzGfxj9K7Tdt3l7hboAOnGdde" },
  { slug: "designing-data-intensive-applications", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", fileId: "1XvDFqh6_0jUUGPEnGl_4lAv_Z-JO7cGM" },
  { slug: "clean-architecture", title: "Clean Architecture: A Craftsman's Guide to Software Structure and Design", author: "Robert C. Martin", fileId: "1qMInMbU81LtwseUIFmXeYX1lf4nNARYx" },
  { slug: "computer-systems-a-programmers-perspective", title: "Computer Systems: A Programmer's Perspective", author: "Randal E. Bryant and David R. O'Hallaron", fileId: "1r_7OvAp0r4mRdRvIVLTVxIw-6Nt0ZwBp" },
  { slug: "operating-systems-three-easy-pieces", title: "Operating Systems: Three Easy Pieces", author: "Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau", fileId: "1y5vzXSur0zFyTPqnPSEiaTpYGbT-1k4V" },
] as const;

export function getSoftwareEngineeringBook(slug: string) {
  return SOFTWARE_ENGINEERING_BOOKS.find((book) => book.slug === slug);
}
