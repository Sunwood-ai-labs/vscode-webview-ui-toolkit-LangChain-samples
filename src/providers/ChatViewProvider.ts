// src/providers/ChatViewProvider.ts

import {
    CancellationToken,
    Uri,
    Webview,
    WebviewView,
    WebviewViewProvider,
    WebviewViewResolveContext,
} from 'vscode';
import { getUri } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';
import { ChatOpenAI } from '@langchain/openai';

export class ChatViewProvider implements WebviewViewProvider {
    public static readonly viewType = "chat.chatView";
    private model: ChatOpenAI | null = null;

    constructor(private readonly _extensionUri: Uri) {
        console.log("ChatViewProvider initialized");
        this.initializeModel();
    }

    /**
     * 環境変数からAPIキーを取得し、ChatOpenAIモデルを初期化します。
     */
    private initializeModel() {
        console.log("Initializing ChatOpenAI model");

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.warn("OPENAI_API_KEY is not set in the environment variables.");
            return;
        }

        try {
            this.model = new ChatOpenAI({
                openAIApiKey: apiKey,
                modelName: "gpt-4", // 必要に応じて変更（例: "gpt-4o-mini"）
                temperature: 0,
            });
            console.log("ChatOpenAI model initialized successfully");
        } catch (error) {
            console.error("Failed to initialize ChatOpenAI model:", error);
        }
    }

    public resolveWebviewView(
        webviewView: WebviewView,
        context: WebviewViewResolveContext,
        _token: CancellationToken
    ) {
        console.log("Resolving webview view");
        // Webviewのオプション設定
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [Uri.joinPath(this._extensionUri, "out")],
        };

        // WebviewのHTMLコンテンツを設定
        webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);

        // メッセージリスナーを設定
        this._setWebviewMessageListener(webviewView);
    }

    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
        const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
        const nonce = getNonce();

        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                    <link rel="stylesheet" href="${stylesUri}">
                    <title>Chatbot</title>
                </head>
                <body>
                    <h1>Chat with AI</h1>
                    
                    <!-- チャットセクションの追加 -->
                    <section id="chat-container">
                        <div id="chat-messages"></div>
                        <vscode-text-field id="chat-input" placeholder="Type your message here"></vscode-text-field>
                        <vscode-button id="send-chat-button">Send</vscode-button>
                    </section>

                    <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
                </body>
            </html>
        `;
    }

    private async _setWebviewMessageListener(webviewView: WebviewView) {
        console.log("Setting up message listener");
        webviewView.webview.onDidReceiveMessage(async (message) => {
            const command = message.command;
            console.log(`Received message command: ${command}`);

            switch (command) {
                case "chat": {
                    const userMessage = message.message;
                    console.log(`Received chat message: ${userMessage}`);

                    if (!this.model) {
                        console.warn("ChatOpenAI model is not initialized.");
                        webviewView.webview.postMessage({
                            command: "error",
                            message: "AI model is not initialized. Please set your API key.",
                        });
                        return;
                    }

                    try {
                        const aiResponse = await this._getAIResponse(userMessage);
                        console.log(`AI response: ${aiResponse}`);
                        webviewView.webview.postMessage({
                            command: "chat",
                            payload: aiResponse,
                        });
                    } catch (error) {
                        console.error(`AI processing error: ${error}`);
                        webviewView.webview.postMessage({
                            command: "error",
                            message: "Sorry, couldn't process your message at this time...",
                        });
                    }
                    break;
                }

                default:
                    console.warn(`Unknown command: ${command}`);
            }
        });
    }

    /**
     * ユーザーからのメッセージを受け取り、AIの応答を生成します。
     *
     * @param message - ユーザーのメッセージ
     * @returns AIの応答メッセージ
     */
    private async _getAIResponse(message: string): Promise<string> {
        console.log(`Generating AI response for message: ${message}`);

        try {
            const response = await this.model!.call([message]);
            const aiMessage = response.text.trim();
            console.log(`AI generated message: ${aiMessage}`);
            return aiMessage;
        } catch (error) {
            console.error("Error generating AI response:", error);
            throw error;
        }
    }
}
