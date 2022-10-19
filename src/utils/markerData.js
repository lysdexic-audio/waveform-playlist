import { barsToPixels, barsToSamples, fround } from "./conversions";

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
    markerTriplet: 1,
    bigStep: 1 / 4,
    bigStepTriplet: 1 / 6,
    smallStep: 1 / 16,
    smallStepTriplet: 1 / 12,
    secondStep: 1 / 16,
    secondStepTriplet: 1 / 24,
  },
  700: {
    marker: 1 / 4 ,
    markerTriplet: 1 / 6,
    bigStep: 1 / 8,
    bigStepTriplet: 1 / 12,
    smallStep: 1 / 16,
    smallStepTriplet: 1 / 24,
    secondStep: 1 / 32,
    secondStepTriplet: 1 / 48 
  },
  200: {
    marker: 1 / 16 ,
    markerTriplet: 1 / 24,
    bigStep: 1 / 8,
    bigStepTriplet: 1 / 12,
    smallStep: 1 / 16,
    smallStepTriplet: 1 / 24,
    secondStep: 1 / 32,
    secondStepTriplet: 1 / 48 
  },
};

//export var markerPixelLimit = 



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


/**
 * Use the resolution and tempo to return the Tempo marker and annotation intervals in pixels
   TODO: Refactor to use a general minimum pixel distance for drawing marker lines
      TODO: No triplet tempo markers only grid (like Ableton)
      TODO: 10px marker = Bar 
      TODO:  5px marker = Beat
      TODO:  2px marker = Quaver
    TODO: Refactor to use a general minimum pixel distance for drawing marker _annotations_
 */
export function getTempoMarkerIntervals(
  resolution,
  sampleRate,
  tempo,
  beatsPerBar,
) {
  const scaleInfo = getScaleInfo(resolution, "tempo");
  const pixPerBar = barsToPixels(1, beatsPerBar, resolution, sampleRate, tempo);
  const pixPerBeat = pixPerBar / beatsPerBar;
  const pixPerQuaver = pixPerBeat / 2;
  const pixPerSemiQuaver = pixPerBeat / 4;
  const pixPerSec = sampleRate / resolution;

  //console.log("resolution", resolution, sampleRate, tempo)
  //console.log("pixPerBar", pixPerBar, "pixPerBeat", pixPerBeat, "pixPerQuaver", pixPerQuaver, "pixPerSemiQuaver", pixPerSemiQuaver); 

  return {
    stepInterval: pixPerBar,
    largeStepInterval: pixPerBeat,
    smallStepInterval: pixPerQuaver,
    annotationInterval: pixPerBeat,
  };
}

/**
 * Use the selected note division to return the Tempo grid interval in pixels
 */
export function getTempoGridIntervals(
  resolution,
  sampleRate,
  tempo,
  beatsPerBar,
  noteDivision
) {
  const scaleInfo = getScaleInfo(resolution, "tempo");
  const pixPerBar = barsToPixels(1, beatsPerBar, resolution, sampleRate, tempo);
  return {
    stepInterval: pixPerBar * noteDivision,
    bigStepInterval: pixPerBar * noteDivision * 2.0,
    beatInterval: pixPerBar / beatsPerBar,
    barInterval: pixPerBar
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
