// src/webview/chat.ts

import {
    provideVSCodeDesignSystem,
    Button,
    Dropdown,
    ProgressRing,
    TextField,
    vsCodeButton,
    vsCodeDropdown,
    vsCodeOption,
    vsCodeTextField,
    vsCodeProgressRing,
} from "@vscode/webview-ui-toolkit";

// Webview UI Toolkit のコンポーネントを登録
provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeDropdown(),
    vsCodeOption(),
    vsCodeProgressRing(),
    vsCodeTextField()
);

// VS Code API にアクセス
const vscode = acquireVsCodeApi();

// Webview DOM のロードを待つ
window.addEventListener("load", main);

// メイン関数
function main() {
    console.log("Webview DOM loaded");
    
    // チャット送信ボタンの設定
    const sendChatButton = document.getElementById("send-chat-button") as Button;
    sendChatButton.addEventListener("click", sendChatMessage);

    // Enterキーでチャット送信
    const chatInput = document.getElementById("chat-input") as TextField;
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendChatMessage();
        }
    });

    setVSCodeMessageListener();
}

// チャットメッセージを送信する関数
function sendChatMessage() {
    console.log("Send Chat button clicked");
    
    const chatInput = document.getElementById("chat-input") as TextField;
    const message = chatInput.value.trim();
    
    if (message === "") {
        console.warn("Empty chat message");
        return;
    }

    // ユーザーのメッセージを表示
    appendChatMessage("user", message);

    // 入力フィールドをクリア
    chatInput.value = "";

    // メッセージを拡張機能に送信
    vscode.postMessage({
        command: "chat",
        message: message,
    });

    displayChatLoadingState();
}

// メッセージリスナーを設定
function setVSCodeMessageListener() {
    window.addEventListener("message", (event) => {
        const command = event.data.command;
        console.log(`Received message command from extension: ${command}`);

        switch (command) {
            case "chat":
                const aiMessage = event.data.payload;
                appendChatMessage("ai", aiMessage);
                break;
            case "error":
                displayError(event.data.message);
                break;
        }
    });
}

// チャットのロード状態を表示
function displayChatLoadingState() {
    console.log("Displaying chat loading state");
    
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
        const loadingMessage = document.createElement("p");
        loadingMessage.classList.add("loading");
        loadingMessage.textContent = "AI is typing...";
        loadingMessage.id = "chat-loading";
        chatMessages.appendChild(loadingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// エラーメッセージを表示
function displayError(errorMsg: string) {
    console.log("Displaying error message");
    
    const chatLoading = document.getElementById("chat-loading");

    if (chatLoading) {
        const chatMessages = document.getElementById("chat-messages");
        chatMessages?.removeChild(chatLoading);
        appendChatMessage("ai", errorMsg);
    }
}

// チャットメッセージを追加
function appendChatMessage(sender: "user" | "ai", message: string) {
    console.log(`Appending ${sender} message: ${message}`);
    
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
        const messageElement = document.createElement("p");
        messageElement.classList.add("chat-message", sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ローディング状態を削除
    const chatLoading = document.getElementById("chat-loading");
    if (chatLoading) {
        const chatMessages = document.getElementById("chat-messages");
        chatMessages?.removeChild(chatLoading);
    }
}
