export function samplesToSeconds(samples, sampleRate) {
  return samples / sampleRate;
}

export function secondsToSamples(seconds, sampleRate) {
  return seconds * sampleRate;
}

export function samplesToPixels(samples, resolution) {
  return samples / resolution;
}

export function pixelsToSamples(pixels, resolution) {
  return pixels * resolution;
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
  return bars * (secsPerBar * (sampleRate / resolution));
}

export function barsToSeconds(bars, beatsPerBar, tempo) {
  return bars * ((beatsPerBar * 60) / tempo);
}

export function secondsToBars(seconds, beatsPerBar, tempo) {
  return seconds * barsToSeconds(1, beatsPerBar, tempo);
}

export function barsToSamples(bars, beatsPerBar, tempo, sampleRate) {
  return secondsToSamples(barsToSeconds(bars, beatsPerBar, tempo), sampleRate);
}

export function fround(value, numPlaces) {
  return parseFloat((Math.round(value * Math.pow(10, numPlaces)) * Math.pow(0.1, numPlaces)).toFixed(numPlaces))
}

export function iround(value, thresh) {
  const fract = value - Math.trunc(value);
  return (1-fract < thresh || fract <= thresh) ? Math.round(value) : value;
}
