import { ColorsCollectionView } from '../../../../components/ColorsCollectionView';
export { generateStaticParams, generateMetadata } from '../../../colors/[group]/page';

export default async function PtColorsPage({ params }) {
    const resolvedParams = await params;
    return <ColorsCollectionView params={resolvedParams} locale="pt" />;
}
