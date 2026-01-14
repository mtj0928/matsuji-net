---
title: "ダークモード実装のベストプラクティス"
description: "フラッシュ防止からアクセシビリティまで、ダークモード実装の勘所をまとめました。"
pubDate: 2025-12-28T00:00:00Z
heroImage: "/images/blog/dark-mode.png"
tags: ["CSS", "アクセシビリティ", "デザイン"]
draft: false
---

## はじめに

ダークモードは今やWebサイトの標準機能となりつつあります。しかし、正しく実装しないと、ユーザー体験を損なう可能性があります。この記事では、ダークモード実装のベストプラクティスを紹介します。

## フラッシュ問題とは

ダークモード実装で最も一般的な問題は**フラッシュ問題**です。

### 問題の発生メカニズム

1. HTMLが読み込まれる（デフォルトはライトモード）
2. JavaScriptが実行される
3. ダークモードに切り替わる

この間に、一瞬ライトモードが表示されてしまいます。

### 解決策：インラインスクリプト

`<head>`タグ内に、HTMLパース前に実行されるスクリプトを配置します：

```html
<head>
  <script is:inline>
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  </script>
</head>
```

**重要なポイント**
- `is:inline`属性でバンドルをスキップ
- `localStorage`から設定を読み込み
- システム設定もフォールバックとして利用

## Tailwind CSSでの実装

Tailwind CSSを使う場合、設定は非常にシンプルです。

### tailwind.config.js

```javascript
module.exports = {
  darkMode: 'class', // クラスベースのダークモード
  // ...
};
```

### CSSの書き方

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  コンテンツ
</div>
```

## 切り替えボタンの実装

### HTML構造

```html
<button id="theme-toggle">
  <svg class="sun-icon hidden dark:block"><!-- Sun SVG --></svg>
  <svg class="moon-icon block dark:hidden"><!-- Moon SVG --></svg>
</button>
```

### JavaScript

```javascript
const button = document.getElementById('theme-toggle');

button.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

## カラーパレットの設計

### コントラスト比

WCAG AA基準に従い、以下のコントラスト比を確保します：

- 通常テキスト: 4.5:1以上
- 大きなテキスト: 3:1以上

### 推奨カラー

**ライトモード**
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
}
```

**ダークモード**
```css
.dark {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
}
```

## アクセシビリティ

### ARIAラベル

```html
<button aria-label="Toggle dark mode">
  <!-- アイコン -->
</button>
```

### キーボード操作

切り替えボタンは`<button>`要素を使用し、キーボードでも操作可能にします。

### 視覚的フィードバック

```css
.theme-toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

## システム設定との連携

ユーザーのシステム設定を尊重することも重要です。

```javascript
// システム設定の変更を監視
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
```

## トランジション

ダークモード切り替え時のトランジションを追加します。

```css
* {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
```

**注意点**
- 初回読み込み時はトランジションを無効化
- アニメーションの負荷に注意

## 画像の対応

### Picture要素

```html
<picture>
  <source srcset="dark-image.png" media="(prefers-color-scheme: dark)">
  <img src="light-image.png" alt="説明">
</picture>
```

### CSS Filter

```css
.dark img {
  filter: brightness(0.8) contrast(1.2);
}
```

## テストのポイント

- [ ] フラッシュが発生しないか
- [ ] システム設定が反映されるか
- [ ] 切り替えがスムーズか
- [ ] コントラスト比が十分か
- [ ] キーボード操作が可能か

## よくある落とし穴

### 1. グローバルステートの管理

複数の切り替えボタンがある場合、状態が同期されるようにします。

### 2. サードパーティコンポーネント

外部ライブラリのダークモード対応を確認し、必要に応じてカスタマイズします。

### 3. パフォーマンス

トランジションが多すぎると、パフォーマンスに影響します。最小限に抑えましょう。

## まとめ

ダークモード実装のベストプラクティス：

1. **フラッシュ防止**: インラインスクリプトで初期化
2. **カラー設計**: 十分なコントラスト比を確保
3. **アクセシビリティ**: ARIAラベルとキーボード操作対応
4. **システム設定**: prefers-color-schemeを尊重
5. **スムーズな切り替え**: 適切なトランジション

これらを意識することで、ユーザーフレンドリーなダークモードを実装できます。

## 参考資料

- [MDN Web Docs: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
