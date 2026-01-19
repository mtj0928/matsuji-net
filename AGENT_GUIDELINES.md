# matsuji.net - 設計ドキュメント

このドキュメントは、matsuji.netの設計思想、実装パターン、拡張方法をまとめたものです。

## プロジェクト概要

個人サイトとして、以下の3つの主要機能を持つ静的サイトを構築しました：

1. **プロフィール表示** - 自己紹介とSNSリンク
2. **ブログ** - Markdownで執筆可能な技術ブログ
3. **作品紹介** - OSS、アプリ、登壇など多様な成果物の展示

## 技術選定の理由

### なぜAstroを選んだのか

1. **静的サイト生成** - 個人サイトに動的レンダリングは不要。SEOと表示速度を最優先
2. **Content Collections** - Markdownファイルを型安全に管理。ブログ執筆体験が良い
3. **ゼロJS by デフォルト** - インタラクティブ性は最小限。パフォーマンス最優先
4. **シンプルな学習曲線** - 複雑なフレームワークは避け、HTMLライクな記述

### なぜTailwind CSS 4.xを選んだのか

1. **ユーティリティファースト** - 複雑なCSSアーキテクチャを避けたい
2. **ダークモード対応** - `dark:` プレフィックスで簡潔に記述可能
3. **レスポンシブ** - `md:`, `lg:` などのブレークポイント管理が直感的
4. **バージョン4.x** - 新しいアーキテクチャで高速、設定もシンプル

### TypeScriptの採用

- Content Collectionsで型安全性を担保
- コンポーネントのPropsを明示的に定義
- リファクタリング時の安全性向上

## ページ設計の意図

### トップページ (`/`)

#### Desktop レイアウト - 2カラム構成

```
┌─────────────────────────────────────┐
│          Header                      │
├──────────────┬──────────────────────┤
│              │  Recent Blog Posts   │
│  Profile     │  ┌────┐ ┌────┐      │
│  Card        │  │    │ │    │      │
│              │  └────┘ └────┘      │
│              ├──────────────────────┤
│              │  Works              │
│              │  ┌──┐ ┌────┐        │
│              │  │  │ │    │        │
│              │  └──┘ └────┘        │
└──────────────┴──────────────────────┘
│          Footer                      │
└─────────────────────────────────────┘
```

**設計意図**:
- **左側に固定プロフィール** - 訪問者に最初に自己紹介を見せる
- **右側にコンテンツ** - ブログと作品を優先的に表示
- **スクロール不要で全体把握** - First Viewで全体像を伝える

#### Mobile レイアウト - 縦積み

```
┌──────────────┐
│   Header     │
├──────────────┤
│   Profile    │
├──────────────┤
│ Recent Blog  │
├──────────────┤
│    Works     │
├──────────────┤
│   Footer     │
└──────────────┘
```

**設計意図**:
- **情報の優先順位を明確に** - 上から順に重要度を配置
- **スマホでの可読性** - 横幅を気にせず縦に読み進める

### ブログページ (`/blog`)

#### 設計のポイント

1. **10件/ページのページング**
   - 読み込み速度とUXのバランス
   - `getStaticPaths` + `paginate` で静的生成

2. **タグフィルタリング**
   - 各タグごとに静的ページ生成（`/blog/tag/[tag]`）
   - タグクリックで即座に絞り込み結果表示

3. **記事カード形式**
   - ヘッダー画像、タイトル、説明、日付、タグを表示
   - グリッドレイアウトで視覚的に見やすく

#### Content Collections設計

```typescript
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),  // 更新日は任意
    heroImage: z.string().optional(),   // 画像は任意
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),  // 下書き機能
  }),
});
```

**設計意図**:
- **更新日を別フィールド化** - 公開日と更新日を明確に区別
- **draft機能** - 執筆途中の記事を公開前に確認可能
- **任意フィールドの柔軟性** - 画像なしでも記事公開可能

### 作品紹介ページ (`/works`)

#### デザイン原則

