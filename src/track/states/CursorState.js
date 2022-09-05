import { pixelsToSeconds } from "../../utils/conversions";

export default class {
  constructor(track) {
    this.track = track;
  }

  setup(samplesPerPixel, sampleRate, snapSelection) {
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
    this.snapSelection = snapSelection;
  }

  click(e) {
    e.preventDefault();
    const startX = this.snapSelection
      ? e.srcElement.offsetLeft
      : e.srcElement.offsetLeft + e.offsetX;
    let startTime = pixelsToSeconds(
      startX,
      this.samplesPerPixel,
      this.sampleRate
    );

    this.track.ee.emit("select", startTime, startTime, this.track);
  }

  static getClass() {
    return ".state-cursor";
  }

  static getEvents() {
    return ["click"];
  }
}
