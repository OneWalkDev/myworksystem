FROM node:20-alpine

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションファイルをコピー
COPY . .

# ポート公開
EXPOSE 3000

# 開発サーバーの起動
CMD ["npm", "run", "dev"]