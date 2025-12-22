import ColorDetail from '../../color/[slug]/page';
export { generateStaticParams, generateMetadata } from '../../color/[slug]/page';

export default function ZhColorPage(props) {
    return <ColorDetail {...props} locale="zh" />;
}
