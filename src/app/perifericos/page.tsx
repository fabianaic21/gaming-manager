'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function PerifericosPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    tipo: '',
    precio: '',
    stock: '',
    rgb: false,
    wireless: false
  })

  useEffect(() => {
    cargarItems()
  }, [])

  const cargarItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('perifericos')
      .select('*')
      .order('fecha_registro', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('perifericos')
      .insert([{
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        stock: parseInt(formData.stock) || 0
      }])
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Periférico registrado')
      setFormData({ nombre: '', marca: '', tipo: '', precio: '', stock: '', rgb: false, wireless: false })
      setShowForm(false)
      cargarItems()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">🖥️ Periféricos</h1>
          <p className="text-gray-400">Gestiona periféricos gaming</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Periférico'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-4">Registrar Periférico</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <input
              placeholder="Marca *"
              value={formData.marca}
              onChange={(e) => setFormData({...formData, marca: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
              required
            />
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">Selecciona tipo</option>
              <option value="teclado">Teclado</option>
              <option value="mouse">Mouse</option>
              <option value="monitor">Monitor</option>
              <option value="auriculares">Auriculares</option>
              <option value="silla">Silla</option>
            </select>
            <input
              type="number"
              placeholder="Precio ($)"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white placeholder:text-gray-400"
            />
            <div className="flex gap-4 items-center">
              <label className="text-white">
                <input
                  type="checkbox"
                  checked={formData.rgb}
                  onChange={(e) => setFormData({...formData, rgb: e.target.checked})}
                  className="mr-2"
                />
                RGB
              </label>
              <label className="text-white">
                <input
                  type="checkbox"
                  checked={formData.wireless}
                  onChange={(e) => setFormData({...formData, wireless: e.target.checked})}
                  className="mr-2"
                />
                Wireless
              </label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
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
            <div key={item.id_periferico} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-pink-500 transition-all">
              <h3 className="text-white font-bold">{item.nombre}</h3>
              <p className="text-gray-400 text-sm">{item.marca} - {item.tipo}</p>
              <div className="mt-2 text-xs text-gray-400">
                <p>💰 ${item.precio}</p>
                <p>📦 Stock: {item.stock}</p>
                <p>{item.rgb ? '🌈 RGB' : ''} {item.wireless ? '📶 Wireless' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}