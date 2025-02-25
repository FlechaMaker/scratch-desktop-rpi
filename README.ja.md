# scratch-desktop

Raspberry Piで動作するScratch 3.0に、[Stretch3](https://stretch3.github.io)で利用できる拡張機能を中心に、以下の拡張機能を追加したものです。
Raspberry Piのハードウェア（センサーやLEDなど）と、AI（機械学習）などの拡張機能を組み合わせて、より多様なプログラムを作成することができます。

- Raspberry Pi BuildHAT
    - LEGO SPIKE PrimeなどのモーターをRaspberry Piに接続して動かすための拡張機能です。
- Raspberry Pi GPIO
    - Raspberry PiのGPIOピンを制御するための拡張機能です。
    - (Raspberry Pi用Scratchでデフォルトで使用できるもの)
- Raspberry Pi Sense HAT
    - Raspberry PiのSense HATを制御するための拡張機能です。
    - (Raspberry Pi用Scratchでデフォルトで使用できるもの)
- Raspberry Pi Simple Electronics
    - Raspberry PiのGPIOピンを制御するための簡単な拡張機能です。
    - (Raspberry Pi用Scratchでデフォルトで使用できるもの)
- [ChatGPT2Scratch](https://github.com/ichiroc/chatgpt2scratch)
    - プログラムを他の人と共有するときに、APIキーを共有しないよう注意してください。
    - オリジナルのChatGPT2Scratchと異なり、技術的な都合で、APIキーの設定をプログラム内のブロックで行う仕様になっています。
- [Facemesh2Scratch](https://github.com/champierre/facemesh2scratch)
- [Geo Scratch](https://github.com/YcSoku/GeoScratch)
- [PoseNet2Scratch](https://github.com/champierre/posenet2scratch)
- [QR Code](https://github.com/sugiura-lab/scratch3-qrcode)
- [Speech2Scratch](https://github.com/champierre/speech2scratch)
- [TM2Scratch](https://github.com/champierre/tm2scratch)

# インストール手順
1. scratch-desktop_3.30.9_arm64.debをダウンロード
2. scratch-desktop_3.30.9_arm64.debを右クリック
3. 「パッケージのインストール」
4. 「このファイルをインストールしますか？」➡︎インストール
5. 「認証」のパスワードを入力して「認証する」をクリック
6. 進行状況を表すウィンドウが消えたら完了．
7. 左上のラズベリーのメニューからScratchを起動


<video src="https://github.com/user-attachments/assets/23375b75-e4a4-4485-9e66-1013283e1e0a.mov" width="50%" control />

## 開発者向けガイド

このバージョンのScratchは、node_modulesに以下のパッチ（patchesフォルダー内）を適用します：

- scratch-blocks
- scratch-gui
- scratch-vm

これらのパッチは./raspberry-pi内のファイルに基づいていますが、パッチ作成プロセスは自動化されていません。

### 新しいバージョンのリリース

Raspberry Pi固有のビルドについては、[**Raspberry Pi固有のビルドの作成**](#raspberry-pi固有のビルドの作成)をご参照ください。

新しいバージョン`3.999.0`（`scratch-gui`バージョン`0.1.0-prerelease.20yymmdd`に対応）をリリースする場合の手順：

1. `scratch-gui`のマージ:
   1. `cd scratch-gui`
   2. `git pull --all --tags`
   3. `git checkout scratch-desktop`
   4. `git merge 0.1.0-prerelease.20yymmdd`
   5. 必要に応じて競合を解決
   6. `git tag scratch-desktop-v3.999.0`
   7. `git push`
   8. `git push --tags`
2. `scratch-desktop`の準備:
   1. `cd scratch-desktop`
   2. `git pull --all --tags`
   3. `git checkout develop`
   4. `npm install --save-dev 'scratch-gui@github:scratchfoundation/scratch-gui#scratch-desktop-v3.999.0'`
   5. `git add package.json package-lock.json`
   6. アプリが動作することと差分が適切であることを確認
   7. `git commit -m "bump scratch-gui to scratch-desktop-v3.999.0"`
   8. `npm version 3.999.0`
   9. `git push`
   10. `git push --tags`
3. CIビルドを待ち、ビルド成果物からリリースを収集

### メディアライブラリアセットの準備

`scratch-desktop`ディレクトリで`npm run fetch`を実行します。`scratch-gui`を更新した場合や、メディアライブラリに影響を与える変更を行った場合は、再実行してください。

### 開発モードでの実行

`npm start`

### パッケージ化されたビルドの作成

`npm run dist`

macOSでは各種証明書のインストールが必要です。

### Raspberry Pi固有のビルドの作成

~~Mac~~ （現在、この方法では`gpiolib.node`が間違ったアーキテクチャ用にコンパイルされます）またはRaspberry Pi OS上で実行できます。

現在、NodeJS > 16では証明書エラーが発生します。これを回避するには、[asdf](https://asdf-vm.com/guide/getting-started.html)を使用して`.tool-versions`で定義されているNode 16をインストールします：

`asdf install`

`static/gpiolib.node`が正しいアーキテクチャ用にビルドされていることを確認してください。削除して対象プラットフォームで`npm run compile:cpp`を実行してください。

注意：ビルド/リリース前にパッケージバージョン（`package.json`の`"version"`）を更新することを忘れないでください。

Linux / Raspberry Pi パッケージのビルド：

`npm run dist:rpi`

これにより2つのビルド（arm64とarmv7l）が出力されます。

### デバッグ

レンダラープロセスは、Chromium開発者コンソールを開いてデバッグできます。パッケージ化されたビルドでは使用できません。

メインプロセスは通常のNode.jsプロセスと同様にデバッグできます。Visual Studio Codeでの推奨設定は元のREADMEを参照してください。

### テレメトリシステムのリセット

このアプリケーションには、ユーザーがオプトインした場合のみ有効になるテレメトリシステムが含まれています。

テレメトリファイルの場所は、オペレーティングシステムとパッケージ化されたビルドかどうかによって異なります：

- Windows（パッケージ化）: `%APPDATA%\Scratch\telemetry.json`
- Windows（非パッケージ化）: `%APPDATA%\Electron\telemetry.json`
- macOS（パッケージ化）: `~/Library/Application Support/Scratch/telemetry.json`または
  `~/Library/Containers/edu.mit.scratch.scratch-desktop/Data/Library/Application Support/Scratch/telemetry.json`
- macOS（非パッケージ化）: `~/Library/Application Support/Electron/telemetry.json`または
  `~/Library/Containers/edu.mit.scratch.scratch-desktop/Data/Library/Application Support/Electron/telemetry.json`

このファイルを削除すると：
- 保留中のテレメトリパケットが削除されます
- オプトイン/アウト状態がリセットされます
- ランダムなクライアントUUIDが削除され、次回起動時に新しいものが生成されます
