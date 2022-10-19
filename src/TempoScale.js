import h from "virtual-dom/h";

import { secondsToPixels, barsToSeconds, iround } from "./utils/conversions";
import TimeScaleHook from "./render/TimeScaleHook";
import { tempoinfo, getScaleInfo, getTempoMarkerIntervals } from "./utils/markerData";

/**
 TODO: Select dropdown change to Bars, Beats
 TODO: Only redraw tempo markers on Zoom
 */

class TempoScale {
  constructor(
    duration,
    offset,
    samplesPerPixel,
    sampleRate,
    marginLeft = 0,
    colors,
    tempo,
  ) {
    this.duration = duration;
    this.offset = offset;
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
    this.marginLeft = marginLeft;
    this.colors = colors;
    this.tempo = tempo;
    this.tempoinfo = tempoinfo;
  }

  static annotation(pix, annotation, bold, size) {
      return h(
      "div.time",
      {
        attributes: {
          style: `position: absolute; left: ${pix}px; top: ${size === "small" ? "5px" : "0px"}; font-size: ${size === "small" ? "0.65em" : size}; font-weight: ${
            bold ? "bold" : "normal"
          }`,
        },
      },
      [
        annotation
      ]
    )
  }

  /*
    Return time in format mm:ss
  */
  static formatTime(milliseconds) {
    const seconds = milliseconds / 1000;
    let s = seconds % 60;
    const m = (seconds - s) / 60;

    if (s < 10) {
      s = `0${s}`;
    }

    return `${m}:${s}`;
  }

  /*
    Return time in format bars.beats
  */
  static formatTimeBeatsBars(milliseconds, tempo) {
    const beats = milliseconds * (tempo / 60000.0);
    const bars = Math.floor(beats / 4);
    const semiquavers = beats * 4;
    //const beatsDisplay = (beats % 4) + 1;
    const barsDisplay = bars + 1;
    const beatsDisplay = Math.floor(beats % 4) + 1;
    const semiquaversDisplay = Math.floor(semiquavers % 4) + 1;
    return beatsDisplay === semiquaversDisplay === 1 
    ? `${barsDisplay}` 
    : semiquaversDisplay === 1 
    ? `${barsDisplay}.${beatsDisplay}`
    : `${barsDisplay}.${beatsDisplay}.${semiquaversDisplay}`;
  }

  render() {
    // TODO: Refactor to use a general minimum pixel distance for drawing marker lines
      // TODO: No triplet tempo markers only grid (like Ableton)
      // TODO: 10px marker = Bar 
      // TODO:  5px marker = Beat
      // TODO:  2px marker = Quaver
    // TODO: Refactor to use a general minimum pixel distance for drawing marker _annotations_

    const beatsPerBar = 4; //todo user set
    const secPerBar = barsToSeconds(1, beatsPerBar, this.tempo);

    const widthX = secondsToPixels(
      this.duration,
      this.samplesPerPixel,
      this.sampleRate
    );
    const pixPerSec = this.sampleRate / this.samplesPerPixel;
    const pixPerBar = Math.round(secPerBar * pixPerSec);
    const pixOffset = secondsToPixels(
      this.offset,
      this.samplesPerPixel,
      this.sampleRate
    );
    const scaleInfo = getScaleInfo(this.samplesPerPixel, "tempo");
    const canvasInfo = {};
    const timeMarkers = [];
    const end = widthX + pixOffset;
    let counter = 0;

    const { stepInterval, largeStepInterval, smallStepInterval } = getTempoMarkerIntervals(this.samplesPerPixel, this.sampleRate, this.tempo, beatsPerBar);

    let stepIdx = 0;
    for (let i = 0; i < end; i += stepInterval) {
        const pixIndex = Math.floor(i);
        const pix = pixIndex - pixOffset;
        stepIdx++;
        let subStepIdx = 0;
        for(let j = pix; j < (pix+stepInterval || end); j += (stepInterval/4)) {
          subStepIdx++;
          let subSubStepIdx = 0;
          for(let k = j; k < (j+(stepInterval/4) || end); k += (stepInterval/4/4)) {
            subSubStepIdx++;
            if(subSubStepIdx == 1 || subSubStepIdx == 5) continue
            const subSubStepPix = Math.floor(k);
            canvasInfo[subSubStepPix] = 4;
            if(stepInterval/4/4 < 20) continue
            if(stepInterval/4/4 < 30 && (subSubStepIdx % 3 !== 0)) continue
            if(subSubStepPix <= 0) continue
            timeMarkers.push(TempoScale.annotation(subSubStepPix, `${stepIdx}.${subStepIdx}.${subSubStepIdx}`, false, "small"));
          }
          if(subStepIdx == 1 || subStepIdx == 5) continue
          const subStepPix = Math.floor(j);
          canvasInfo[subStepPix] = 6;
          if((subStepPix >= 0) && (stepInterval/4 > 20)) {
            if(stepInterval/4 < 30 && (subStepIdx % 3 == 0) || stepInterval/4 > 30) {
              timeMarkers.push(TempoScale.annotation(subStepPix, `${stepIdx}.${subStepIdx}`, false, "0.95em"));
            }
          }
          if (pixIndex >= pixOffset) {
            canvasInfo[pix] = 10;
            timeMarkers.push(TempoScale.annotation(pix, stepIdx, true, "1em"));
          }
        }
    }

    return h(
      "div.playlist-tempo-scale",
      {
        attributes: {
          style: `position: relative; left: 0; right: 0; margin-left: ${this.marginLeft}px;`,
        },
      },
      [
        timeMarkers,
        h("canvas", {
          attributes: {
            width: widthX,
            height: 30,
            style: "position: absolute; left: 0; right: 0; top: 0; bottom: 0;",
          },
          hook: new TimeScaleHook(
            canvasInfo,
            this.offset,
            this.samplesPerPixel,
            this.duration,
            this.colors
          ),
        }),
      ]
    );
  }
}

export default TempoScale;
