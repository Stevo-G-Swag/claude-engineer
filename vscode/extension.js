const vscode = require('vscode');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

let recognizer;
let microphone;

function activate(context) {
    console.log('Congratulations, your extension "claude-engineer" is now active!');

    let disposable = vscode.commands.registerCommand('extension.voiceCommandPalette', async function () {
        await initializeSpeechRecognition();
        const command = await voiceInput();
        if (command) {
            processVoiceCommand(command);
        }
    });

    context.subscriptions.push(disposable);
}

async function initializeSpeechRecognition() {
    recognizer = new speech.SpeechClient();
    microphone = await getMicrophone();
}

async function getMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        vscode.window.showInformationMessage("Microphone access granted.");
        return stream;
    } catch (error) {
        vscode.window.showErrorMessage("Microphone access denied: " + error.message);
        throw error;
    }
}

async function voiceInput() {
    return new Promise((resolve, reject) => {
        const request = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
            interimResults: false,
        };

        const recognizeStream = recognizer
            .streamingRecognize(request)
            .on('error', (error) => {
                vscode.window.showErrorMessage("Error during voice input: " + error.message);
                reject(error);
            })
            .on('data', (data) => {
                if (data.results[0] && data.results[0].alternatives[0]) {
                    const transcript = data.results[0].alternatives[0].transcript;
                    vscode.window.showInformationMessage("Voice input received: " + transcript);
                    resolve(transcript);
                }
            });

        microphone.getTracks().forEach(track => {
            recognizeStream.write(track);
        });

        vscode.window.showInformationMessage("Voice input started.");
    });
}

function processVoiceCommand(command) {
    const commands = {
        "exit voice mode": () => vscode.window.showInformationMessage("Exiting voice mode."),
        "save chat": () => vscode.window.showInformationMessage("Chat saved."),
        "reset conversation": () => vscode.window.showInformationMessage("Conversation reset.")
    };

    if (commands[command]) {
        commands[command]();
    } else {
        vscode.window.showErrorMessage("Unknown command: " + command);
    }
}

function deactivate() {
    if (microphone) {
        microphone.getTracks().forEach(track => track.stop());
        vscode.window.showInformationMessage("Microphone stopped.");
    }
}

module.exports = {
    activate,
    deactivate
};
