import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return {
    title: id === 'demo' ? 'مثال اتفاق | اتفقنا' : 'بطاقة اتفاق | اتفقنا',
    description: 'راجع تفاصيل الاتفاق وأكّده بسهولة.',
  }
}

export default function AgreementLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
