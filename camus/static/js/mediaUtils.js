'use strict';

export async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
    } catch(err) {
        console.error(err);
        return [];
    }
}

export async function getMics() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'audioinput');
    } catch(err) {
        console.error(err);
        return [];
    }
}

export async function hasCamera() {
    const cameras = await getCameras();
    return cameras.length > 0;
}

export async function hasMic() {
    const mics = await getMics();
    return mics.length > 0;
}

export async function getUserMedia(audio=true, video=true) {
    const mic = await hasMic();
    const camera = await hasCamera();
    const constraints = {
        audio: audio && mic,
        video: video && camera
    };

    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch(err) {
        console.error(err);
        return {audio: null, video: null};
    }

    const videoTrack = stream.getTracks().find(track => track.kind === 'video');
    const audioTrack = stream.getTracks().find(track => track.kind === 'audio');

    return {audio: audioTrack, video: videoTrack}
}

export async function getUserVideo() {
    const {video} = await getUserMedia(false, true);
    return video;
}

export async function getUserAudio() {
    const {audio} = await getUserMedia(true, false);
    return audio;
}

export async function getDisplayMedia() {
    const constraints = {
        'video': {cursor: 'always'},
        'audio': false
    };

    let stream;
    try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    } catch(err) {
        console.error(err);
        return null;
    }

    const videoTrack = stream.getTracks().find(track => track.kind === 'video');
    return videoTrack;
}
