import h from "virtual-dom/h";

import { secondsToPixels } from "./utils/conversions";
import TimeScaleHook from "./render/TimeScaleHook";
import { timeinfo } from "./utils/markerData";

class TimeScale {
  constructor(
    duration,
    offset,
    samplesPerPixel,
    sampleRate,
    marginLeft = 0,
    colors
  ) {
    this.duration = duration;
    this.offset = offset;
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
    this.marginLeft = marginLeft;
    this.colors = colors;

    this.timeinfo = timeinfo;
  }

  getScaleInfo(resolution) {
    let keys = Object.keys(this.timeinfo).map((item) => parseInt(item, 10));

    // make sure keys are numerically sorted.
    keys = keys.sort((a, b) => a - b);

    for (let i = 0; i < keys.length; i += 1) {
      if (resolution <= keys[i]) {
        return this.timeinfo[keys[i]];
      }
    }

    return this.timeinfo[keys[0]];
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

  render() {
    const widthX = secondsToPixels(
      this.duration,
      this.samplesPerPixel,
      this.sampleRate
    );
    const pixPerSec = this.sampleRate / this.samplesPerPixel;
    const pixOffset = secondsToPixels(
      this.offset,
      this.samplesPerPixel,
      this.sampleRate
    );
    const scaleInfo = this.getScaleInfo(this.samplesPerPixel);
    const canvasInfo = {};
    const timeMarkers = [];
    const end = widthX + pixOffset;
    let counter = 0;

    for (let i = 0; i < end; i += pixPerSec * scaleInfo.secondStep) {
      const pixIndex = Math.floor(i);
      const pix = pixIndex - pixOffset;

      if (pixIndex >= pixOffset) {
        // put a timestamp every 30 seconds.
        if (scaleInfo.marker && counter % scaleInfo.marker === 0) {
          timeMarkers.push(
            h(
              "div.time",
              {
                attributes: {
                  style: `position: absolute; left: ${pix}px;`,
                },
              },
              [TimeScale.formatTime(counter)]
            )
          );

          canvasInfo[pix] = 10;
        } else if (scaleInfo.bigStep && counter % scaleInfo.bigStep === 0) {
          canvasInfo[pix] = 5;
        } else if (scaleInfo.smallStep && counter % scaleInfo.smallStep === 0) {
          canvasInfo[pix] = 2;
        }
      }

      counter += 1000 * scaleInfo.secondStep;
    }

    return h(
      "div.playlist-time-scale",
      {
        attributes: {
          style: `position: relative; left: 0; right: 0; margin-left: ${this.marginLeft}px; margin-top: 30px`,
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

export default TimeScale;
