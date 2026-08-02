import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FiMessageSquare, FiX, FiLink, FiImage, FiVideo, FiSend } from 'react-icons/fi';

export const FormattedComment = ({ text }) => {
  if (!text) return null;

  const imageMatch = text.match(/!\[img\]\((.*?)\)/);
  if (imageMatch) {
    const imageUrl = imageMatch[1];
    const cleanText = text.replace(/!\[img\]\((.*?)\)/, '');
    return (
      <div>
        <span style={{ color: '#e2e8f0' }}>{cleanText}</span>
        <img src={imageUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '0.4rem', display: 'block' }} />
      </div>
    );
  }

  const videoMatch = text.match(/!\[video\]\((.*?)\)/);
  if (videoMatch) {
    const videoUrl = videoMatch[1];
    const cleanText = text.replace(/!\[video\]\((.*?)\)/, '');
    return (
      <div>
        <span style={{ color: '#e2e8f0' }}>{cleanText}</span>
        <video src={videoUrl} controls style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '0.4rem', display: 'block' }} />
      </div>
    );
  }

  const linkMatch = text.match(/\[(.*?)\]\((.*?)\)/);
  if (linkMatch) {
    const label = linkMatch[1];
    const url = linkMatch[2];
    const parts = text.split(/\[(.*?)\]\((.*?)\)/);
    return (
      <span style={{ color: '#e2e8f0' }}>
        {parts[0]}
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>
          {label}
        </a>
        {parts[3]}
      </span>
    );
  }

  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  return <span dangerouslySetInnerHTML={{ __html: formatted }} style={{ color: '#e2e8f0' }} />;
};

export default function CommentSidebar({ showComments, setShowComments, commentList, setCommentList }) {
  const [commentText, setCommentText] = useState('');
  const textareaRef = useRef(null);

  // Position and Dimension State
  const [commentPos, setCommentPos] = useState({ x: window.innerWidth - 420, y: 80 });
  const [commentSize, setCommentSize] = useState({ width: 380, height: 500 });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, initialW: 0, initialH: 0 });

  // Drag Handlers
  const handleMouseDownDrag = (e) => {
    if (e.target.closest('.close-btn')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: commentPos.x,
      initialY: commentPos.y
    };
  };

  // Resize Handlers
  const handleMouseDownResize = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialW: commentSize.width,
      initialH: commentSize.height
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setCommentPos({
        x: Math.max(10, Math.min(window.innerWidth - 200, dragRef.current.initialX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy))
      });
    } else if (isResizing) {
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;
      setCommentSize({
        width: Math.max(280, Math.min(900, resizeRef.current.initialW + dx)),
        height: Math.max(320, Math.min(850, resizeRef.current.initialH + dy))
      });
    }
  }, [isDragging, isResizing]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove]);

  const applyFormatting = (wrapSymbol) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = commentText.substring(start, end);
    
    let updatedText = '';
    if (selectedText.length > 0) {
      updatedText =
        commentText.substring(0, start) +
        `${wrapSymbol}${selectedText}${wrapSymbol}` +
        commentText.substring(end);
    } else {
      updatedText =
        commentText.substring(0, start) +
        `${wrapSymbol}text${wrapSymbol}` +
        commentText.substring(end);
    }
    setCommentText(updatedText);
  };

  const handleAddLink = () => {
    const url = prompt('Enter website URL:');
    if (!url) return;
    const label = prompt('Enter link text:', 'Link') || 'Link';
    setCommentText((prev) => `${prev} [${label}](${url})`);
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL (e.g. https://example.com/image.jpg):');
    if (!url) return;
    setCommentText((prev) => `${prev} ![img](${url})`);
  };

  const handleAddVideo = () => {
    const url = prompt('Enter video URL (MP4 link):');
    if (!url) return;
    setCommentText((prev) => `${prev} ![video](${url})`);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: '@You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: commentText,
      isReply: false
    };
    setCommentList([...commentList, newComment]);
    setCommentText('');
  };

  if (!showComments) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${commentPos.x}px`,
        top: `${commentPos.y}px`,
        width: `${commentSize.width}px`,
        height: `${commentSize.height}px`,
        backgroundColor: '#131822',
        color: '#e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid #2a3447',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Header Bar */}
      <div
        onMouseDown={handleMouseDownDrag}
        style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          borderBottom: '1px solid #2a3447',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          backgroundColor: '#1a2232',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiMessageSquare size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Comments</span>
        </div>
        
        {/* Top-Right Far-Corner Close Button */}
        <button
          className="close-btn"
          onClick={() => setShowComments(false)}
          style={{
            border: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '6px',
            borderRadius: '6px',
            marginLeft: 'auto',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Comment List Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {commentList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          commentList.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '0.6rem', position: 'relative', marginLeft: item.isReply ? '1.5rem' : '0' }}>
              {item.isReply && (
                <div style={{ position: 'absolute', left: '-12px', top: '-10px', width: '10px', height: '22px', borderLeft: '2px solid #334155', borderBottom: '2px solid #334155', borderBottomLeftRadius: '6px' }} />
              )}
              <img src={item.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }} />
              <div style={{ flex: 1, backgroundColor: '#1e2738', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid #2a3447' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.2rem' }}>
                  {item.author}
                </div>
                <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  <FormattedComment text={item.text} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Area with Custom Grip & Hover Tooltip */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #2a3447', backgroundColor: '#1a2232', flexShrink: 0, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', backgroundColor: '#0f172a', borderRadius: '10px', padding: '0.5rem', border: '1px solid #334155' }}>
          <textarea
            ref={textareaRef}
            rows={2}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.2rem', borderTop: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8' }}>
              <span onClick={() => applyFormatting('**')} title="Bold" style={{ fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', padding: '0 2px' }}>B</span>
              <span onClick={() => applyFormatting('*')} title="Italic" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', padding: '0 2px' }}>I</span>
              <FiLink size={14} onClick={handleAddLink} title="Add Link" style={{ cursor: 'pointer' }} />
              <FiImage size={14} onClick={handleAddImage} title="Add Image URL" style={{ cursor: 'pointer' }} />
              <FiVideo size={14} onClick={handleAddVideo} title="Add Video URL" style={{ cursor: 'pointer' }} />
            </div>
            <button
              onClick={handleAddComment}
              style={{ border: 'none', background: '#2563eb', color: '#fff', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FiSend size={13} />
            </button>
          </div>
        </div>

        {/* Resizable Corner Handle with Tooltip */}
        <div
          onMouseDown={handleMouseDownResize}
          title="Drag corner to resize"
          style={{
            position: 'absolute',
            right: '3px',
            bottom: '3px',
            width: '16px',
            height: '16px',
            cursor: 'nwse-resize',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            userSelect: 'none',
            zIndex: 10
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}