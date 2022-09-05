import h from "virtual-dom/h";

import { secondsToPixels, barsToSeconds } from "./utils/conversions";
import TimeScaleHook from "./render/TimeScaleHook";
import { tempoinfo, getScaleInfo } from "./utils/markerData";

class TempoScale {
  constructor(
    duration,
    offset,
    samplesPerPixel,
    sampleRate,
    marginLeft = 0,
    colors,
    tempo
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
    const beats = Math.round(milliseconds * (tempo / 60000.0));
    const bars = Math.floor(beats / 4) + 1;

    const beatsDisplay = (beats % 4) + 1;
    return beatsDisplay == 1 ? `${bars}` : `${bars}.${beatsDisplay}`;
  }

  render() {
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

    const stepInterval = scaleInfo.secondStep * pixPerBar;
    const bigStepInterval = scaleInfo.bigStep * pixPerBar;
    const markerInterval = scaleInfo.marker * pixPerBar;

    for (let i = 0; i < end; i += stepInterval) {
      const pixIndex = Math.floor(i);
      const pix = pixIndex - pixOffset;

      if (pixIndex >= pixOffset) {
        // put a timestamp every 30 seconds.
        if (scaleInfo.marker && counter % markerInterval === 0) {
          const barMarker = counter % pixPerBar === 0;
          timeMarkers.push(
            h(
              "div.time",
              {
                attributes: {
                  style: `position: absolute; left: ${pix}px; font-weight: ${
                    barMarker ? "bold" : "normal"
                  }`,
                },
              },
              [
                TempoScale.formatTimeBeatsBars(
                  (counter / pixPerSec) * 1000,
                  this.tempo
                ),
              ]
            )
          );

          canvasInfo[pix] = 10;
        } else if (scaleInfo.bigStep && counter % scaleInfo.bigStep === 0) {
          canvasInfo[pix] = 5;
        } else if (scaleInfo.smallStep && counter % stepInterval === 0) {
          canvasInfo[pix] = 2;
        }
      }

      counter += stepInterval;
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
