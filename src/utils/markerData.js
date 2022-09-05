import { barsToPixels } from "./conversions";

export var timeinfo = {
  20000: {
    marker: 30000,
    bigStep: 10000,
    smallStep: 5000,
    secondStep: 5,
  },
  12000: {
    marker: 15000,
    bigStep: 5000,
    smallStep: 1000,
    secondStep: 1,
  },
  10000: {
    marker: 10000,
    bigStep: 5000,
    smallStep: 1000,
    secondStep: 1,
  },
  5000: {
    marker: 5000,
    bigStep: 1000,
    smallStep: 500,
    secondStep: 1 / 2,
  },
  2500: {
    marker: 2000,
    bigStep: 1000,
    smallStep: 500,
    secondStep: 1 / 2,
  },
  1500: {
    marker: 2000,
    bigStep: 1000,
    smallStep: 200,
    secondStep: 1 / 5,
  },
  700: {
    marker: 1000,
    bigStep: 500,
    smallStep: 100,
    secondStep: 1 / 10,
  },
};

export var tempoinfo = {
  20000: {
    marker: 16,
    bigStep: 8,
    smallStep: 4,
    secondStep: 4,
  },
  12000: {
    marker: 4,
    bigStep: 2,
    smallStep: 1,
    secondStep: 1,
  },
  10000: {
    marker: 4,
    bigStep: 1,
    smallStep: 1,
    secondStep: 1,
  },
  5000: {
    marker: 4,
    bigStep: 1,
    smallStep: 1 / 4,
    secondStep: 1 / 4,
  },
  2500: {
    marker: 1,
    bigStep: 1 / 2,
    smallStep: 1 / 4,
    secondStep: 1 / 8,
  },
  1500: {
    marker: 1,
    bigStep: 1 / 4,
    smallStep: 1 / 16,
    secondStep: 1 / 16,
  },
  700: {
    marker: 1 / 4,
    bigStep: 1 / 8,
    smallStep: 1 / 16,
    secondStep: 1 / 32,
  },
};

export function getScaleInfo(resolution, markerType) {
  const markerinfo =
    markerType && markerType === "tempo" ? tempoinfo : timeinfo;
  let keys = Object.keys(markerinfo).map((item) => parseInt(item, 10));

  // make sure keys are numerically sorted.
  keys = keys.sort((a, b) => a - b);

  for (let i = 0; i < keys.length; i += 1) {
    if (resolution <= keys[i]) {
      return markerinfo[keys[i]];
    }
  }

  return markerinfo[keys[0]];
}

export function getTempoMarkerIntervals(
  resolution,
  sampleRate,
  tempo,
  beatsPerBar
) {
  const scaleInfo = getScaleInfo(resolution, "tempo");
  const pixPerBar = barsToPixels(1, beatsPerBar, resolution, sampleRate, tempo);
  return {
    stepInterval: scaleInfo.secondStep * pixPerBar,
    bigStepInterval: scaleInfo.bigStep * pixPerBar,
    markerInterval: scaleInfo.marker * pixPerBar,
  };
}

export function getTimeMarkerIntervals(resolution, sampleRate) {
  const scaleInfo = getScaleInfo(resolution, "time");
  const pixPerSec = sampleRate / resolution;
  return {
    stepInterval: scaleInfo.secondStep * pixPerSec,
    bigStepInterval: scaleInfo.bigStep * 0.001 * pixPerSec,
    markerInterval: scaleInfo.marker * 0.001 * pixPerSec,
  };
}
