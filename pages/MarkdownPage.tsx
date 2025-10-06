
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

const generalMarkdowns = import.meta.glob('./*.md', {
  as: 'raw',
  eager: true,
}) as Record<string, string>;

const studyRecordMarkdowns = import.meta.glob('./study-record/*.md', {
  as: 'raw',
  eager: true,
}) as Record<string, string>;

interface MarkdownEntry {
  slug: string;
  content: string;
  metadata: Record<string, string>;
}

interface ParsedMarkdown {
  content: string;
  metadata: Record<string, string>;
}

const parseMarkdown = (raw: string): ParsedMarkdown => {
  const normalized = raw.replace(/\r\n?/g, '\n');
  const lines = normalized.split('\n');
  const metadata: Record<string, string> = {};

  let metaStart = -1;
  let metaEnd = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (match) {
      if (metaStart === -1) {
        // allow metadata block only if it appears after optional headings/blank lines
        let prevIndex = i - 1;
        while (prevIndex >= 0 && lines[prevIndex].trim() === '') {
          prevIndex -= 1;
        }
        if (prevIndex >= 0 && !lines[prevIndex].trim().startsWith('#')) {
          break;
        }
        metaStart = i;
      }

      metadata[match[1].trim()] = match[2].trim();
      continue;
    }

    if (metaStart !== -1) {
      metaEnd = i;
      break;
    }

    if (line.trim() !== '') {
      break;
    }
  }

  if (metaStart === -1) {
    return { content: normalized, metadata };
  }

  if (metaEnd === -1) {
    metaEnd = lines.length;
  }

  const contentLines = lines.slice(0, metaStart).concat(lines.slice(metaEnd));
  const content = contentLines.join('\n').replace(/^\s+/, '');

  return {
    content,
    metadata,
  };
};

const buildMarkdownIndex = (
  markdownMap: Record<string, string>,
  basePath: string,
): Map<string, MarkdownEntry> => {
  const index = new Map<string, MarkdownEntry>();

  Object.entries(markdownMap).forEach(([key, rawContent]) => {
    const relativePath = key.replace(basePath, '').replace(/^\.\//, '');
    const fileSlug = relativePath.replace(/\.md$/i, '');
    const { content, metadata } = parseMarkdown(rawContent);
    const primarySlug = metadata.slug?.trim() || fileSlug;

    const entry: MarkdownEntry = {
      slug: primarySlug,
      content,
      metadata: {
        ...metadata,
        slug: primarySlug,
      },
    };

    const decodedPrimary = decodeURIComponent(primarySlug);
    const decodedFileSlug = decodeURIComponent(fileSlug);

    if (!index.has(decodedPrimary)) {
      index.set(decodedPrimary, entry);
    }

    if (!index.has(decodedFileSlug)) {
      index.set(decodedFileSlug, entry);
    }
  });

  return index;
};

const generalMarkdownIndex = buildMarkdownIndex(generalMarkdowns, './');
const studyRecordMarkdownIndex = buildMarkdownIndex(studyRecordMarkdowns, './study-record/');

const MarkdownPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    setLoading(true);
    setError(null);

    const decodedSlug = decodeURIComponent(slug);
    const isStudyRecord = location.pathname.startsWith('/study-record/');
    const markdownMap = isStudyRecord ? studyRecordMarkdownIndex : generalMarkdownIndex;
    const entry = markdownMap.get(decodedSlug);

    if (!entry) {
      setError(`'${decodedSlug}' 페이지를 찾을 수 없습니다.`);
      setContent('');
      setMetadata({});
      setLoading(false);
      return;
    }

    setContent(entry.content);
    setMetadata(entry.metadata);
    setLoading(false);
  }, [slug, location.pathname]);

  if (loading) {
    return <div className="text-center py-10">페이지를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">오류: {error}</div>;
  }

  const metaItems = [
    metadata.date && { label: '작성일', value: metadata.date },
    metadata.updatedAt && { label: '업데이트', value: metadata.updatedAt },
    metadata.author && { label: '작성자', value: metadata.author },
    metadata.tags && { label: '태그', value: metadata.tags },
    metadata.category && { label: '카테고리', value: metadata.category },
    metadata.status && { label: '상태', value: metadata.status },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="space-y-6">
      {metaItems.length > 0 && (
        <section className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <dl className="grid gap-3 sm:grid-cols-2">
            {metaItems.map((item) => (
              <div key={`${item.label}-${item.value}`} className="flex flex-col gap-0.5">
                <dt className="font-semibold uppercase tracking-wide text-neutral-500 text-xs">
                  {item.label}
                </dt>
                <dd className="text-neutral-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <MarkdownRenderer content={content} />
    </div>
  );
};

export default MarkdownPage;
