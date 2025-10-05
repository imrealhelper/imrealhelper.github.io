
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

const MarkdownPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
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
    const markdownMap = isStudyRecord ? studyRecordMarkdowns : generalMarkdowns;
    const filePath = isStudyRecord
      ? `./study-record/${decodedSlug}.md`
      : `./${decodedSlug}.md`;

    const markdownContent = markdownMap[filePath];

    if (!markdownContent) {
      setError(`'${decodedSlug}' 페이지를 찾을 수 없습니다.`);
      setContent('');
      setLoading(false);
      return;
    }

    setContent(markdownContent);
    setLoading(false);
  }, [slug, location.pathname]);

  if (loading) {
    return <div className="text-center py-10">페이지를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">오류: {error}</div>;
  }

  return <MarkdownRenderer content={content} />;
};

export default MarkdownPage;