Works表示は**Recent Postsと統一されたシンプルなデザイン**を採用：

- **影・枠線なし** - クリーンな見た目
- **控えめなHover効果** - 背景色の変化のみ（`hover:bg-gray-100 dark:hover:bg-neutral-800`）
- **弱い角丸** - `rounded-lg`（約8px）で柔らかい印象
- **OGP表示はオプション** - `ogpEnabled` が `true` のときだけOGP情報を取得して表示

#### レイアウト構造

```
┌─────────────────────────────────────┐
│ 登壇                                 │
│ ┌────────────────────────────────┐ │
│ │ ┌────┐  タイトル              │ │
│ │ │IMG │  説明文...             │ │
│ │ └────┘                         │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ ┌────┐  タイトル              │ │
│ │ │IMG │  説明文...             │ │
│ │ └────┘                         │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**レイアウトの特徴**:
- **横並び配置**: 左に画像（16:9）、右にタイトル＋説明
- **カテゴリー別グループ化**: 登壇、記事執筆、OSS、アプリ開発で分類
- **縦積みリスト**: 各カテゴリー内で縦に並ぶ

#### ホーム画面とWorks一覧画面の違い

| 項目 | ホーム画面 | Works一覧画面 |
|------|-----------|--------------|
| 表示件数 | 4件（featured） | 全件（カテゴリー別） |
| OGP画像幅 | `w-36 sm:w-48 md:w-56` (144px/192px/224px) | `w-36 sm:w-48 md:w-64` (144px/192px/256px) |
| アイテム間隔 | `space-y-4` (16px) | `space-y-6` (24px) |
| パディング | `px-2 py-4 md:p-4` | `px-2 py-4 md:p-4` |

#### OGP画像取得の実装（オプション）

```typescript
// ビルド時に各WorkのOGP情報を取得（ogpEnabledがtrueの場合のみ）
const worksWithOgp = await Promise.all(
  sortedWorks.map(async (work) => {
    if (!work.data.ogpEnabled) {
      return {
        ...work,
        ogp: null,
      };
    }

    const ogp = await fetchOgp(work.data.link);
    return {
      ...work,
      ogp,
    };
  })
);

// 表示時のフォールバック
const useOgp = work.data.ogpEnabled;
const imageSrc = useOgp
  ? work.ogp?.image ?? work.data.image ?? fallbackWorkImage
  : work.data.image ?? fallbackWorkImage;
const title = work.data.title ?? (useOgp ? work.ogp?.title : undefined);
const description = work.data.description ?? (useOgp ? work.ogp?.description : undefined);
```

**ポイント**:
- OGP有効時のみビルドで取得するため、不要な外部取得を抑制
- OGP取得失敗時のフォールバックを用意
- 16:9のアスペクト比を維持

## 重要な実装パターン

### 1. ダークモード実装 - フラッシュ防止

**問題**: ページ読み込み時に一瞬ライトモードが表示される（フラッシュ）

**解決策**: `<head>` 内でインラインスクリプトを実行

```html
<script is:inline>
  const theme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**ポイント**:
- `is:inline` でバンドルをスキップし、即座に実行
- `localStorage` でユーザー設定を記憶
- システム設定（`prefers-color-scheme`）をフォールバック

### 2. Content Collections - 型安全なコンテンツ管理

**構造**:

```
src/content/
├── config.ts          # スキーマ定義
├── blog/
│   ├── post-1.md
│   └── post-2.md
└── works/
    ├── work-1.json
    └── work-2.json
```

**利点**:
- TypeScriptの型チェック
- フロントマターのバリデーション
- IDEの補完が効く

### 3. ページング実装

**Astroのpaginate関数を使用**:

```typescript
export async function getStaticPaths({ paginate }) {
  const allPosts = await getCollection('blog');
  const sortedPosts = allPosts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return paginate(sortedPosts, { pageSize: 10 });
}
```

**生成されるURL**:
- `/blog` - 1ページ目
- `/blog/2` - 2ページ目
- `/blog/3` - 3ページ目

