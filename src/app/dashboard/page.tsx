import { supabase } from '@/utils/supabase'

async function getStats() {
  const [jugadores, equipos, torneos, perifericos] = await Promise.all([
    supabase.from('jugadores').select('*', { count: 'exact', head: true }),
    supabase.from('equipos').select('*', { count: 'exact', head: true }),
    supabase.from('torneos').select('*', { count: 'exact', head: true }),
    supabase.from('perifericos').select('*', { count: 'exact', head: true }),
  ])
  
  return {
    jugadores: jugadores.count || 0,
    equipos: equipos.count || 0,
    torneos: torneos.count || 0,
    perifericos: perifericos.count || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()
  
  const cards = [
    { title: 'Jugadores', value: stats.jugadores, color: 'from-purple-500 to-blue-500' },
    { title: 'Equipos', value: stats.equipos, color: 'from-yellow-500 to-orange-500' },
    { title: 'Torneos', value: stats.torneos, color: 'from-green-500 to-emerald-500' },
    { title: 'Periféricos', value: stats.perifericos, color: 'from-pink-500 to-rose-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">🎮 Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm">{card.title}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}