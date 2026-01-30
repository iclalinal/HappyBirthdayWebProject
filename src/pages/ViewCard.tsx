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

// Generate dynamic background based on hex color
const getDynamicBackground = (hexColor: string): string => {
  // Convert hex to rgb for opacity control
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return `radial-gradient(circle at 20% 20%, rgba(${r}, ${g}, ${b}, 0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(${r}, ${g}, ${b}, 0.16), transparent 30%), linear-gradient(135deg, #0b152e 0%, #0d1f3a 40%, #07101f 100%)`
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

  // Use dynamic colors from card data
  const backgroundColor = card?.backgroundColor || '#1e3a5f'
  const cakeColor = card?.cakeColor || '#4a90e2'
  const envelopeColor = card?.envelopeColor || '#2c5aa0'
  const confettiColor = card?.confettiColor || '#87ceeb'
  
  const containerStyle = { background: getDynamicBackground(backgroundColor) }
  const messages = card?.message ? card.message.split('\n').filter(Boolean) : []
  const signedMessages = card ? [...messages, `- ${card.senderName}`] : messages

  if (loading) {
    return (
      <div className="app view-card" style={{ background: getDynamicBackground('#1e3a5f') }}>
        <div className="center-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app view-card" style={{ background: getDynamicBackground('#1e3a5f') }}>
        <div className="center-state error-state">{error}</div>
      </div>
    )
  }

  if (!card) {
    return null
  }

  return (
    <div className="app view-card" style={containerStyle}>
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

      {card && showConfetti && <ConfettiLayer type={card.confettiType} themeColor={confettiColor} />}

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
            themeColor={cakeColor}
          />
        )}

        {showEnvelope && (
          <Envelope
            themeColor={envelopeColor}
            message={signedMessages.length ? signedMessages : [card.message, `- ${card.senderName}`]}
          />
        )}
      </div>
    </div>
  )
}