### 4. タグフィルタリング - 動的ルーティング

```typescript
export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  const uniqueTags = [...new Set(allPosts.flatMap(post => post.data.tags))];

  return uniqueTags.map(tag => ({
    params: { tag },
    props: { posts: allPosts.filter(post => post.data.tags.includes(tag)) },
  }));
}
```

**生成されるページ**:
- `/blog/tag/Astro`
- `/blog/tag/Web開発`
- `/blog/tag/CSS`

すべて**ビルド時に静的生成**されるため、高速。

### 5. 角丸の同心円計算式

カード内に余白を持つ要素（画像など）の角丸を設定する際、外側のカードと同心円状に見えるようにするための計算式：

```
r2 = r1 - p
```

- `r1`: 外側の要素の角丸半径
- `p`: 余白（padding）
- `r2`: 内側の要素の角丸半径

**実例（Works カード）**:
```typescript
// カード全体
class="... p-2"  // padding = 8px

// カード全体の角丸（global.css）
.squircle-corners {
  border-radius: 28px;  // r1 = 28px
}

// OGP/サムネイル画像の角丸
// r2 = 28px - 8px = 20px
class="... rounded-[20px]"
```

**重要性**:
- 視覚的な調和が保たれる
- デザインの一貫性が向上
- プロフェッショナルな印象を与える

## レスポンシブデザインの戦略

### ブレークポイント

Tailwindのデフォルト設定を使用：

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### 実装パターン

```astro
<!-- Desktop: 3カラム、Mobile: 1カラム -->
<div class="hidden lg:grid lg:grid-cols-3 lg:gap-8">
  <!-- Desktop layout -->
</div>

<div class="lg:hidden space-y-8">
  <!-- Mobile layout -->
</div>
```

**方針**:
- **Mobile First ではなく Desktop First** - このサイトではDesktop体験を優先
- **完全な切り替え** - 中途半端なレスポンシブではなく、明確に切り替える

## パフォーマンス最適化

### 静的サイト生成

- すべてのページをビルド時に生成
- ランタイムでのデータフェッチなし
- HTMLが直接配信される

### ゼロJS（ほぼ）

JavaScriptを使用しているのは以下のみ：

1. **ダークモード切り替え** - 必須機能
2. **モバイルメニュー** - UIインタラクション

それ以外はHTMLとCSSのみで実装。

### 画像最適化（今後）

現在はプレースホルダーだが、本番では：

```astro
<Image src={heroImage} alt={title} width={800} height={600} />
```

Astroの`<Image />`コンポーネントで自動最適化。

## アクセシビリティへの配慮

### セマンティックHTML

```html
<header> - サイトヘッダー
<nav> - ナビゲーション
<main> - メインコンテンツ
<article> - ブログ記事
<footer> - フッター
```

### ARIAラベル

```html
<button aria-label="Toggle dark mode">
<nav aria-label="Pagination">
```

### キーボード操作

- すべてのインタラクティブ要素に `<button>` または `<a>` を使用
- フォーカス可視化（`:focus-visible`）

### カラーコントラスト

WCAG AA基準を満たすように配慮：
- 通常テキスト: 4.5:1以上
- 大きなテキスト: 3:1以上

## コンポーネント設計哲学

### 単一責任の原則

各コンポーネントは1つの責務のみ：

- `ProfileCard.astro` - プロフィール表示のみ
- `BlogCard.astro` - 記事カード表示のみ
- `Pagination.astro` - ページング表示のみ

### Props型定義

すべてのコンポーネントでPropsを明示：

```typescript
interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
```

### スタイルの局所化

グローバルスタイルは最小限に抑え、必要に応じて `<style>` タグでスコープ化。

## ディレクトリ構成の意図

