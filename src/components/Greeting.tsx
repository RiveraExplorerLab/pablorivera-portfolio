type GreetingProps = { name: string; tagline?: string }

export default function Greeting({ name, tagline }: GreetingProps) {
    return (
        <div>
            <h1 className="text-4xl font-bold text-rose-400">
                Hi, I'm {name}
                {tagline && <p className="text-neutral-600">{tagline}</p>}
            </h1>
        </div>
    )
}