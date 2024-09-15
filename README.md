# vscode-webview-ui-toolkit-LangChain-samples

このサンプル拡張機能は、Visual Studio Code用のWebview UI Toolkitを使用して、Webviewビュー内でLangChainとOpenAIを統合したチャットボットを実装しています。

https://github.com/user-attachments/assets/642eea42-3c29-4525-869a-7c18c01d0e66

## 🚀 Features

- VS Code Webviewを使用したインタラクティブなチャットインターフェース
- LangChainとOpenAI APIを利用したAIチャットボット機能
- Webview UI Toolkitを使用したモダンなUI

## 🛠 Setup

1. このリポジトリをローカルにクローンします：
   ```bash
   git clone https://github.com/your-username/vscode-webview-ui-toolkit-LangChain-samples.git
   ```

2. プロジェクトディレクトリに移動します：
   ```bash
   cd vscode-webview-ui-toolkit-LangChain-samples
   ```

3. 依存関係をインストールします：
   ```bash
   npm install
   ```

4. VS Codeでプロジェクトを開きます：
   ```bash
   code .
   ```

## 🔧 Configuration

1. OpenAI APIキーを設定します：
   - `.env`ファイルを作成し、以下の内容を追加します：
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

## 🏃‍♂️ Running the Extension

1. VS Code内で、`F5`キーを押して新しい拡張機能開発ホストウィンドウを開きます。
2. ホストウィンドウ内で、コマンドパレット（`Ctrl+Shift+P`または`Cmd+Shift+P`（Mac））を開き、`LangChain Chatbot: Open Chat View`と入力します。

## 📚 Project Structure

- `src/extension.ts`: 拡張機能のメインエントリーポイント
- `src/providers/ChatViewProvider.ts`: Webviewプロバイダーの実装
- `src/webview/chat.ts`: Webviewのフロントエンド実装
- `src/webview/styles.css`: Webviewのスタイル

## 🤝 Contributing

1. このリポジトリをフォークします
2. 新しいブランチを作成します（`git checkout -b feature/AmazingFeature`）
3. 変更をコミットします（`git commit -m 'Add some AmazingFeature'`）
4. ブランチにプッシュします（`git push origin feature/AmazingFeature`）
5. プルリクエストを作成します

## 📜 License

MITライセンスの下で配布されています。詳細は`LICENSE`ファイルをご覧ください。

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/vscode-webview-ui-toolkit-LangChain-samples](https://github.com/your-username/vscode-webview-ui-toolkit-LangChain-samples)
