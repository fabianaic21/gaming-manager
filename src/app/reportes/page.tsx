'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function ReportesPage() {
  const [loading, setLoading] = useState(true)
  const [reporte1, setReporte1] = useState<any[]>([])
  const [reporte2, setReporte2] = useState<any[]>([])
  const [reporte3, setReporte3] = useState<any[]>([])

  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    setLoading(true)
    
    try {
      // REPORTE 1: Ranking de equipos
      const { data: data1 } = await supabase
        .from('equipos')
        .select('nombre_equipo, puntuacion_total')
        .order('puntuacion_total', { ascending: false })
        .limit(10)
      if (data1) setReporte1(data1)

      // REPORTE 2: Jugadores por nivel
      const { data: data2 } = await supabase
        .from('jugadores')
        .select('nivel')
      if (data2) {
        const niveles: any = {}
        data2.forEach((j: any) => {
          niveles[j.nivel] = (niveles[j.nivel] || 0) + 1
        })
        setReporte2(Object.entries(niveles).map(([name, value]) => ({ name, value })))
      }

      // REPORTE 3: Periféricos por tipo
      const { data: data3 } = await supabase
        .from('perifericos')
        .select('tipo, stock')
      if (data3) {
        const tipos: any = {}
        data3.forEach((p: any) => {
          tipos[p.tipo] = (tipos[p.tipo] || 0) + p.stock
        })
        setReporte3(Object.entries(tipos).map(([name, value]) => ({ name, value })))
      }

    } catch (error) {
      console.error('Error cargando reportes:', error)
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Cargando reportes...
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">📊 Reportes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reporte 1: Ranking de Equipos */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🏆 Ranking de Equipos</h2>
          {reporte1.length === 0 ? (
            <p className="text-gray-400">No hay equipos registrados</p>
          ) : (
            <div className="space-y-2">
              {reporte1.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700/30 p-3 rounded">
                  <span className="text-white">
                    {index + 1}. {item.nombre_equipo}
                  </span>
                  <span className="text-yellow-400 font-bold">{item.puntuacion_total} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reporte 2: Jugadores por Nivel */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">👾 Jugadores por Nivel</h2>
          {reporte2.length === 0 ? (
            <p className="text-gray-400">No hay jugadores registrados</p>
          ) : (
            <div className="space-y-2">
              {reporte2.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700/30 p-3 rounded">
                  <span className="text-white capitalize">{item.name}</span>
                  <span className="text-blue-400 font-bold">{item.value} jugadores</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reporte 3: Stock de Periféricos por Tipo */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">🖥️ Stock de Periféricos por Tipo</h2>
          {reporte3.length === 0 ? (
            <p className="text-gray-400">No hay periféricos registrados</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {reporte3.map((item, index) => (
                <div key={index} className="bg-gray-700/30 p-4 rounded text-center">
                  <p className="text-gray-400 text-sm capitalize">{item.name}</p>
                  <p className="text-green-400 font-bold text-xl">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}