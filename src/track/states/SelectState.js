import { pixelsToSeconds, secondsToPixels } from "../../utils/conversions";

export default class {
  constructor(track) {
    this.track = track;
    this.active = false;
  }

  setup(samplesPerPixel, sampleRate, snapSelection, scrollLeft) {
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
    this.snapSelection = snapSelection;
    this.scrollLeft = scrollLeft;
  }

  emitSelection(x) {
    const minX = Math.min(x, this.startX);
    const maxX = Math.max(x, this.startX);
    const startTime = pixelsToSeconds(
      minX,
      this.samplesPerPixel,
      this.sampleRate
    );
    const endTime = pixelsToSeconds(
      maxX,
      this.samplesPerPixel,
      this.sampleRate
    );
    this.track.ee.emit("select", startTime, endTime, this.track);
  }

  complete(x) {
    this.emitSelection(x);
    this.active = false;
  }

  mousedown(e) {
    e.preventDefault();
    this.active = true;

    this.startX = this.snapSelection
      ? e.srcElement.offsetLeft
      : e.srcElement.offsetLeft + e.offsetX;
    const startTime = pixelsToSeconds(
      this.startX,
      this.samplesPerPixel,
      this.sampleRate
    );

    this.track.ee.emit("select", startTime, startTime, this.track);
  }

  mousemove(e) {
    if (this.active) {
      e.preventDefault();
      this.emitSelection(
        this.snapSelection
          ? e.srcElement.offsetLeft
          : e.srcElement.offsetLeft + e.offsetX
      );
    }
  }

  mouseup(e) {
    if (this.active) {
      e.preventDefault();
      this.complete(
        this.snapSelection
          ? e.srcElement.offsetLeft
          : e.srcElement.offsetLeft + e.offsetX
      );
    }
  }

  mouseleave(e) {
    if (this.active) {
      e.preventDefault();
      const scrollOffset = secondsToPixels(
        this.scrollLeft,
        this.samplesPerPixel,
        this.sampleRate
      );
      const maxWidth =
        e.srcElement.closest(".waveform").offsetWidth + scrollOffset;

      if (e.srcElement.offsetLeft < 1 && e.offsetX < 0) {
        this.complete(
          this.snapSelection
            ? e.srcElement.offsetLeft
            : e.srcElement.offsetLeft + (e.offsetX >= 0 ? e.offsetX : 0)
        );
      }
      if (e.srcElement.offsetLeft + e.srcElement.offsetWidth >= maxWidth) {
        //todo scroll
        this.complete(
          this.snapSelection
            ? e.srcElement.offsetLeft
            : e.srcElement.offsetLeft + (e.offsetX >= 0 ? e.offsetX : 0)
        );
      }
    }
  }

  static getClass() {
    return ".state-select";
  }

  static getEvents() {
    return ["mousedown", "mousemove", "mouseup", "mouseleave"];
  }
}
