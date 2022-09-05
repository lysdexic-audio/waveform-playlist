export function samplesToSeconds(samples, sampleRate) {
  return samples / sampleRate;
}

export function secondsToSamples(seconds, sampleRate) {
  return Math.ceil(seconds * sampleRate);
}

export function samplesToPixels(samples, resolution) {
  return Math.floor(samples / resolution);
}

export function pixelsToSamples(pixels, resolution) {
  return Math.floor(pixels * resolution);
}

export function pixelsToSeconds(pixels, resolution, sampleRate) {
  return (pixels * resolution) / sampleRate;
}

export function secondsToPixels(seconds, resolution, sampleRate) {
  return Math.ceil((seconds * sampleRate) / resolution);
}

// export function pixelsToBars(
//   pixels,
//   beatsPerBar,
//   resolution,
//   sampleRate,
//   tempo
// ) {
//   const secsPerBar = barsToSeconds(1, beatsPerBar, tempo);
//   const pixPerSec = pixelsToSeconds(pixels, resolution, sampleRate);
//   Math.round(secsPerBar * pixPerSec);
// }

export function barsToPixels(bars, beatsPerBar, resolution, sampleRate, tempo) {
  const secsPerBar = barsToSeconds(1, beatsPerBar, tempo);
  return bars * Math.round(secsPerBar * (sampleRate / resolution));
}

export function barsToSeconds(bars, beatsPerBar, tempo) {
  return bars * ((beatsPerBar * 60) / tempo);
}

export function secondsToBars(seconds, beatsPerBar, tempo) {
  return seconds * barsToSeconds(1, beatsPerBar, tempo);
}
