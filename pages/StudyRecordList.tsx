
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface StudyRecordItem {
  slug: string;
  title: string;
  summary: string;
}

const StudyRecordList: React.FC = () => {
  const [records, setRecords] = useState<StudyRecordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const { default: data } = (await import('./study-record/index.json')) as {
          default: StudyRecordItem[];
        };
        if (isMounted) {
          setRecords(data);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }
        console.error('학습 기록 로딩 실패:', err);
        setError('학습 기록 목록을 불러올 수 없습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="text-center py-10">목록을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">오류: {error}</div>;
  }

  return (
    <div className="prose max-w-none">
      <h1>Study Record</h1>
      <p>개인적으로 공부하고 정리한 내용들을 기록하는 공간입니다.</p>
      <div className="mt-8 not-prose">
        {records.length > 0 ? (
          <ul className="space-y-6">
            {records.map((record) => (
              <li key={record.slug} className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                <Link 
                  to={`/study-record/${record.slug}`} 
                  className="block group no-underline"
                >
                  <h2 className="text-2xl font-bold text-black group-hover:underline mb-2">
                    {record.title}
                  </h2>
                  <p className="text-neutral-600">
                    {record.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>기록된 학습 내용이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default StudyRecordList;
