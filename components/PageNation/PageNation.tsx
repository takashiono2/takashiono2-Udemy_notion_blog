import Link from 'next/link'
import React from 'react'

function PageNation() {
  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex items-center justity-center gap-4">
        <li className="bg-sky-900 rounded-lg w-6 h-8 relative">
          <Link href="/posts/page/1" className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100">1</Link>
        </li>
        <li className="bg-sky-900 rounded-lg w-6 h-8 relative">
          <Link href="/posts/page/2" className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100">2</Link>
        </li>
        <li className="bg-sky-900 rounded-lg w-6 h-8 relative">
          <Link href="/posts/page/3" className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100">3</Link>
        </li>
      </ul>
    </section>
  )
}

export default PageNation
