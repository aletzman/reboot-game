// app/level/[id]/page.tsx
import LevelPage from '@/components/levels/LevelPage'

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params
    return <LevelPage levelId={id} />
}