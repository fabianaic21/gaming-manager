'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

interface Equipo {
  id_equipo: number
  nombre_equipo: string
  sede: string
  puntuacion_total: number
  estado: string
}

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre_equipo: '',
    sede: '',
    puntuacion_total: '',
    estado: 'activo'
  })

  useEffect(() => {
    cargarEquipos()
  }, [])

  const cargarEquipos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('equipos')
      .select('*')
      .order('puntuacion_total', { ascending: false })
    if (data) setEquipos(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('equipos')
      .insert([{
        ...formData,
        puntuacion_total: parseInt(formData.puntuacion_total) || 0
      }])
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Equipo registrado')
      setFormData({ nombre_equipo: '', sede: '', puntuacion_total: '', estado: 'activo' })
      setShowForm(false)
      cargarEquipos()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">🏆 Equipos</h1>
          <p className="text-gray-400">Gestiona equipos de eSports</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Equipo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-4">Registrar Equipo</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre del Equipo *"
              value={formData.nombre_equipo}
              onChange={(e) => setFormData({...formData, nombre_equipo: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <input
              placeholder="Sede"
              value={formData.sede}
              onChange={(e) => setFormData({...formData, sede: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <input
              type="number"
              placeholder="Puntuación Total"
              value={formData.puntuacion_total}
              onChange={(e) => setFormData({...formData, puntuacion_total: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
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
        <div className="text-center text-gray-400 py-12">Cargando equipos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipos.map((e) => (
            <div key={e.id_equipo} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-all">
              <h3 className="text-white font-bold">{e.nombre_equipo}</h3>
              <p className="text-gray-400 text-sm">📍 {e.sede || 'Sin sede'}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-yellow-400 font-bold">⭐ {e.puntuacion_total} pts</span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${e.estado === 'activo' ? 'bg-green-600' : 'bg-red-600'}`}>
                  {e.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}