import { useMemo, useState } from 'react';
import { createCard } from '../services/cardService';
import '../styles/create-card.css';

interface FormData {
  senderName: string;
  recipientName: string;
  email: string;
  message: string;
  theme: 'ocean' | 'sunset' | 'lavender';
  confettiType: 'heart' | 'star' | 'snow';
}

const themeColors: Record<FormData['theme'], string> = {
  ocean: '#2b84ea',
  sunset: '#f48c06',
  lavender: '#9d4edd',
};

const confettiLabels: Record<FormData['confettiType'], string> = {
  heart: 'Kalp Konfeti',
  star: 'Yıldız Konfeti',
  snow: 'Kar Konfeti',
};

export default function CreateCard() {
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    recipientName: '',
    email: '',
    message: '',
    theme: 'ocean',
    confettiType: 'heart',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const themeColor = themeColors[formData.theme];

  const previewMessages = useMemo(() => {
    const base = formData.message.trim()
      ? formData.message.split('\n').filter(Boolean)
      : ['Örnek mesaj satırı', 'İkinci satır burada'];
    const withSignature = formData.senderName.trim()
      ? [...base, `- ${formData.senderName}`]
      : base;
    return withSignature;
  }, [formData.message, formData.senderName]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.senderName.trim()) newErrors.senderName = 'Gönderen adı gereklidir';
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Alıcı adı gereklidir';
    if (!formData.email.trim()) newErrors.email = 'E-posta adresi gereklidir';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Geçerli bir e-posta adresi girin';
    if (!formData.message.trim()) newErrors.message = 'Mesaj gereklidir';

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
      theme: formData.theme,
      confettiType: formData.confettiType,
      email: formData.email.trim(),
    };

    try {
      const id = await createCard(payload);
      const base = import.meta.env.BASE_URL || '/';
      const normalizedBase = base.endsWith('/') ? base : `${base}/`;
      const link = `${window.location.origin}${normalizedBase}card/${id}`;
      setCreatedLink(link);
      setCopyFeedback(null);
      console.log('Kart oluşturuldu:', { id, ...payload });

      setFormData({
        senderName: '',
        recipientName: '',
        email: '',
        message: '',
        theme: 'ocean',
        confettiType: 'heart',
      });
      setErrors({});
    } catch (error) {
      console.error('Kart oluşturulurken hata oluştu:', error);
      alert('Kart oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!createdLink) return;
    try {
      await navigator.clipboard.writeText(createdLink);
      setCopyFeedback('Link panoya kopyalandı!');
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch (error) {
      console.error('Link kopyalanamadı:', error);
      alert('Link kopyalanamadı, lütfen manuel kopyalayın.');
    }
  };

  return (
    <div className="create-card-container">
      <div className="create-card-card">
        <div className="create-card-header">
          <div>
            <h1 className="create-card-title">Doğum Günü Kartı Oluştur</h1>
            <p className="create-card-subtitle">Sevdiğin birinin doğum gününü kutlamanın zamanı!</p>
          </div>
        </div>

        <div className="create-card-grid">
          <div className="form-column">
            <form onSubmit={handleSubmit} className="create-card-form">
              {/* Gönderen Adı */}
              <div className="form-group">
                <label htmlFor="senderName" className="form-label">
                  Gönderen Adı *
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.senderName ? 'input-error' : ''}`}
                  placeholder="Adınız"
                  required
                />
                {errors.senderName && <span className="error-text">{errors.senderName}</span>}
              </div>

              {/* Alıcı Adı */}
              <div className="form-group">
                <label htmlFor="recipientName" className="form-label">
                  Alıcı Adı *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.recipientName ? 'input-error' : ''}`}
                  placeholder="Kutlanacak kişinin adı"
                  required
                />
                {errors.recipientName && <span className="error-text">{errors.recipientName}</span>}
              </div>

              {/* E-posta */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-posta Adresi *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="ornek@email.com"
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Mesaj */}
              <div className="form-group">
                <div className="label-with-counter">
                  <label htmlFor="message" className="form-label">
                    Mesaj *
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
                  placeholder="Doğum günü mesajınızı yazın..."
                  rows={4}
                  maxLength={500}
                  required
                />
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              {/* Tema Seçimi */}
              <div className="form-group">
                <label htmlFor="theme" className="form-label">
                  Tema Seçimi *
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="ocean">Okyanus (Mavi)</option>
                  <option value="sunset">Gün Batımı (Turuncu)</option>
                  <option value="lavender">Lavanta (Mor)</option>
                </select>
              </div>

              {/* Konfeti Tipi */}
              <div className="form-group">
                <label htmlFor="confettiType" className="form-label">
                  Konfeti Tipi *
                </label>
                <select
                  id="confettiType"
                  name="confettiType"
                  value={formData.confettiType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="heart">Kalp</option>
                  <option value="star">Yıldız</option>
                  <option value="snow">Kar</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner" />
                    Oluşturuluyor...
                  </>
                ) : (
                  'Kartı Oluştur'
                )}
              </button>
            </form>

            {createdLink && (
              <div className="created-link-card">
                <p className="link-label">Kartın hazır! Aşağıdaki linki paylaşabilirsin:</p>
                <div className="link-box">
                  <span className="link-text">{createdLink}</span>
                  <button type="button" className="copy-button" onClick={handleCopyLink}>
                    Kopyala
                  </button>
                </div>
                {copyFeedback && <span className="copy-feedback">{copyFeedback}</span>}
              </div>
            )}
          </div>

          <div className="preview-column">
            <div className="preview-panel">
              <div className="preview-header">
                <div>
                  <p className="preview-sub">Kart Önizlemesi</p>
                  <h3 className="preview-title">Canlı görünüm</h3>
                </div>
                <div className="preview-badges">
                  <span className="pill">{confettiLabels[formData.confettiType]}</span>
                  <span className="pill">{formData.theme.toUpperCase()}</span>
                </div>
              </div>

              <div
                className="preview-card"
                style={{
                  borderColor: themeColor,
                  boxShadow: `0 14px 40px ${themeColor}40`,
                  background: `linear-gradient(135deg, ${themeColor}1f, rgba(255,255,255,0.02))`,
                }}
              >
                <div className="preview-hero" style={{ color: themeColor }}>
                  <div className="preview-icon" aria-hidden>
                    {formData.confettiType === 'heart' && '💖'}
                    {formData.confettiType === 'star' && '✨'}
                    {formData.confettiType === 'snow' && '❄️'}
                  </div>
                  <div className="preview-names">
                    <span className="label">Gönderen</span>
                    <strong>{formData.senderName || 'Gönderen'}</strong>
                    <span className="label">Alıcı</span>
                    <strong>{formData.recipientName || 'Alıcı'}</strong>
                  </div>
                </div>

                <div className="preview-message">
                  {previewMessages.map((line, idx) => (
                    <div key={idx} className="preview-line">
                      {line}
                    </div>
                  ))}
                </div>

                <div className="preview-footer" style={{ color: themeColor }}>
                  {formData.theme === 'ocean' && 'Deniz esintili bir kutlama'}
                  {formData.theme === 'sunset' && 'Gün batımında sıcak bir kutlama'}
                  {formData.theme === 'lavender' && 'Lavanta tonlarında huzurlu kutlama'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
