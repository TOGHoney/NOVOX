import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {updateProfile} from '../api/userService';

export default function LearningProfile() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hoveredLang, setHoveredLang] = useState('');
  const [hoveredLevel, setHoveredLevel] = useState('');

  const languages = [
    { name: 'Japanese', flag: '🇯🇵' },
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'German', flag: '🇩🇪' },
    { name: 'Thai', flag: '🇹🇭' }
  ];

  const cefrLevels = [
    { level: 'A1', title: 'Beginner', desc: 'Can understand and use familiar everyday expressions.' },
    { level: 'A2', title: 'Elementary', desc: 'Can communicate in simple and routine tasks.' },
    { level: 'B1', title: 'Intermediate', desc: 'Can deal with most situations likely to arise while travelling.' },
    { level: 'B2', title: 'Upper Intermediate', desc: 'Can interact with a degree of fluency and spontaneity.' },
    { level: 'C1', title: 'Advanced', desc: 'Can express ideas fluently and spontaneously.' },
    { level: 'C2', title: 'Proficient', desc: 'Can summarize information from different spoken and written sources.' }
  ];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setTimeout(() => {
      setStep(2);
    }, 300);
  };

  const handleContinue = async () => {

    if (!selectedLanguage || !selectedLevel) {
        alert("Please select both language and level.");
        return;
    }

    try {

        await updateProfile({
            targetLanguage: selectedLanguage,
            cefrLevel: selectedLevel,
            profileCompleted: true
        });

        // Update localStorage also
        const user = JSON.parse(localStorage.getItem("user"));

        user.targetLanguage = selectedLanguage;
        user.cefrLevel = selectedLevel;
        user.profileCompleted = true;

        localStorage.setItem("user", JSON.stringify(user));

        navigate("/");

    } catch (error) {
        console.error(error);
        alert("Failed to save profile.");
    }
};

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
      display: 'flex',
      alignItem: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '24px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '700px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              color: '#ffffff',
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-0.025em'
            }}>
              LinguaBrief Onboarding
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '15px',
              margin: '0',
              fontWeight: '400'
            }}>
              {step === 1 ? 'Step 1 of 2: Choose your path' : 'Step 2 of 2: Assess your proficiency'}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '10px 16px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>🇬🇧</span>
            <span>English (Fixed)</span>
          </div>
        </div>

        <div style={{
          opacity: step === 1 ? 1 : 0,
          transform: step === 1 ? 'translateY(0)' : 'translateY(-20px)',
          height: step === 1 ? 'auto' : '0px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: step === 1 ? 'auto' : 'none'
        }}>
          <h2 style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            letterSpacing: '-0.01em'
          }}>
            Choose Target Language
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '16px',
            marginBottom: '10px'
          }}>
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.name;
              const isHovered = hoveredLang === lang.name;
              return (
                <div
                  key={lang.name}
                  onClick={() => handleLanguageSelect(lang.name)}
                  onMouseEnter={() => setHoveredLang(lang.name)}
                  onMouseLeave={() => setHoveredLang('')}
                  style={{
                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <span style={{ fontSize: '36px' }}>{lang.flag}</span>
                  <span style={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '500'
                  }}>{lang.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          opacity: step === 2 ? 1 : 0,
          transform: step === 2 ? 'translateY(0)' : 'translateY(20px)',
          height: step === 2 ? 'auto' : '0px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          pointerEvents: step === 2 ? 'auto' : 'none'
        }}>
          {selectedLanguage && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '6px 12px',
              borderRadius: '12px',
              color: '#93c5fd',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              <span>Selected Target:</span>
              <span style={{ color: '#ffffff', fontWeight: '600' }}>{selectedLanguage}</span>
            </div>
          )}
          <h2 style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            letterSpacing: '-0.01em'
          }}>
            What is your current CEFR level?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {cefrLevels.map((item) => {
              const isSelected = selectedLevel === item.level;
              const isHovered = hoveredLevel === item.level;
              return (
                <div
                  key={item.level}
                  onClick={() => setSelectedLevel(item.level)}
                  onMouseEnter={() => setHoveredLevel(item.level)}
                  onMouseLeave={() => setHoveredLevel('')}
                  style={{
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '20px',
                    cursor: 'pointer',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.2)' : isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      color: isSelected ? '#60a5fa' : '#ffffff',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>{item.level}</span>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>{item.title}</span>
                  </div>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    margin: '0'
                  }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {selectedLevel && (
            <div style={{
              animation: 'fadeIn 0.3s ease forwards',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleContinue}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '16px 36px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {loading ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    borderTopColor: '#ffffff',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}