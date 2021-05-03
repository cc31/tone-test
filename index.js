let audioTest = null;

class Recorder {
  constructor(audioContext, sourceStream) {
    this.audioContext = audioContext;
    this.mediaRecorder = new MediaRecorder(sourceStream);
  }

  start() {
    this.mediaRecorder.start();

    // If audio data available then push it to the chunk array
    this.mediaRecorder.ondataavailable = (ev) => {
      dataArray.push(ev.data);
    };

    // Chunk array to store the audio data
    let dataArray = [];
    let playAudio = document.getElementById("audioPlay");

    // Convert the audio data in to blob after stopping the recording
    this.mediaRecorder.onstop = (ev) => {
      // blob of type mp3
      let audioData = new Blob(dataArray, { type: "audio/mp3;" });

      // After fill up the chunk array make it empty
      dataArray = [];

      // Creating audio url with reference of created blob named 'audioData'
      let audioSrc = window.URL.createObjectURL(audioData);

      // Pass the audio url to the html audio tag
      playAudio.src = audioSrc;
      audioTest = audioSrc;
    };
  }

  stop() {
    this.mediaRecorder.stop();
  }
}

const init = (sourceStream) => {
  const audioContext = new AudioContext();
  const recorder = new Recorder(audioContext, sourceStream);

  const micButton = document.querySelector("#mic-button");

  let recording = false;
  let audioSrc = null;

  micButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!recording) {
      console.log("start recording");
      recording = true;
      micButton.innerHTML = "stop";
      recorder.start();
    } else {
      console.log("stop recording");
      recording = false;
      micButton.innerHTML = "record";
      recorder.stop();
    }
  });

  // fx chain
  document.querySelector("#fx").addEventListener("click", () => {
    const player = new Tone.Player(audioTest);
    player.set({
      fadeIn: 0.3,
      fadeOut: 0.3,
      reverse: true,
      playbackRate: 0.8,
    });
    //create effect
    const distortion = new Tone.Distortion(0.6).toDestination();
    const feedbackDelay = new Tone.FeedbackDelay(0.15, 0.6);

    feedbackDelay.connect(distortion);
    player.connect(feedbackDelay);

    player.autostart = true;
  });

  //   const slider = document.getElementById("myRange");
};

navigator.mediaDevices
  .getUserMedia({
    audio: {
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
    },
  })
  .then(init);
