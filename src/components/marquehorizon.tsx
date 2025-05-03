import { cn } from '@/lib/utils';
import { Marquee } from './magicui/marquee';
import Image from 'next/image';
const reviews = [
  {
    name: 'Garfield',
    username: 'Molly 1.0',
    bg: 'bg-[#FFF2BCFF]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/QmcKJ24X74eh2NK1FYMsRtMwWiYRBsKe1u22irpTWpuW8J',
  },
  {
    name: 'Gary Baseman',
    username: 'Molly 1.0',
    bg: 'bg-[#FFC0C5]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/QmeLVDx3JfUXJny1bcBHRP2fNKjrcEARVQ6cVuNVueJPW6',
  },
  {
    name: 'Tetris',
    username: 'Molly 1.0',
    bg: 'bg-[#FFFCCE]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/QmYKQFUUaoJkLx6BgxHE8rPg8vVbvT5x476zhd5HbShGna',
  },
  {
    name: 'Peach',
    username: 'Molly 2.0',
    bg: 'bg-[#FFCBC5]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/QmVdarvKpbq5HtjdTdawdJ1TkU96Lhzr7ftfe2tp7egkF4',
  },
  {
    name: 'Ted 2',
    username: 'Molly 2.0',
    bg: 'bg-[#FFE5B9]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/QmcnAcJdUER5cn5szGuvB4yKvfeJJDDxH239Bjn5RQCxS8',
  },
  {
    name: 'Stitch',
    username: 'Molly 2.0',
    bg: 'bg-[#BCE3FF]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/bafkreihnvmwi7ujp4hwz2agduofr247ldgvgmga7hggn5br7rlcqv7rwty',
  },
  {
    name: 'UK Labu',
    username: 'Labubu',
    bg: 'bg-[#D46879]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/bafkreifnwzl2bd5gusckgrbjjv4frxh35cdvizmsrnbakkzebglnqktp7q',
  },
  {
    name: 'Inking Yellow',
    username: 'Splatoon',
    bg: 'bg-[#E9EA84]',
    img: 'https://green-elderly-sheep-310.mypinata.cloud/ipfs/bafkreig6pkxg4j7htoysdaiflqjpk7mwjwfu4sbqsb2a5kjuqey6rkfbme',
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  bg,
}: {
  img: string;
  name: string;
  username: string;
  bg: string;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-3',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className={`rounded-[12px] w-24 h-full ${bg}`}
          width={50}
          height={50}
          alt=""
          src={img}
          priority
        />
        <div className="flex flex-col">
          <figcaption className="font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
