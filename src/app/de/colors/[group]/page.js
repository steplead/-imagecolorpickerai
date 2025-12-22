import { ColorsCollectionView } from '../../../../components/ColorsCollectionView';
export { generateStaticParams, generateMetadata } from '../../../colors/[group]/page';

export default async function DeColorsPage({ params }) {
    const resolvedParams = await params;
    return <ColorsCollectionView params={resolvedParams} locale="de" />;
}
