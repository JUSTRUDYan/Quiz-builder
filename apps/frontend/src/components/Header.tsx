import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b bg-white text-2xl">
      <div className="max-w py-3 flex items-center justify-between bg-gray-100 px-10">
        <Link href="/" className="font-semibold">Quizzes</Link>
        <Link href="/create">Create</Link>
      </div>
    </header>
  );
}
