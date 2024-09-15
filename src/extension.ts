// src/extension.ts

import { ExtensionContext, window } from 'vscode';
import { ChatViewProvider } from './providers/ChatViewProvider';

/**
 * この関数は拡張機能が有効化されたときに呼び出されます。
 *
 * @param context - 拡張機能のコンテキスト情報
 */
export function activate(context: ExtensionContext) {
    console.log('Chatbot Extension is now active!');

    // ChatViewProvider のインスタンスを作成
    const provider = new ChatViewProvider(context.extensionUri);

    // Webview View を登録
    const chatViewDisposable = window.registerWebviewViewProvider(
        ChatViewProvider.viewType,
        provider
    );

    // 拡張機能のサブスクリプションに追加
    context.subscriptions.push(chatViewDisposable);
}

/**
 * この関数は拡張機能が無効化されたときに呼び出されます。
 */
export function deactivate() {}
