export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  bannerImage: string
  category: string
  publishedAt: string
  isActive: boolean
  isPinnedNews: boolean
  isPinnedHome: boolean
}

export const demoNews: NewsItem[] = [
  {
    id: '1001',
    title: 'Шинэ байраас зээл олгох үйлчилгээ эхлүүллээ',
    excerpt: 'Улаанбаатар хотын Энхтайваны өргөнгөнцөгт байрлах шинэ салбар нь зээлийн үйлчилгээг эхлүүлээд байгаа болно.',
    content: 'Бид та бүхний эдийн засгийн сайхан ирээдүйг дэмжихийн тулд Энхтайваны өргөнгөнцөгт байрлах шинэ салбарыг нээлээ. Энэ салбарт та зээлийн бүх төрлийн үйлчилгээг авах боломжтой болно.',
    bannerImage: '/images/news1.jpg',
    category: 'announcement',
    publishedAt: '2025-12-17',
    isActive: true,
    isPinnedNews: true,
    isPinnedHome: true,
  },
  {
    id: '1002',
    title: 'Системийн техникийн засвал хийгдэнэ',
    excerpt: 'Өнгөрөх сарын 20-ноос 21-ны хооронд онлайн системийн техникийн засвал хийгдэх болно.',
    content: 'Бидний онлайн платформын үйлчилгээ сайжруулах үүднээс техникийн засвал хийгдэх болно. Энэ хугацаанд систем ашиглахад саад тотоохыг өмнөө анхааруулж байна.',
    bannerImage: '/images/news2.jpg',
    category: 'maintenance',
    publishedAt: '2025-12-15',
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: true,
  },
  {
    id: '1003',
    title: 'Зээлийн хүүг хэрхэн бууруулахыг мэдэх нь чухал',
    excerpt: 'Зээлийн хүүг эргүүлэлтийг сайтар хэрэгжүүлэх замаар бууруулж болно.',
    content: 'Зээлийн хүүг хэрхэн бууруулах нь бүх зээлэгчийн сонирхдог асуулт юм. Манай эргүүлэлтийн төлөвлөгөө ашигладаг үед та ихэвчлэн 2-3 жилээр хугацаа багасгаж, хүүгээ мэдэгдэхүйц бууруулж болно.',
    bannerImage: '/images/news4.jpg',
    category: 'advice',
    publishedAt: '2025-12-10',
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: true,
  },
  {
    id: '1004',
    title: 'Зээлийн үйлчилгээний танилцуулгын видео',
    excerpt: 'Бидний зээлийн үйлчилгээний шинэ видео танилцуулга нь 5 минутад хүргүүлнэ.',
    content: 'Бидний үйлчилгээний талаар илүү сайн ойлгохын тулд энэ видеог үзнэ үү. Видеонд бидний зээлийн төрлүүд, хүүний хувь, авах нөхцөлийн талаар бүхэл санаа өгөх болно.',
    bannerImage: '/images/news5.jpg',
    category: 'video',
    publishedAt: '2025-12-08',
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: false,
  },
  {
    id: '1005',
    title: 'Бидний сайтанд нэвтэрсэн гишүүдийн амжилтын үлгэрүүд',
    excerpt: 'Бидний үйлчилгээ ашигласан хүмүүсийн амжилтын үлгэрүүдийг сонсоорой.',
    content: 'Өнгөрсөн жилүүдэд бидний зээлийн үйлчилгээг ашигласан олон мянган хүмүүс өөрсдийн мөчлөгийг өөрчилж чадсан. Тэдний амжилтын үлгэрүүд бидний ажилыг урам хүч өгдөг.',
    bannerImage: '/images/news1.jpg',
    category: 'community',
    publishedAt: '2025-12-05',
    isActive: true,
    isPinnedNews: false,
    isPinnedHome: false,
  },
]
