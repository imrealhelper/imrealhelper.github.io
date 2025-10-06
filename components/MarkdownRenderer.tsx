import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

const imageModules = import.meta.glob('../pages/**/*.{png,jpg,jpeg,gif,svg}', {
  eager: true,
  as: 'url',
});

const imageMap = new Map<string, string>();

Object.entries(imageModules).forEach(([key, value]) => {
  const relativePath = key.replace('../pages/', '');
  const url = value as string;
  const variations = new Set<string>();

  const addVariant = (variant: string) => {
    variations.add(variant);
    if (variant.startsWith('./')) {
      variations.add(variant.slice(2));
    }
    if (variant.startsWith('study-record/')) {
      variations.add(variant.replace(/^study-record\//, ''));
    }
  };

  addVariant(relativePath);
  addVariant(encodeURI(relativePath));

  variations.forEach((variant) => {
    imageMap.set(variant, url);
  });
});

const resolveImageSource = (src?: string): string | undefined => {
  if (!src) {
    return src;
  }

  const candidates = new Set<string>();

  const register = (candidate: string) => {
    candidates.add(candidate);
    if (!candidate.startsWith('./')) {
      candidates.add(`./${candidate}`);
    }
    if (!candidate.startsWith('study-record/')) {
      candidates.add(`study-record/${candidate}`);
    }
  };

  register(src.trim());

  try {
    register(decodeURI(src));
  } catch (error) {
    // ignore decoding errors and fall back to original src
  }

  for (const candidate of candidates) {
    const cleaned = candidate.replace(/^\.\//, '');
    const matched = imageMap.get(candidate) || imageMap.get(cleaned);
    if (matched) {
      return matched;
    }
  }

  return src;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <article className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({ src, ...props }) => {
            const resolvedSrc = resolveImageSource(src);
            return <img {...props} src={resolvedSrc} loading="lazy" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;