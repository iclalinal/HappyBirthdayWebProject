import { useMemo, useState } from 'react';
import { createCard } from '../services/cardService';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import Cake from '../components/Cake';
import Envelope from '../components/Envelope';
import CardBook from '../components/CardBook';
import HeartConfetti from '../components/HeartConfetti';
import StarConfetti from '../components/StarConfetti';
import SnowConfetti from '../components/SnowConfetti';
import '../styles/create-card.css';

// Generate dynamic background based on hex color
const getDynamicBackground = (hexColor: string): string => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `radial-gradient(circle at 20% 20%, rgba(${r}, ${g}, ${b}, 0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(${r}, ${g}, ${b}, 0.16), transparent 30%), linear-gradient(135deg, #0b152e 0%, #0d1f3a 40%, #07101f 100%)`
}

// Theme Presets
const PRESETS = [
  {
    key: 'ocean',
    labelKey: 'theme_ocean',
    icon: '🌊',
    colors: {
      backgroundColor: '#1e3a5f',
      cakeColor: '#4a90e2',
      envelopeColor: '#2c5aa0',
      confettiColor: '#87ceeb',
    },
  },
  {
    key: 'sunset',
    labelKey: 'theme_sunset',
    icon: '🌅',
    colors: {
      backgroundColor: '#4a1f3a',
      cakeColor: '#ff6b35',
      envelopeColor: '#d84315',
      confettiColor: '#ffb74d',
    },
  },
  {
    key: 'lavender',
    labelKey: 'theme_lavender',
    icon: '🌸',
    colors: {
      backgroundColor: '#2d1b3d',
      cakeColor: '#9d4edd',
      envelopeColor: '#7209b7',
      confettiColor: '#c77dff',
    },
  },
  {
    key: 'midnight',
    labelKey: 'theme_midnight',
    icon: '🌙',
    colors: {
      backgroundColor: '#0a0e27',
      cakeColor: '#4a5568',
      envelopeColor: '#2d3748',
      confettiColor: '#e2e8f0',
    },
  },
  {
    key: 'love',
    labelKey: 'theme_love',
    icon: '❤️',
    colors: {
      backgroundColor: '#4a0e0e',
      cakeColor: '#ff3366',
      envelopeColor: '#800020',
      confettiColor: '#ffb3b3',
    },
  },
  {
    key: 'forest',
    labelKey: 'theme_forest',
    icon: '🌲',
    colors: {
      backgroundColor: '#1a2f1a',
      cakeColor: '#8fbc8f',
      envelopeColor: '#2e8b57',
      confettiColor: '#ffd700',
    },
  },
];

interface FormData {
  senderName: string;
  recipientName: string;
  email: string;
  message: string;
  backgroundColor: string;
  cakeColor: string;
  envelopeColor: string;
  confettiColor: string;
  confettiType: 'heart' | 'star' | 'snow';
}

const ConfettiLayer = ({ type, themeColor }: { type: FormData['confettiType']; themeColor: string }) => {
  if (type === 'heart') return <HeartConfetti themeColor={themeColor} />
  if (type === 'star') return <StarConfetti themeColor={themeColor} />
  if (type === 'snow') return <SnowConfetti themeColor={themeColor} />
  return null
}

