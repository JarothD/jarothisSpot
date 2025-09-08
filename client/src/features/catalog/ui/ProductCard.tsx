import { ProductDTO } from '@shared/types/catalog'
import { buildImage } from '@shared/utils/image'

export function ProductCard({ p }: { readonly p: ProductDTO }) {
  const imgUrl = buildImage(p.imageUrl, 400, 600)
  return (
    <div className="rounded-2xl shadow p-3 bg-white dark:bg-neutral-900">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-xl mb-3 bg-neutral-100 dark:bg-neutral-800">
        <img
          src={imgUrl}
          alt={p.title}
          width={400}
          height={600}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder-book.png'}}
        />
      </div>
      <h3 className="font-semibold line-clamp-2">{p.title}</h3>
      <p className="text-sm text-neutral-500 line-clamp-2">{p.description}</p>
      <div className="flex flex-wrap gap-2 my-2">
        {p.categories?.map(c=>(
          <span key={c.id} className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: c.colorHex }}>{c.name}</span>
        ))}
      </div>
      <div className="mt-2 font-semibold">${p.price.toFixed(2)}</div>
    </div>
  )
}
