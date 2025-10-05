
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MarkdownPage from './pages/MarkdownPage';
import StudyRecordList from './pages/StudyRecordList';

const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/study-record" element={<StudyRecordList />} />
              <Route path="/study-record/:slug" element={<MarkdownPage />} />
              <Route path="/:slug" element={<MarkdownPage />} />
            </Routes>
          </div>
        </main>
        <footer className="font-sans text-center py-4 text-xs text-neutral-500 border-t border-neutral-200">
          <p>&copy; {new Date().getFullYear()} Jinwoo Im. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;