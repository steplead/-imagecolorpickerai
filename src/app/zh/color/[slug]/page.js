import { ColorDetailView } from '../../../../components/ColorDetailView';
export { generateStaticParams, generateMetadata } from '../../../color/[slug]/page';

export default async function ZhColorPage({ params }) {
    const resolvedParams = await params;
    return <ColorDetailView params={resolvedParams} locale="zh" />;
}
