import * as React from 'react'
import {
  IoCameraOutline,
  IoHeartOutline,
  IoHomeOutline,
  IoShareSocialOutline,
  IoVideocamOutline,
} from 'react-icons/io5'

type MenuItem = {
  title: string
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  href?: string
}

const defaultMenuItems: MenuItem[] = [
  { title: 'Home', icon: <IoHomeOutline />, gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { title: 'Video', icon: <IoVideocamOutline />, gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { title: 'Photo', icon: <IoCameraOutline />, gradientFrom: '#FF9966', gradientTo: '#FF5E62' },
  { title: 'Share', icon: <IoShareSocialOutline />, gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
  { title: 'Tym', icon: <IoHeartOutline />, gradientFrom: '#ffa9c6', gradientTo: '#f434e2' },
]

export default function GradientMenu({ items = defaultMenuItems }: { items?: MenuItem[] }) {
  return (
    <div className="flex items-center justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {items.map(({ title, icon, gradientFrom, gradientTo, href }) => {
          const content = (
            <>
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-0 top-[10px] -z-10 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 blur-[15px] transition-all duration-500 group-hover:opacity-50" />
              <span className="relative z-10 transition-all duration-500 group-hover:scale-0">
                <span className="text-2xl text-stone-500">{icon}</span>
              </span>
              <span className="absolute scale-0 text-sm uppercase tracking-[0.24em] text-white transition-all duration-500 delay-150 group-hover:scale-100">
                {title}
              </span>
            </>
          )

          return (
            <li
              key={title}
              style={
                {
                  '--gradient-from': gradientFrom,
                  '--gradient-to': gradientTo,
                } as React.CSSProperties
              }
              className="group relative h-[58px] w-[58px] cursor-pointer rounded-full bg-white shadow-lg transition-all duration-500 hover:w-[180px] hover:shadow-none"
            >
              {href ? (
                <a
                  href={href}
                  className="flex h-full w-full items-center justify-center rounded-full"
                  aria-label={title}
                >
                  {content}
                </a>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full">
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
