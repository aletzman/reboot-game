import ActMapClient from '@/components/map/ActMapClient'

export default async function ActMapPage({ params }: { params: Promise<{ actId: string }> }) {
  const { actId } = await params
  
  return <ActMapClient actId={actId} />
}
