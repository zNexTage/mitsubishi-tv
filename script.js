function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

const allKeys = [
    ["Mudo", "Disp", "", "Liga/Desl"],
    ["1", "2", "3", "4"],
    ["5", "6", "7", "8"],
    ["9", "0/30", "1-/--", "2-/QV"],
    ["", "", "", ""],
    ["Menu", "^", "˅", "TV/AV"],
    ["Apaga", "", "", ""]
];

const television = {
    isOn: false
}

const avaibleChannels = [2, 4, 5, 7, 13, 32];

const avaibleOptions = (key) => {
    const options = {
        2: {
            video: "videos/cultura/castelo_ra_tim_bum.mp4"
        },
        4: {
            video: "videos/sbt/chaves.mp4"
        },
        5: {
            video: "videos/globo/caverna_do_dragao.mp4"
        },
        7: {
            video: "videos/record/desesperotv.mp4"
        },
        9: {
            video: "videos/mtv/obrigadovoce.mp4"
        },
        "default": {
            video: ""
        }
    }

    return options[key] || options["default"];
}

const findLastChannel = () => {
    const lastChannel = localStorage.getItem("last_channel");

    if (lastChannel && !isNaN(lastChannel)) {
        return Number.parseInt(lastChannel);
    }

    return 0;
}

const saveChannelInStorage = (channel) => {
    localStorage.setItem("last_channel", channel);
}

const createChannelVideoAndLabelChannel = (videoSrc) => {
    const video = document.createElement("video");
    video.src = videoSrc;
    video.classList.add("television-monitor-internal-turned-on");

    const channelLabel = document.createElement("label");

    channelLabel.classList.add("television-monitor-actual-channel");

    return {
        video,
        channelLabel
    }
}


const onKeyPress = (key) => {
    const televionInternal = document.querySelector("[television-monitor-internal]");

    if (!isNaN(key)) {
        const keyNum = Number.parseInt(key);

        if (television.isOn) {
            const channelVideo = avaibleOptions(keyNum);

            const { channelLabel, video } = createChannelVideoAndLabelChannel(channelVideo.video);

            channelLabel.innerHTML = key;

            if (channelVideo.video) {
                video.play();

                televionInternal.innerHTML = '';

                saveChannelInStorage(key);

                televionInternal.appendChild(video);
                televionInternal.appendChild(channelLabel);

            } else {
                televionInternal.innerHTML = '';

                const noSignalImage = document.createElement("img");

                noSignalImage.src = "no-signal.jpg";
                televionInternal.appendChild(noSignalImage);
                televionInternal.appendChild(channelLabel);
            }

            const timeout = setTimeout(() => {
                channelLabel.innerHTML = "";
                clearTimeout(timeout);
            }, 1050);
        }
        else {
            alert("Ligue a televisão para poder escolher um canal.");
        }
    }
    else {
        if (key === "Liga/Desl") {


            if (television.isOn) {
                television.isOn = false;

                televionInternal.innerHTML = '';

                // televionInternal.classList.remove("television-monitor-internal-turned-on");
            }
            else {
                television.isOn = true;

                const lastChannel = findLastChannel();
                let actualChannel;
                let programmingVideo;

                if (lastChannel === 0) {
                    programmingVideo = avaibleOptions(2).video;
                    actualChannel = 2;
                }
                else {
                    actualChannel = lastChannel;
                    programmingVideo = avaibleOptions(lastChannel).video;
                }

                const { channelLabel, video } = createChannelVideoAndLabelChannel(programmingVideo);

                channelLabel.innerHTML = actualChannel;
                video.play()

                televionInternal.appendChild(channelLabel);
                televionInternal.appendChild(video);

                const timeout = setTimeout(() => {
                    channelLabel.innerHTML = "";
                    clearTimeout(timeout);
                }, 1050);
            }
        }
    }
}

const createControlKeys = () => {
    const televionControlKeyArea = document.querySelector("[control-area]");

    allKeys.forEach((keyRow) => {
        keyRow.forEach((key) => {
            const televionControlKey = document.createElement("div");
            televionControlKey.className = "television-control-key";

            if (key) {
                const keyLabel = document.createElement("label");
                const breakLine = document.createElement("br");
                const keyButton = document.createElement("button");
                keyButton.onclick = () => onKeyPress(key);
                keyLabel.innerHTML = key;

                televionControlKey.appendChild(keyLabel);
                televionControlKey.appendChild(breakLine);
                televionControlKey.appendChild(keyButton);
            }

            televionControlKeyArea.appendChild(televionControlKey);
        });
    });
}

const onPageLoad = () => {    
    createControlKeys();
}



document.body.onload = onPageLoad;

