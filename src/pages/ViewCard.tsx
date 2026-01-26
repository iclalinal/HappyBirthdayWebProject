import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cake from '../components/Cake'
import Envelope from '../components/Envelope'
import HeartConfetti from '../components/HeartConfetti'
import StarConfetti from '../components/StarConfetti'
import SnowConfetti from '../components/SnowConfetti'
import { getCard, type CardData } from '../services/cardService'
import { useMicrophone } from '../hooks/useMicrophone'
import '../styles.css'

const themeBackgrounds: Record<CardData['theme'], string> = {
  ocean: 'radial-gradient(circle at 20% 20%, rgba(86, 170, 255, 0.15), transparent 35%), radial-gradient(circle at 80% 10%, rgba(64, 193, 255, 0.18), transparent 30%), linear-gradient(135deg, #0b152e 0%, #0d1f3a 40%, #07101f 100%)',
  sunset: 'radial-gradient(circle at 20% 20%, rgba(255, 190, 92, 0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255, 116, 92, 0.16), transparent 30%), linear-gradient(135deg, #1a0f1f 0%, #2b1230 40%, #381722 100%)',
  lavender: 'radial-gradient(circle at 20% 20%, rgba(173, 149, 255, 0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(125, 94, 255, 0.16), transparent 30%), linear-gradient(135deg, #130f1c 0%, #1c1327 40%, #23142b 100%)',
}

const themeColors: Record<CardData['theme'], string> = {
  ocean: '#2b84ea',
  sunset: '#f48c06',
  lavender: '#9d4edd',
}

const ConfettiLayer = ({ type, themeColor }: { type: CardData['confettiType']; themeColor: string }) => {
  if (type === 'heart') return <HeartConfetti themeColor={themeColor} />
  if (type === 'star') return <StarConfetti themeColor={themeColor} />
  if (type === 'snow') return <SnowConfetti themeColor={themeColor} />
  return null
}

export default function ViewCard() {
  const { id } = useParams<{ id: string }>()
  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const [showCake, setShowCake] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showEnvelope, setShowEnvelope] = useState(false)
  const { volume, start, stop } = useMicrophone()

  useEffect(() => {
    let mounted = true

    const fetchCard = async () => {
      if (!id) {
        setError('Kart bulunamadı')
        setLoading(false)
        return
      }

      try {
        const data = await getCard(id)
        if (!mounted) return

        if (!data) {
          setError('Kart bulunamadı')
        } else {
          setCard(data)
        }
      } catch (err) {
        console.error('Kart çekilirken hata oluştu:', err)
        if (mounted) setError('Kart bulunamadı')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCard()

    return () => {
      mounted = false
    }
  }, [id])

  const containerStyle = card ? { background: themeBackgrounds[card.theme] } : undefined
  const messages = card?.message ? card.message.split('\n').filter(Boolean) : []
  const signedMessages = card ? [...messages, `- ${card.senderName}`] : messages
  const themeClass = card ? `theme-${card.theme}` : 'theme-ocean'
  const themeColor = card ? themeColors[card.theme] : themeColors.ocean

  if (loading) {
    return (
      <div className={`app view-card ${themeClass}`} style={{ background: themeBackgrounds.ocean }}>
        <div className="center-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`app view-card ${themeClass}`} style={{ background: themeBackgrounds.ocean }}>
        <div className="center-state error-state">{error}</div>
      </div>
    )
  }

  if (!card) {
    return null
  }

  return (
    <div className={`app view-card ${themeClass}`} style={containerStyle}>
      {card && showOverlay && (
        <div
          className="overlay"
          onClick={() => {
            setShowOverlay(false)
            setShowCake(true)
            start()
          }}
        >
          <div className="overlay-content">✨ {card.recipientName}, bir dilek tut</div>
        </div>
      )}

      {card && showConfetti && <ConfettiLayer type={card.confettiType} themeColor={themeColor} />}

      <div className="view-card-stage">
        {showCake && (
          <Cake
            volume={volume}
            started={showCake}
            onAllBlown={() => {
              stop()
              setShowConfetti(true)
              setTimeout(() => setShowEnvelope(true), 3000)
            }}
            themeColor={themeColor}
          />
        )}

        {showEnvelope && (
          <Envelope
            themeColor={themeColor}
            message={signedMessages.length ? signedMessages : [card.message, `- ${card.senderName}`]}
          />
        )}
      </div>
    </div>
  )
}
