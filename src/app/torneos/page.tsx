'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function TorneosPage() {
  const [torneos, setTorneos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    juego: '',
    fecha_inicio: '',
    fecha_fin: '',
    premio_total: '',
    estado: 'proximo'
  })

  useEffect(() => {
    cargarTorneos()
  }, [])

  const cargarTorneos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('torneos')
      .select('*')
      .order('fecha_inicio', { ascending: false })
    if (data) setTorneos(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('torneos')
      .insert([{
        ...formData,
        premio_total: parseFloat(formData.premio_total) || 0
      }])
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Torneo registrado')
      setFormData({ nombre: '', juego: '', fecha_inicio: '', fecha_fin: '', premio_total: '', estado: 'proximo' })
      setShowForm(false)
      cargarTorneos()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">🏅 Torneos</h1>
          <p className="text-gray-400">Gestiona torneos de eSports</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Torneo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-4">Registrar Torneo</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre del Torneo *"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <input
              placeholder="Juego"
              value={formData.juego}
              onChange={(e) => setFormData({...formData, juego: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <input
              type="date"
              placeholder="Fecha Inicio"
              value={formData.fecha_inicio}
              onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            />
            <input
              type="date"
              placeholder="Fecha Fin"
              value={formData.fecha_fin}
              onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Premio Total ($)"
              value={formData.premio_total}
              onChange={(e) => setFormData({...formData, premio_total: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="proximo">Próximo</option>
              <option value="activo">Activo</option>
              <option value="finalizado">Finalizado</option>
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
        <div className="text-center text-gray-400 py-12">Cargando torneos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {torneos.map((t) => (
            <div key={t.id_torneo} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-all">
              <h3 className="text-white font-bold">{t.nombre}</h3>
              <p className="text-gray-400 text-sm">🎮 {t.juego || 'Sin juego'}</p>
              <div className="mt-2 text-xs text-gray-400">
                <p>📅 {t.fecha_inicio} → {t.fecha_fin}</p>
                <p>💰 ${t.premio_total || 0}</p>
              </div>
              <span className={`mt-2 inline-block px-2 py-1 rounded-full text-xs text-white 
                ${t.estado === 'activo' ? 'bg-green-600' : t.estado === 'finalizado' ? 'bg-gray-600' : 'bg-blue-600'}`}>
                {t.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}