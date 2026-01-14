---
title: "Astroで個人サイトを作った話"
description: "AstroとTailwind CSSを使って個人サイトを構築した際の知見をまとめました。"
pubDate: 2026-01-10T00:00:00Z
heroImage: "/images/blog/astro-site.png"
tags: ["Astro", "Web開発", "個人開発"]
draft: false
---

## はじめに

個人サイトをリニューアルするにあたり、技術スタックの選定から始めました。今回は**Astro**と**Tailwind CSS**を選択し、非常に満足のいく結果となりました。

## なぜAstroを選んだのか

Astroを選んだ理由は以下の通りです：

### 1. 静的サイト生成で高速

Astroは静的サイトジェネレーター(SSG)として優れており、ビルド時にHTMLを生成するため、ページの読み込みが非常に高速です。

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',
  // ...
});
```

### 2. Content Collectionsが便利

Astroの**Content Collections**機能により、Markdownコンテンツの型安全な管理が可能になります。

```typescript
// src/content/config.ts
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});
```

### 3. Tailwind CSSとの親和性

Astroは`npx astro add tailwind`コマンド一つでTailwind CSSを統合でき、設定も自動で行ってくれます。

## 実装の工夫

### ダークモード対応

フラッシュ防止のため、`<head>`タグ内に以下のスクリプトを配置しました：

```html
<script is:inline>
  const theme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

### Bento UI

作品紹介ページでは、Apple風のBento UIを実装しました。CSS Gridを使うことで、柔軟なレイアウトを実現しています。

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}
```

## パフォーマンス

Lighthouseスコアは以下の通りです：

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

静的サイト生成のおかげで、非常に高いパフォーマンスを実現できました。

## まとめ

Astroを使った個人サイト構築は、開発体験も良く、パフォーマンスも優れた選択でした。特に：

- Content Collectionsによる型安全なコンテンツ管理
- 静的生成による高速な表示
- Tailwind CSSとの統合のしやすさ

が大きなメリットでした。個人サイトやブログを構築する際は、ぜひAstroを検討してみてください。
