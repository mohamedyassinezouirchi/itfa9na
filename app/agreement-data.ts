export interface AgreementData {
  id?: string
  title: string
  client_name: string
  deliverables: string[]
  price: string
  deadline: string
  revisions_count: string
  out_of_scope: string[]
  status?: 'pending' | 'confirmed'
  confirmed_at?: string
}

export const sampleAgreement: AgreementData = {
  id: 'demo',
  title: 'تصميم هوية بصرية',
  client_name: 'سارة أحمد',
  deliverables: ['شعار رئيسي ونسخ للاستخدامات المختلفة', 'دليل هوية بصرية مختصر', 'ملفات جاهزة للطباعة والاستخدام الرقمي'],
  price: '٢٬٥٠٠ ر.س',
  deadline: '٢٥ أكتوبر ٢٠٢٦',
  revisions_count: 'جولتان من التعديلات',
  out_of_scope: ['كتابة المحتوى', 'إدارة حسابات التواصل الاجتماعي'],
  status: 'pending',
}

export function parseAgreement(text: string): AgreementData {
  return { ...sampleAgreement, id: crypto.randomUUID(), title: text.trim() ? 'اتفاق عمل جديد' : sampleAgreement.title, status: 'pending' }
}
