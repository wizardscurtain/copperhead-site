import { TrendingUp, Users, Award, Clock } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: "152%",
    label: "Year Over Year Growth",
    description: "Continued expansion and client satisfaction"
  },
  {
    icon: Users,
    value: "15+",
    label: "Trusted Vendor Partners",
    description: "Network of specialized security professionals"
  },
  {
    icon: Award,
    value: "50+",
    label: "Trained Security Agents",
    description: "Elite professionals with superior training"
  },
  {
    icon: Clock,
    value: "20+",
    label: "Years of Experience",
    description: "Decades of proven security expertise"
  }
]

export function StatsBar() {
  return (
    <section className="stats-bar bg-slate-900 py-12 border-y border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <IconComponent className="w-8 h-8 text-accent" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-accent font-medium text-sm md:text-base mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-xs md:text-sm">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}