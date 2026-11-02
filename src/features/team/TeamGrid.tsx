import Image from 'next/image';
import type { Person } from '@/types/content';
export function TeamGrid({ people }: { people: Person[] }) {
  return (
    <div className="team-grid">
      {people.map((person, i) => (
        <article className="person" key={person.id}>
          <div className="person-image">
            <Image
              src={person.imageUrl || `/images/team/person-${(i % 6) + 1}.webp`}
              alt={`Animated character representing ${person.name}`}
              width={480}
              height={480}
              sizes="(max-width: 550px) 90vw, (max-width: 900px) 45vw, 29vw"
            />
          </div>
          <h2>{person.name}</h2>
          <p>{person.role}</p>
        </article>
      ))}
    </div>
  );
}
