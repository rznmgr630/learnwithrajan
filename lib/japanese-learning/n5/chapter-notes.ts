const N5_CHAPTER_NOTE_FILE_IDS: Record<number, string> = {
  12: "175s6wkUccSeTNMB7_ofm3CesfB8Xdhup",
  13: "1q0Iq9CEEIDWBT6vjGqWwkN0OI8ztqxTU",
  14: "1zAR5NGmYsIMBJidMzOj4I7rOP4P5Viuz",
  15: "1b3GpeuTy0mhakyPCm3fxbKf08iww8_f3",
  16: "1vFLZUXC4ZuozchUhtnhmx45ijl3q7czC",
  17: "1_iG3igqwjLn-ldVUo---4b6gtGiGj0JS",
  18: "16LXfYCIENjgQNmUIu7aTIkZKvcQdNXGW",
  19: "14XG47bMihb-fQ29lOjo-Vu8rA9ILYg2c",
  20: "1u5deFj-_9L_SLRW1soxApooW_0M6cx2z",
  21: "1PQf52f35bQoz45GRDJdi3Hksrp-GhbRI",
  22: "1FYC3Z7ohi1qL6V0c4edheJ2WnyNNnw_2",
  23: "1IfZ-VPjC_lsPQZV6OLx_xEKU0WHOHA7T",
  24: "1nwOuMTtkw7Oxla3IH5UCvbTARBTPuefP",
  25: "1mSL05_APmVhijhajJvojPon-wzX_2o8Q",
};

export function getN5ChapterNote(slug: string) {
  const match = /^chapter-(\d+)-notes$/.exec(slug);
  const chapter = match ? Number(match[1]) : Number.NaN;
  const fileId = N5_CHAPTER_NOTE_FILE_IDS[chapter];

  return fileId ? { chapter, fileId } : undefined;
}
