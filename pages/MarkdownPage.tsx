
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

const MarkdownPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchMarkdown = async () => {
      setLoading(true);
      setError(null);
      
      const isStudyRecord = location.pathname.startsWith('/study-record/');
      const filePath = isStudyRecord
        ? `./pages/study-record/${slug}.md`
        : `./pages/${slug}.md`;

      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`'${slug}' 페이지를 찾을 수 없습니다.`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('페이지를 불러오는 중 알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
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
