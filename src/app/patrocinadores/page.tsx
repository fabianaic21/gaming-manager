'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function PatrocinadoresPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    rubro: '',
    nivel_patrocinio: '',
    monto_anual: ''
  })

  useEffect(() => {
    cargarItems()
  }, [])

  const cargarItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('patrocinadores')
      .select('*')
      .order('monto_anual', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('patrocinadores')
      .insert([{
        ...formData,
        monto_anual: parseFloat(formData.monto_anual) || 0
      }])
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Patrocinador registrado')
      setFormData({ nombre_empresa: '', rubro: '', nivel_patrocinio: '', monto_anual: '' })
      setShowForm(false)
      cargarItems()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">💰 Patrocinadores</h1>
          <p className="text-gray-400">Gestiona patrocinadores</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Patrocinador'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-4">Registrar Patrocinador</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre Empresa *"
              value={formData.nombre_empresa}
              onChange={(e) => setFormData({...formData, nombre_empresa: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <input
              placeholder="Rubro"
              value={formData.rubro}
              onChange={(e) => setFormData({...formData, rubro: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <select
              value={formData.nivel_patrocinio}
              onChange={(e) => setFormData({...formData, nivel_patrocinio: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">Nivel</option>
              <option value="bronce">Bronce</option>
              <option value="plata">Plata</option>
              <option value="oro">Oro</option>
              <option value="platino">Platino</option>
            </select>
            <input
              type="number"
              placeholder="Monto Anual ($)"
              value={formData.monto_anual}
              onChange={(e) => setFormData({...formData, monto_anual: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
        <div className="text-center text-gray-400 py-12">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id_patrocinador} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-all">
              <h3 className="text-white font-bold">{item.nombre_empresa}</h3>
              <p className="text-gray-400 text-sm">{item.rubro}</p>
              <div className="mt-2 text-xs text-gray-400">
                <p>🏅 {item.nivel_patrocinio}</p>
                <p>💰 ${item.monto_anual}/año</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}