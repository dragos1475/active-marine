import { Reveal } from "./Reveal";

export function MaritimeImage({ src, alt }: { src: string; alt: string }) {
  return <div className="mx-auto max-w-7xl px-6">
    <Reveal className="overflow-hidden border-y border-border">
      <img src={src} alt={alt} loading="lazy" width={1536} height={1024} className="h-48 w-full object-cover sm:h-64" />
    </Reveal>
  </div>;
}