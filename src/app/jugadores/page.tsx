'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

interface Jugador {
  id_jugador: number
  gamertag: string
  nombre_real: string
  edad: number
  pais: string
  juego_principal: string
  nivel: string
  horas_jugadas: number
}

export default function JugadoresPage() {
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    gamertag: '',
    nombre_real: '',
    edad: '',
    pais: '',
    juego_principal: '',
    nivel: 'bronce'
  })

  useEffect(() => {
    cargarJugadores()
  }, [])

  const cargarJugadores = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jugadores')
      .select('*')
      .order('fecha_registro', { ascending: false })
    if (data) setJugadores(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('jugadores')
      .insert([{
        ...formData,
        edad: parseInt(formData.edad) || null,
        horas_jugadas: 0
      }])
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Jugador registrado')
      setFormData({ gamertag: '', nombre_real: '', edad: '', pais: '', juego_principal: '', nivel: 'bronce' })
      setShowForm(false)
      cargarJugadores()
    }
  }

  const getNivelColor = (nivel: string) => {
    const colores: any = {
      bronce: 'bg-orange-700',
      plata: 'bg-gray-400',
      oro: 'bg-yellow-500',
      platino: 'bg-cyan-500',
      diamante: 'bg-blue-500',
      inmortal: 'bg-purple-600'
    }
    return colores[nivel] || 'bg-gray-500'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">🎮 Jugadores</h1>
          <p className="text-gray-400">Gestiona jugadores profesionales</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Jugador'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-4">Registrar Jugador</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Gamertag *"
              value={formData.gamertag}
              onChange={(e) => setFormData({...formData, gamertag: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <input
              placeholder="Nombre Real *"
              value={formData.nombre_real}
              onChange={(e) => setFormData({...formData, nombre_real: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <input
              type="number"
              placeholder="Edad"
              value={formData.edad}
              onChange={(e) => setFormData({...formData, edad: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <input
              placeholder="País"
              value={formData.pais}
              onChange={(e) => setFormData({...formData, pais: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <input
              placeholder="Juego Principal"
              value={formData.juego_principal}
              onChange={(e) => setFormData({...formData, juego_principal: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <select
              value={formData.nivel}
              onChange={(e) => setFormData({...formData, nivel: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="bronce">Bronce</option>
              <option value="plata">Plata</option>
              <option value="oro">Oro</option>
              <option value="platino">Platino</option>
              <option value="diamante">Diamante</option>
              <option value="inmortal">Inmortal</option>
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Registrar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12">Cargando jugadores...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jugadores.map((j) => (
            <div key={j.id_jugador} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold">{j.gamertag}</h3>
                  <p className="text-gray-400 text-sm">{j.nombre_real}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getNivelColor(j.nivel)}`}>
                  {j.nivel}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <p>🎮 {j.juego_principal || 'Sin juego'}</p>
                <p>📍 {j.pais || 'Sin país'}</p>
                <p>⏱️ {j.horas_jugadas}h jugadas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}