```
src/
├── components/
│   ├── layout/      # サイト全体のレイアウト
│   ├── common/      # 汎用的な共通コンポーネント
│   ├── home/        # トップページ専用
│   ├── blog/        # ブログ機能専用
│   └── works/       # 作品紹介専用
├── content/         # コンテンツ（Markdown, JSON）
├── layouts/         # ページレイアウト
├── pages/           # ルーティング
├── styles/          # グローバルCSS
└── utils/           # ユーティリティ関数
```

**方針**:
- **機能ごとにディレクトリを分離** - 関連ファイルを近くに配置
- **ページ専用コンポーネントは分離** - 再利用性を考慮

## 今後の拡張性

### 新しいページの追加

1. `src/pages/` にファイル追加
2. 必要に応じて `src/components/` にコンポーネント追加
3. ルーティングは自動的に生成される

### 新しいコンテンツタイプの追加

例: ポートフォリオセクション

1. `src/content/config.ts` にスキーマ追加：

```typescript
const portfolioCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // スキーマ定義
  }),
});
```

2. `src/content/portfolio/` ディレクトリ作成
3. `src/pages/portfolio/` にページ追加

### 多言語対応（将来）

Astroの i18n 機能を使用可能：

```typescript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
  },
});
```

## デプロイメント戦略

### GitHub Actions によるCD

`.github/workflows/deploy.yml` で自動デプロイ：

1. `main` ブランチへのプッシュをトリガー
2. 依存関係インストール
3. Astroビルド（`npm run build`）
4. GitHub Pagesへデプロイ

### ビルド成果物

`dist/` ディレクトリに生成：
- 静的HTML
- CSS（Tailwindコンパイル済み）
- 最小限のJavaScript
- 画像などのアセット

### CNAME設定

`public/CNAME` でカスタムドメイン設定：
```
matsuji.net
```

## トラブルシューティング

### Tailwind CSS 4.x の制約

**問題**: カスタムカラー（`bg-primary-500`）がビルド時にエラー

**原因**: Tailwind CSS 4.xの新アーキテクチャではカスタム設定の扱いが変更

**解決**:
- `tailwind.config.mjs` を削除
- 必要なカラーは直接CSSで定義

### Content Collections のデータ形式

**問題**: `works.json` が配列形式だとエラー

**原因**: Content Collectionsは個別ファイルを期待

**解決**:
```bash
# 配列を個別JSONファイルに分割
cat works.json | jq -c '.[]' | nl | while IFS=: read n json; do
  echo "$json" > "work-$n.json"
done
```

## デザインシステム

### UI一貫性の原則

サイト全体で統一されたデザイン言語を使用：

1. **Recent Posts風のシンプルデザイン**
   - Works表示もこのスタイルに統一
   - 影・枠線を使わず、クリーンな見た目
   - Hoverは背景色の変化のみ

2. **角丸の使い分け**
   - 強調が必要な要素: `squircle-corners` (28px) - Profileカード等
   - 一般的な要素: `rounded-lg` (8px) - Works, Posts等
   - 画像要素: `rounded-md` (6px) - サムネイル画像等
   - 同心円の法則（r2 = r1 - p）を適用

3. **Hover効果の統一**
   - 浮き上がりや影の変化は使わない
   - 背景色の変化のみ: `hover:bg-gray-100 dark:hover:bg-neutral-800`
   - トランジション: `transition-colors`

4. **テキストの配置**
   - 画像とテキストの組み合わせでは上揃え（`justify-start`）
   - 視覚的な統一感を重視

## まとめ

このサイトは以下の原則に基づいて設計されています：

1. **シンプルさ** - 複雑な機能は避け、必要十分な機能のみ実装
2. **パフォーマンス** - 静的生成とゼロJSで最高速度を実現
3. **保守性** - TypeScript、Content Collections、明確なディレクトリ構造
4. **拡張性** - 新しいページやコンテンツタイプの追加が容易
5. **アクセシビリティ** - すべてのユーザーが利用可能
6. **デザインの一貫性** - Recent Postsを基準とした統一されたUI

個人サイトとして必要な機能を過不足なく実装し、今後の成長に対応できる基盤が整っています。
