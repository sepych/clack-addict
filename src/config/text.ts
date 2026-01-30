export const TEXT_SAMPLES = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "How vexingly quick daft zebras jump",
  "Sphinx of black quartz, judge my vow",
  "Two driven jocks help fax my big quiz",
  "To be or not to be, that is the question",
  "All the world's a stage, and all the men and women merely players",
  "It was the best of times, it was the worst of times",
  "Call me Ishmael. Some years ago - never mind how long precisely",
  "In a hole in the ground there lived a hobbit",
];

export function getRandomSample(): string {
  const sample = TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)];
  return sample ?? TEXT_SAMPLES[0] ?? "";
}
