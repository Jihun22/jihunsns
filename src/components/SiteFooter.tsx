import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} JihunSNS. 함께 만들어가는 작은 SNS</p>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/Jihun22/jihunsns" className="hover:text-blue-600" target="_blank">
            GitHub
          </Link>
          <Link href="/protected" className="hover:text-blue-600">
            대시보드
          </Link>
        </div>
      </div>
    </footer>
  );
}
