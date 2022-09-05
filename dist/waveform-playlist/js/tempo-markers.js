var playlist = WaveformPlaylist.init({
    samplesPerPixel: 1000,
    waveHeight: 100,
    container: document.getElementById("playlist"),
    tempo: 121.5,
    timescale: true,
    tempomarkers: true,
    seekStyle: "line",
    state: "cursor",
    colors: {
      waveOutlineColor: "#005BBB",
    },
    controls: {
      show: true, //whether or not to include the track controls
      width: 200, //width of controls in pixels
    },
    zoomLevels: [250, 500, 1000, 2500, 5000],
  });
  
  playlist
    .load([
      {
        src: "media/audio/Vocals30.mp3",
        name: "Vocals",
        start: 0.10,
      },
      {
        src: "media/audio/Guitar30.mp3",
        name: "Guitar",
        start: 0.10,
      },
      {
        src: "media/audio/PianoSynth30.mp3",
        name: "Pianos & Synth",
        start: 0.10,
      },
      {
        src: "media/audio/BassDrums30.mp3",
        name: "Drums",
        start: 0.10,
      },
    ])
    .then(function () {
      //can do stuff with the playlist.
    });
  