export default function CreateCard() {
  const { t, language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    recipientName: '',
    email: '',
    message: '',
    backgroundColor: '#1e3a5f',
    cakeColor: '#4a90e2',
    envelopeColor: '#2c5aa0',
    confettiColor: '#87ceeb',
    confettiType: 'heart',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const previewMessages = useMemo(() => {
    const base = formData.message.trim()
      ? formData.message.split('\n').filter(Boolean)
      : [t('example_message_line1'), t('example_message_line2')];
    const withSignature = formData.senderName.trim()
      ? [...base, `- ${formData.senderName}`]
      : base;
    return withSignature;
  }, [formData.message, formData.senderName, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      ...preset.colors,
    }));
    addToast(`${t(preset.key as any)} ${t('theme_applied')}`, 'success');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.senderName.trim()) newErrors.senderName = t('sender_required');
    if (!formData.recipientName.trim()) newErrors.recipientName = t('recipient_required');
    if (!formData.email.trim()) newErrors.email = t('email_required');
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = t('email_invalid');
    if (!formData.message.trim()) newErrors.message = t('message_required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      senderName: formData.senderName.trim(),
      recipientName: formData.recipientName.trim(),
      message: formData.message.trim(),
      backgroundColor: formData.backgroundColor,
      cakeColor: formData.cakeColor,
      envelopeColor: formData.envelopeColor,
      confettiColor: formData.confettiColor,
      confettiType: formData.confettiType,
      email: formData.email.trim(),
    };

    try {
      const id = await createCard(payload);
      const base = import.meta.env.BASE_URL || '/';
      const normalizedBase = base.endsWith('/') ? base : `${base}/`;
      const link = `${window.location.origin}${normalizedBase}card/${id}`;
      setCreatedLink(link);
      addToast(t('card_created'), 'success');
      console.log('Kart oluşturuldu:', { id, ...payload });

      setFormData({
        senderName: '',
        recipientName: '',
        email: '',
        message: '',
        backgroundColor: '#1e3a5f',
        cakeColor: '#4a90e2',
        envelopeColor: '#2c5aa0',
        confettiColor: '#87ceeb',
        confettiType: 'heart',
      });
      setErrors({});
    } catch (error) {
      console.error('Kart oluşturulurken hata oluştu:', error);
      addToast(t('card_creation_failed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!createdLink) return;
    try {
      await navigator.clipboard.writeText(createdLink);
      addToast(t('link_copied'), 'info');
    } catch (error) {
      console.error('Link kopyalanamadı:', error);
      addToast(t('link_copy_failed'), 'error');
    }
  };

  return (
    <div className="create-card-container">
      {/* Global Confetti Layer - Full Screen */}
      <ConfettiLayer type={formData.confettiType} themeColor={formData.confettiColor} />
      
      <div className="create-card-card">
        <div className="create-card-header">
          <div>
            <h1 className="create-card-title">
              {t('create_title')}
            </h1>
            <p className="create-card-subtitle">{t('create_subtitle')}</p>
          </div>
          <div className="lang-switch-container">
            <button
              className={`lang-btn ${language === 'tr' ? 'active' : ''}`}
              onClick={() => setLanguage('tr')}
            >
              TR
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>

        <div className="create-card-grid">
          <div className="form-column">
            <form onSubmit={handleSubmit} className="create-card-form">
              {/* Gönderen Adı */}
              <div className="form-group">
                <label htmlFor="senderName" className="form-label">
                  {t('sender_label')} *
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.senderName ? 'input-error' : ''}`}
                  placeholder={t('sender_placeholder')}
                  required
                />
                {errors.senderName && <span className="error-text">{errors.senderName}</span>}
              </div>

              {/* Alıcı Adı */}
              <div className="form-group">
                <label htmlFor="recipientName" className="form-label">
                  {t('recipient_label')} *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.recipientName ? 'input-error' : ''}`}
                  placeholder={t('recipient_placeholder')}
                  required
                />
                {errors.recipientName && <span className="error-text">{errors.recipientName}</span>}
              </div>

              {/* E-posta */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t('email_label')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder={t('email_placeholder')}
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Mesaj */}
              <div className="form-group">
                <div className="label-with-counter">
                  <label htmlFor="message" className="form-label">
                    {t('message_label')} *
                  </label>
                  <span className="char-counter">
                    {formData.message.length}/500
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                  placeholder={t('message_placeholder')}
                  rows={4}
                  maxLength={500}
                  required
                />
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              {/* Hızlı Tema Seç */}
              <div className="form-group">
                <label className="form-label">
                  {t('quick_theme_label')}
                </label>
                <div className="preset-buttons">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      className="preset-button"
                      onClick={() => handlePresetSelect(preset)}
                      style={{
                        background: `linear-gradient(135deg, ${preset.colors.backgroundColor}, ${preset.colors.cakeColor})`,
                      }}
                    >
                      <span className="preset-icon">{preset.icon}</span>
                      <span className="preset-name">{t(preset.labelKey as any)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detaylı Renk Ayarları */}
              <div className="form-group">
                <label className="form-label">
                  {t('detailed_colors_label')}
                </label>
                <div className="color-pickers-grid">
                  <div className="color-picker-item">
                    <label htmlFor="backgroundColor" className="color-label">{t('background_color')}</label>
                    <input
                      type="color"
                      id="backgroundColor"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleInputChange}
                      className="color-input"
                    />
                    <span className="color-value">{formData.backgroundColor.toUpperCase()}</span>
                  </div>
                  <div className="color-picker-item">
                    <label htmlFor="cakeColor" className="color-label">{t('cake_color')}</label>
                    <input
                      type="color"
                      id="cakeColor"
                      name="cakeColor"
                      value={formData.cakeColor}
                      onChange={handleInputChange}
                      className="color-input"
                    />
                    <span className="color-value">{formData.cakeColor.toUpperCase()}</span>
                  </div>
                  <div className="color-picker-item">
                    <label htmlFor="envelopeColor" className="color-label">{t('envelope_color')}</label>
                    <input
                      type="color"
                      id="envelopeColor"
                      name="envelopeColor"
                      value={formData.envelopeColor}
                      onChange={handleInputChange}
                      className="color-input"
                    />
                    <span className="color-value">{formData.envelopeColor.toUpperCase()}</span>
                  </div>
                  <div className="color-picker-item">
                    <label htmlFor="confettiColor" className="color-label">{t('confetti_color')}</label>
                    <input
                      type="color"
                      id="confettiColor"
                      name="confettiColor"
                      value={formData.confettiColor}
                      onChange={handleInputChange}
                      className="color-input"
                    />
                    <span className="color-value">{formData.confettiColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Konfeti Tipi */}
              <div className="form-group">
                <label htmlFor="confettiType" className="form-label">
                  {t('confetti_type_label')} *
                </label>
                <select
                  id="confettiType"
                  name="confettiType"
                  value={formData.confettiType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="heart">{t('confetti_heart')}</option>
                  <option value="star">{t('confetti_star')}</option>
                  <option value="snow">{t('confetti_snow')}</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
                style={{ 
                  opacity: isSubmitting ? 0.7 : 1,
                  backgroundColor: formData.cakeColor,
                  boxShadow: `0 4px 12px ${formData.cakeColor}66`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner" />
                    {t('creating')}
                  </>
                ) : (
                  t('create_card')
                )}
              </button>
            </form>

            {createdLink && (
              <div className="created-link-card">
                <p className="link-label">{t('card_ready')}</p>
                <div className="link-box">
                  <span className="link-text">{createdLink}</span>
                  <button type="button" className="copy-button" onClick={handleCopyLink}>
                    {t('copy_link')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="preview-column">
            <div className="preview-panel">
              <div className="preview-header">
                <div>
                  <p className="preview-sub">{t('live_preview')}</p>
                  <h3 className="preview-title">{t('real_time_view')}</h3>
                </div>
                <div className="preview-badges">
                  <span className="pill">{
                    formData.confettiType === 'heart' ? t('confetti_heart_label') :
                    formData.confettiType === 'star' ? t('confetti_star_label') :
                    t('confetti_snow_label')
                  }</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="preview-info-box">
                <div className="info-item">
                  <span className="info-label">{t('sender_info')}</span>
                  <span className="info-value">{formData.senderName || t('not_specified')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('recipient_info')}</span>
                  <span className="info-value">{formData.recipientName || t('not_specified')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('colors_info')}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: formData.backgroundColor, border: '1px solid rgba(255,255,255,0.3)' }} title={t('background_tooltip')} />
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: formData.cakeColor, border: '1px solid rgba(255,255,255,0.3)' }} title={t('cake_tooltip')} />
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: formData.envelopeColor, border: '1px solid rgba(255,255,255,0.3)' }} title={t('envelope_tooltip')} />
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: formData.confettiColor, border: '1px solid rgba(255,255,255,0.3)' }} title={t('confetti_tooltip')} />
                  </div>
                </div>
              </div>

              {/* Live Preview Stage */}
              <div className="preview-stage" style={{ background: getDynamicBackground(formData.backgroundColor) }}>
                {/* 1. The Cake */}
                <div style={{ pointerEvents: 'none' }} className="preview-item">
                  <Cake
                    volume={0}
                    started={true}
                    onAllBlown={() => {}}
                    themeColor={formData.cakeColor}
                  />
                </div>
                
                {/* 2. The Envelope */}
                <div style={{ pointerEvents: 'none' }} className="preview-item">
                  <Envelope
                    themeColor={formData.envelopeColor}
                  />
                </div>
                
                {/* 3. The Card Book */}
                <div style={{ pointerEvents: 'none' }} className="preview-item">
                  <CardBook
                    message={previewMessages}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
