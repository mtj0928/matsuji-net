# matsuji.net

matsujiの個人サイト - Astro + Tailwind CSSで構築した静的サイトです。

## 機能

- ✅ **トップページ**: プロフィール、最新ブログ記事、作品紹介（Bento UI）
- ✅ **ブログ機能**: Markdown記事、タグフィルター、ページング（10件/ページ）
- ✅ **作品紹介ページ**: Bento UIグリッド、ホバー時の詳細表示
- ✅ **ダークモード**: フラッシュ防止対応、スムーズな切り替え
- ✅ **レスポンシブデザイン**: デスクトップ・モバイル対応

## 技術スタック

- **Astro 5.x** - 静的サイトジェネレーター
- **Tailwind CSS 4.x** - スタイリング
- **TypeScript** - 型安全性
- **GitHub Pages** - ホスティング

## 開発

### セットアップ

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:4321/ でアクセス可能

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## コンテンツの追加

### ブログ記事の追加

`src/content/blog/` に Markdown ファイルを作成：

```markdown
---
title: "記事タイトル"
description: "記事の説明"
pubDate: 2026-01-14T00:00:00Z
tags: ["タグ1", "タグ2"]
draft: false
---

本文をここに記述
```

### 作品の追加

`src/content/works/` に JSON ファイルを作成：

```json
{
  "title": "作品名",
  "description": "説明",
  "image": "/images/works/作品画像.png",
  "link": "https://example.com",
  "category": "oss",
  "order": 1,
  "featured": true
}
```

補足:
- `featured: true` の作品はホーム画面のWorksに表示されます
- `order` は表示順（昇順）に使われます

## カスタマイズ

### プロフィール情報の変更

`src/components/home/ProfileCard.astro` の `profile` オブジェクトを編集

### SNSリンクの変更

`src/components/common/SocialLinks.astro` の `socialLinks` 配列を編集

## 次のステップ

1. **プロフィール情報の更新**
   - `ProfileCard.astro` の名前、肩書き、自己紹介文を実際の情報に変更
   - プロフィール画像を追加（`public/images/profile.jpg`）

2. **SNSリンクの更新**
   - `SocialLinks.astro` のURLを実際のアカウントURLに変更

3. **OGP画像の追加**
   - `public/og-image.png` を作成

4. **実際のコンテンツ追加**
   - ブログ記事を執筆（`src/content/blog/`）
   - 作品情報を追加（`src/content/works/`）
   - 作品の画像を追加（`public/images/works/`）

5. **GitHub Pages設定**
   - リポジトリの Settings → Pages で GitHub Actions をデプロイソースに設定

## ライセンス

MIT License
