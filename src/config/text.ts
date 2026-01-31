export const TEXT_SAMPLES = [
  "the quick brown fox jumps over the lazy dog",
  "pack my box with five dozen liquor jugs",
  "how vexingly quick daft zebras jump",
  "sphinx of black quartz judge my vow",
  "two driven jocks help fax my big quiz",
  "to be or not to be that is the question",
  "all the worlds a stage and all the men and women merely players",
  "it was the best of times it was the worst of times",
  "call me ishmael some years ago never mind how long precisely",
  "in a hole in the ground there lived a hobbit",
];

export function getRandomSample(): string {
  const sample = TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)];
  return sample ?? TEXT_SAMPLES[0] ?? "";
}
