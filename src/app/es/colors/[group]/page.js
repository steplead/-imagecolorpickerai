import { ColorsCollectionView } from '../../../../components/ColorsCollectionView';
export { generateStaticParams, generateMetadata } from '../../../colors/[group]/page';

export default async function EsColorsPage({ params }) {
    const resolvedParams = await params;
    return <ColorsCollectionView params={resolvedParams} locale="es" />;
}
