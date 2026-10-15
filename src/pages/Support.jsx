// US-13 Chat de soporte con una conversación por pedido.
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOrder, getOrdersByUser } from '../services/orders'
import { addReply, GENERAL, getConversation, hoursText, isOpen, replyFor, sendMessage } from '../services/chat'

export default function Support() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const orders = getOrdersByUser(user.id)
  const requested = params.get('pedido')
  const topic = orders.some((o) => o.number === requested) ? requested : GENERAL
  const [messages, setMessages] = useState(() => getConversation(user.id, topic))
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState('')
  const end = useRef(null)
  const currentTopic = useRef(topic)
  currentTopic.current = topic
  const open = isOpen()

  useEffect(() => setMessages(getConversation(user.id, topic)), [user.id, topic])
  useEffect(() => end.current?.scrollIntoView({ block: 'nearest' }), [messages, typing])

  const submit = (e) => {
    e.preventDefault()
    try {
      setMessages(sendMessage(user.id, topic, text))
      const question = text
      setText('')
      setError('')
      setTyping(true)
      setTimeout(() => {
        const order = topic === GENERAL ? null : getOrder(topic)
        const updated = addReply(user.id, topic, replyFor(question, { order }))
        if (currentTopic.current === topic) setMessages(updated)
        setTyping(false)
      }, 1200)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="container">
      <h1>Soporte</h1>
      <p className={open ? 'chat-status open' : 'chat-status'}>
        {open ? 'Asesores en línea' : 'Fuera de horario'} · Atención {hoursText}
      </p>
      <div className="chat-layout">
        <nav className="chat-topics" aria-label="Conversaciones">
          <button className={topic === GENERAL ? 'active' : ''} onClick={() => setParams({})}>Consulta general</button>
          {orders.map((o) => (
            <button key={o.number} className={topic === o.number ? 'active' : ''} onClick={() => setParams({ pedido: o.number })}>
              Pedido {o.number}
            </button>
          ))}
        </nav>
        <div className="chat">
          <div className="chat-head">
            {topic === GENERAL ? 'Consulta general' : `Conversación sobre el pedido ${topic}`}
          </div>
          <ol className="chat-messages" aria-live="polite">
            {messages.length === 0 && (
              <li className="chat-empty muted small">
                Escríbenos tu duda. {topic !== GENERAL && 'Esta conversación queda ligada al pedido.'}
              </li>
            )}
            {messages.map((m, i) => (
              <li key={i} className={`bubble ${m.from}`}>
                <span>{m.text}</span>
                <time className="small">
                  {new Date(m.date).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                </time>
              </li>
            ))}
            {typing && <li className="bubble soporte typing">Escribiendo…</li>}
            <li ref={end} aria-hidden="true" />
          </ol>
          <form className="chat-input" onSubmit={submit}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu mensaje…"
              aria-label="Mensaje" maxLength={500} />
            <button className="btn" disabled={!text.trim() || typing}>Enviar</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </section>
  )
}
