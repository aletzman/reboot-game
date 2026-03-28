import LevelPage from '@/components/levels/LevelPage'

export default async function Page({ params }: { params: Promise<{ actId: string, id: string }> }) {
    const { id } = await params
    return <LevelPage levelId={id} />
}
